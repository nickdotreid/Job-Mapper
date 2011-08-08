$(document).ready(function(){
	
	$("#chart").bind("fetch",function(event){
		$.ajax({
			url:'/jobs',
			complete:function(data){
				alert(data);
			}
		})
	})
	
})