$(document).ready(function(){
	
	
	$("#content").bind("add_region",function(event){
		new_region = $("#content .region.template").clone()
		new_region.removeClass("template").insertBefore("#content .region:last")
		$(".title",new_region).html(event.region)
		new_region.data("short",event.region)
		new_region.trigger("fetch");
	}).delegate(".region","fetch",function(event){
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
				types:inputs,
				region:region.data('short')
			},
			success:function(data){
				if(data['types']){
					total = 0;
					for(type in data['types']){
						amount = data['types'][type];
						total += amount;
						$(".type."+type,region).data("amount",amount);
					}
					region.data("types",data['types']).data("total",total).trigger("draw");
				}
			}
		});
	}).delegate(".region","draw",function(event){
		region = $(this)
		type_divs = $(".type",region);
		types = region.data("types")
		total = region.data("total");
		for(var i=0;i<type_divs.length;i++){
			type = false;
			div = $(type_divs[i]);
			div_type_name = div.attr('class').replace(/type/gi,'').replace(/ /gi,'');
			for(t in types){
				if(t==div_type_name){
					type = t;
				}
			}
			new_width = Math.floor((types[type]/total)*region.width())-1 // extra 1 == right border width
			if(new_width>0){
				div.show().animate({width:new_width+"px"},{duration:700,queue:false})
			}else{
				div.animate({width:'0px'},{duration:200,complete:function(){
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
		region.trigger("highlight");
	}).delegate(".region","highlight",function(event){
		region = $(this);
		$('.type.selected',region).removeClass("selected");
		$(".note").html(region.data("total")+" posts total.")
		if(event.post_type){
			$(".type."+event.post_type,region).addClass("selected")
			$(".note",region).html($("#job_types .type."+event.post_type).data("name")+" // "+$(".type."+event.post_type,region).data("amount")+" posts.")
		}
	});
	
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
					$("#content").trigger({
						type:"add_region",
						region:"sfbay.craigslist.org"
					})
				}
			})
	}).delegate('.type input','click',function(event){
		$(".region").trigger("fetch");
	});
	
	$("#content").delegate('.type','mouseover',function(event){
		$(".region:not(.template)").trigger({
			type:'highlight',
			post_type:$(this).attr('class').replace(/type/gi,'').replace(/ /gi,'')
		})
	}).delegate('.type','mouseout',function(event){
		$(".region:not(.template)").trigger("highlight");
	})
	
	$("#region").autocomplete({source:function(request,response){
		$.ajax({
			url:'/regions',
			type:'post',
			dataType:'json',
			data:{
				term:request.term
			},
			success:function(data){
				response(data['regions'])
			}
		});
	}});
	
	$("#add_new").submit(function(event){
		event.preventDefault();
		$("#content").trigger({
			type:"add_region",
			region:$("#region").val()
		})
	})
	
	$("#job_types").trigger("fetch");
	
})