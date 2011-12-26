$(document).ready(function(){
	
	$("#job_types input").click(function(event){
		$("#chart .region").trigger("draw");
	});
	
	$("#content").delegate(".type","mouseenter",function(event){
		class_names = "."+$(this).attr("class").replace(" ",".");
		$("#content "+class_names).addClass("selected");
	}).delegate(".type","mouseleave",function(event){
		class_names = "."+$(this).attr("class").replace(" ",".").replace(" selected","");
		$("#content "+class_names).removeClass("selected");		
	});
	
	$("#add_new").delegate("input.region","change",function(event){
		form = $(this).parents("form:first");
		$(".quick_add",form).html("");
		$.ajax({
			url:'/regions',
			type:'POST',
			data:{
				term:this.value
			},
			success:function(data){
				if(data['regions']){
					for(index in data['regions']){
						region = data['regions'][index]
						short = region.short;
						name = region.short;
						if(region.name){
							name = region.name
						}
						$(".quick_add",form).append('<li><a href="'+region.short+'">'+region.short+'</a></li>');
					}
				}
			}
		});
	}).delegate(".quick_add a",'click',function(event){
		event.preventDefault();
		$("#content").trigger({
			type:'add_region',
			short:$(this).attr("href"),
			name:$(this).html()
		});
	});
	
	$("#content").trigger({
		type:'add_region',
		short:'sfc',
		name:'San Francisco'
	});
});