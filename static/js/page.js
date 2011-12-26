$(document).ready(function(){
	$("#content").trigger({
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
	});
});