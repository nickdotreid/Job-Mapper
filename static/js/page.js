$(document).ready(function(){
	$("#content").bind("add_region",function(event){
		$("#content #chart").append('<div class="region '+event.region+'" data-short="'+event.region+'"><h3 class="title">'+event.region+'</h3></div>');
		$(".region:last").trigger("fetch");
	}).delegate(".region","fetch",function(event){
		region = $(this)
		
		inputs = ""
		$("#job_types input:checked").each(function(){
			if(inputs!=""){
				inputs += ","
			}
			inputs += this.value
		});
		
		$.ajax({
			url:'/posts',
			type:'post',
			dataType:'json',
			data:{
				types:inputs,
				region:region.data('short')
			},
			success:function(data){
				if(!data['types']){
					alert("ERROR");
				}
				region.data("total",data['total']);
				types = [];
				for(type in data['types']){
					types.push({
						'short':type,
						'size':data['types'][type],
					});
				}
				region.data("types",types);
				d3.select(region[0]).append('div').attr("class","display").selectAll('div.type').data(types).enter().append('div').attr("class",function(d){
					return "type "+d.short;
				}).style("width","0px");
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
			return (num)+'px';
		}).style("border-right-width",function(d){
			num = x(type_size(d));
			if(num<2){
				return "0px";
			}
			return "1px";
		});
	}).trigger({
		type:'add_region',
		region:'sfc'
	});
	
	$("#job_types input").click(function(event){
		$("#chart .region").trigger("draw");
	});
	
	$("#content").delegate(".quick_add a","click",function(event){
		event.preventDefault();
		$("#content").trigger({
			type:'add_region',
			region:$(this).attr("href")
		});
	});
	
	$("#content").delegate(".type","mouseenter",function(event){
		class_names = "."+$(this).attr("class").replace(" ",".");
		$("#content "+class_names).addClass("selected");
	}).delegate(".type","mouseleave",function(event){
		class_names = "."+$(this).attr("class").replace(" ",".").replace(" selected","");
		$("#content "+class_names).removeClass("selected");		
	})
})

function type_size(d){
	if(!$("#"+d.short).attr("checked")){
		return 0;
	}
	return d.size;
}