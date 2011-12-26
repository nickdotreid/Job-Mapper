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
				d3.select(region[0]).append('div').attr("class","display").selectAll('div.type').data(region.data("types")).enter().append('div').attr("class",function(d){ return "type "+d.short; }).style("width","0px");
				$("#chart .region").trigger("draw");
			}
		});
	}).delegate(".region","draw",function(event){
		region = $(this);
		var x = d3.scale.linear().domain([0, d3.sum(region.data("types"),type_size)]).range([0, $(".display",region).width()]);
		d3.select(this).selectAll(".display .type").transition().duration(1500).style("width",function(d){
			num = x(type_size(d));
			if(num<2){
				return "0px";
			}
			return (num-1)+'px';
		}).style("border-right-width",function(d){
			num = x(type_size(d));
			if(num<2){
				return "0px";
			}
			return "1px";
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
	return short.replace(/ /gi,"_").replace(/\//gi,"_");
}