(function ( $ ) {
	"use strict";

	$(function () {
		
		$("#mapstyle_addnew").on("click", function(e){
			e.preventDefault();
			var lastid = $("#mapstyle-list li:last").data('id');
			lastid = parseInt(lastid)+1;
			var output = 
			'<li data-id="'+lastid+'">'
				+'<p><label for="">Title</label><input type="text" name="travellerpress_settings['+lastid+'][title]"></p>'
				+'<p><label for="">Code</label><textarea name="travellerpress_settings['+lastid+'][style]" id="" cols="30" rows="10"></textarea></p>'
			+'<a class="fold" href="#"><span class="dashicons dashicons-arrow-right toggle"></span></a>'
			+'<a class="delete" href="#"><span class="dashicons dashicons-dismiss"></span></a>'
			+'</li>';

			
			//output.append("#mapstyle-list");
			$("#mapstyle-list").append(output);
		});

		$("#mapstyle-list").on("click", ".delete", function(e){
			$(this).parent().remove();
		});

		$("#mapstyle-list").on('click','.toggle:not(.active)',function(e){
			e.preventDefault();
			$(this).parents('li').find('.tp-foldable').slideDown();
			$(this).removeClass('dashicons-arrow-right').addClass('dashicons-arrow-down active')
		});
		$("#mapstyle-list").on('click','.toggle.active',function(e){
			e.preventDefault();
			$(this).parents('li').find('.tp-foldable').slideUp();
			$(this).removeClass('dashicons-arrow-down active').addClass('dashicons-arrow-right')
		});
	  /*eof*/

	});
}(jQuery));

