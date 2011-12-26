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
				d3.select(region[0]).append('div').attr("class","display").selectAll('div.type').data(types).enter().append('div').attr("class","type").style("width","0px");
				$("#chart .region").trigger("draw");
			}
		});
	}).delegate(".region","draw",function(event){
		region = $(this);
		var x = d3.scale.linear().domain([0, region.data("total")]).range([0, $(".display",region).width()]);
		d3.select(this).selectAll(".display .type").transition().duration(1500).style("width",function(d){
			num = x(d.size)
			if(num<2 || !$("#"+d.short).attr("checked")){
				return "0px";
			}
			return (num-1)+'px';
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
})