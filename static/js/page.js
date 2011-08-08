$(document).ready(function(){
	
	$(".region").bind("fetch",function(event){
		region = $(this)
		
		inputs = ""
		checkboxes = $("#job_types input:checked")
		for(var i=0;i<checkboxes.length;i++){
			if(inputs!=""){
				inputs += ","
			}
			inputs += checkboxes[i].value
		}
		
		$.ajax({
			url:'/posts',
			type:'post',
			dataType:'json',
			data:{
				types:inputs
			},
			success:function(data){
				alert(data)
			}
		});
	}).bind("draw",function(event){
		
	})
	
	$("#job_types").bind("fetch",function(event){
		$.getJSON('/types',function(data){
				if(data['types']){
					for(index in data['types']){
						type = data['types'][index]
						$("#job_types").append('<input type="checkbox" value="'+type+'" id="job_type_'+type+'" name="job_types[]" /><label for="job_type_'+type+'" >'+type+'</label>')
					}
					$("#job_types input").attr("checked",true)
				}
			})
	})
	
	$("#job_types").trigger("fetch");
	
})