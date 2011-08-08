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
				if(data['total']){
					$(".region").data("total",data['total'])
				}
				if(data['types']){
					$(".region").data("types",data['types']).trigger("draw")
				}
			}
		});
	}).bind("draw",function(event){
		region = $(this)
		$(".types",region).hide()
		types = region.data("types")
		for(type in types){
			$(".type."+type+"",region).data("amount",types[type]).show().width(Math.floor((types[type]/region.data("total"))*region.width())-1)
		}
	})
	
	$("#job_types").bind("fetch",function(event){
		$.getJSON('/types',function(data){
				if(data['types']){
					for(index in data['types']){
						type = data['types'][index]
						$(".region .display").append('<div class="type '+type+'"></div>');
						$("#job_types").append('<div class="type '+type+'"><input type="checkbox" value="'+type+'" id="job_type_'+type+'" name="job_types[]" /><label for="job_type_'+type+'" >'+type+'</label></div>')
					}
					$("#job_types input").attr("checked",true)
					$(".region").trigger("fetch")
				}
			})
	}).delegate('.type','mouseover',function(event){
		$(".region ."+$(this).attr('class').replace(/ /gi,'.')).addClass("selected");
	}).delegate('.type','mouseout',function(event){
		$(".region ."+$(this).attr('class').replace(/ /gi,'.')).removeClass("selected");
	})
	
	$("#job_types").trigger("fetch");
	
})