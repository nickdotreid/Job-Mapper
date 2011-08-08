$(document).ready(function(){
	
	$("#chart").bind("fetch",function(event){
		$.getJSON('/posts',function(data){
				alert(data);
			})
	})
	
	$("#job_types").bind("fetch",function(event){
		$.getJSON('/types',function(data){
				if(data['types']){
					for(index in data['types']){
						type = data['types'][index]
						$("#job_types").append('<input type="checkbox" value="'+type+'" id="job_type_'+type+'" name="job_types[]" /><label for="job_type_'+type+'" >'+type+'</label>')
					}
				}
			})
	})
	
	$("#job_types").trigger("fetch");
	
})