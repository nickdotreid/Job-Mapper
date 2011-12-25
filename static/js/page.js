$(document).ready(function(){
	$("#content").bind("add_region",function(event){
		$("#content #chart").append('<div class="region '+event.region+'" data-short="'+event.region+'"><h3 class="title">'+event.region+'</h3></div>');
		$(".region").trigger("fetch");
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
				d3.select(region[0]).append('div').attr("class","display").selectAll('div.type').data(types).enter().append('div').attr("class","type").style("width","0px");
				$(".region").trigger("draw");
			}
		});
	}).delegate(".region","draw",function(event){
		region = $(this);
		var x = d3.scale.linear().domain([0, region.data("total")]).range(["0px", $(".display",region).width()+"px"]);
		d3.selectAll(".region .display .type").transition().duration(1500).style("width",function(d){
			if(!$("#"+d.short).attr("checked")){
				return "0px";
			}
			return x(d.size);
		});
	}).trigger({
		type:'add_region',
		region:'sfc'
	});
	
})