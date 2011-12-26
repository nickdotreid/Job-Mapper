$(document).ready(function(){
	$("#content").bind("add_region",function(event){
		short = event.short;
		name = event.short;
		if(event.name){
			name = event.name;
		}
		$("#content #chart").append('<div class="region '+short_to_class_name(short)+'" data-short="'+short+'"><h3 class="title">'+name+'</h3><div class="count"><span class="number"></span> Job Postings</div></div>');
		$(".region."+short_to_class_name(short)).trigger("fetch");
	}).delegate(".region","fetch",function(event){
		region = $(this)
		region.addClass("loading");
		$.ajax({
			url:'/posts',
			type:'post',
			dataType:'json',
			data:{region:region.data('short')},
			success:function(data){
				region.removeClass("loading");
				if(!data['types'] || data['types'].length<1){
					region.addClass("error");
					region.append('<div class="message">There was an error loading this region.</div>');
					setTimeout('$("#chart .region.'+short_to_class_name(region.data("short"))+'").remove();',3000);
					return false;
				}
				region.data("total",data['total']);
				region.data("types",data['types']);
				d3.select(region[0])
					.append('svg:svg').attr("class","display").
						attr("height",50)
					.selectAll('rect').data(region.data("types")).enter().append('svg:rect')
						.attr("class",function(d){ return "type "+d.short; })
						.attr("x",0)
						.attr("y",0)
						.attr("width",0)
						.attr("height",50);
				$("#chart .region").trigger("draw");
			}
		});
	}).delegate(".region","draw",function(event){
		region = $(this);
		total = d3.sum(region.data("types"),type_size);
		
		$(".count .number",region).html(addCommas(total));
		
		var x = d3.scale.linear().domain([0, total]).range([0, region.width()]);
		var xpos = 0;
		d3.select(this).selectAll("rect").transition().duration(1500).attr("x",function(d){
			return xpos;
		}).attr("width",function(d){
			num = x(type_size(d));
			xpos += num
			return num;
		});
	}).delegate(".region",'close',function(event){
		$(this).remove();
	});
});

function type_size(d){
	if(!$("#"+d.short).attr("checked")){
		return 0;
	}
	return d.size;
}
function short_to_class_name(short){
	return short.replace(/ /gi,"_").replace(/\//gi,"_").replace(/\./gi,"_");
}

function addCommas(nStr){
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}