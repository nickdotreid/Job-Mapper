$(document).ready(function(){
	$("#content").bind("add_region",function(event){
		$("#content #chart").append('<div class="region '+short_to_class_name(event.region)+'" data-short="'+event.region+'"><h3 class="title">'+event.region+'</h3></div>');
		$(".region."+short_to_class_name(event.region)).trigger("fetch");
	}).delegate(".region","fetch",function(event){
		region = $(this)
		$.ajax({
			url:'/posts',
			type:'post',
			dataType:'json',
			data:{region:region.data('short')},
			success:function(data){
				if(!data['types'] || data['types'].length<1){
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
		var x = d3.scale.linear().domain([0, d3.sum(region.data("types"),type_size)]).range([0, region.width()]);
		xpos = 0;
		d3.select(this).selectAll("rect").transition().duration(1500).attr("x",function(d){
			return xpos;
		}).attr("width",function(d){
			num = x(type_size(d));
			xpos += num
			return num;
		});
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