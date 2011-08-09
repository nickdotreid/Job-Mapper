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
		type_divs = $(".type",region);
		types = region.data("types")
		for(var i=0;i<type_divs.length;i++){
			type = false;
			div = $(type_divs[i]);
			div_type = div.attr('class').replace(/type/gi,'').replace(/ /gi,'');
			for(t in types){
				if(t==div_type){
					type = t;
				}
			}
			if(type){
				new_width = Math.floor((types[type]/region.data("total"))*region.width())-1 // extra 1 == right border width
				div.data("amount",types[type]).show().animate({width:new_width+"px"},{duration:1000,queue:false})
			}else{
				div.animate({width:'0px'},{duration:300,complete:function(){
					type = $(this)
					if(type.width()<1){
						type.hide();
					}
				}})
			}
		}
		
		for(type in types){
			new_width = Math.floor((types[type]/region.data("total"))*region.width())-1 // extra 1 == right border width
			$(".type."+type+"",region).data("amount",types[type]).show().animate({width:new_width+"px"},{duration:1000,queue:false})
		}
	}).bind("highlight",function(event){
		region = $(this);
		$('.type.selected',region).removeClass("selected");
		$(".note").html(region.data("total")+" posts total.")
		if(event.post_type){
			$(".type."+event.post_type,region).addClass("selected")
			$(".note",region).html($("#job_types .type."+event.post_type).data("name")+" // "+$(".type."+event.post_type,region).data("amount")+" posts.")
		}
	}).trigger("highlight")
	
	$("#job_types").bind("fetch",function(event){
		$.getJSON('/types',function(data){
				if(data['types']){
					for(index in data['types']){
						type = data['types'][index]['short'];
						name = data['types'][index]['short'];
						if(data['types'][index]['name']){
							name = data['types'][index]['name'];
						}
						$(".region .display").append('<div class="type '+type+'"></div>');
						$("#job_types").append('<div class="type '+type+'"><input type="checkbox" value="'+type+'" id="job_type_'+type+'" name="job_types[]" /><label for="job_type_'+type+'" >'+name+'</label></div>')
						$("#job_types .type:last").data("name",name);
					}
					$("#job_types input").attr("checked",true)
					$(".region").trigger("fetch")
				}
			})
	}).delegate('.type input','click',function(event){
		$(".region").trigger("fetch");
	});
	
	$("#content").delegate('.type','mouseover',function(event){
		$(".region").trigger({
			type:'highlight',
			post_type:$(this).attr('class').replace(/type/gi,'').replace(/ /gi,'')
		})
	}).delegate('.type','mouseout',function(event){
		$(".region").trigger("highlight");
	})
	
	$("#job_types").trigger("fetch");
	
})