
// jshint unused:false
// jshint esnext: true

const $ = require('jquery');
require('imports?jQuery=jquery!bootstrap-sass');
require('imports?jQuery=jquery!bootpag/lib/jquery.bootpag.min.js');
require('imports?jQuery=jquery!jquery-loadingModal/js/jquery.loadingModal.js');




(function () {
   'use strict';

	const config = {
		debug: true,
		istouch:false,
		touchOrClick: '',
		apiKey: '3724975-1917502776b5a3d5b36be5523',
		url: 'https://pixabay.com/api/',
		init: function(){
			let $htmlElem=$('html');
			this.istouch = $htmlElem.hasClass('touch')? true : false;
			this.touchOrClick = this.istouch? 'touchend' :'click' ;
		}

	};
	config.init();

	const  log = {
	  debug (content){
			if ((window.console && window.console.log) && config.debug){
				console.log(content);
			}
		}
	};

	const app = {
		init () {
			this.eventListeners();

			// data.success(function(json){
			// 	console.log(json);
			// });



		},
		buildPagination (){
			return `<div id="page-selection"></div>`
		},
		imageTemplate (obj){

			return `<div class="col-xs-6 col-md-3 result">
				<a href="#" class="thumbnail">
					<img src="${obj.previewURL}" alt="${obj.tags}">
				</a>
			</div>`
		},
		eventListeners (){
			let _this=this;
			$('.search').submit(function(e){
				e.preventDefault();
				//search
				if($('.search-input').val().length > 0) {
					_this.getImages($('.search-input').val());
				}else {

				}

			});
		},
		getImages (searchTerm){
				let that = this;
				$('body').loadingModal({text: 'Showing loader animations...', 'animation': 'rotatingPlane'});

			$.getJSON({
					url: config.url,
					data: {
						key: config.apiKey,
						q: searchTerm,
						image_type:'photo',
						order: 'popular',
						orientation: 'horizontal',
						page: 1,
						per_page: 20
					}
			})
			.done(function( json ) {
				$('body').loadingModal('hide');
				//clear results
				if($('.results').find('.result').length>0) {

					$('.results').find('.result').fadeOut('fast',function(){
					$('#page-selection').unbind('page');

					$('.results').html('');
					$.each(json.hits, function(key, value) {
						$('.results').append(that.imageTemplate(value));
					});

					$('.results').append(that.buildPagination());

				});
				}else{
					$('.results').html('');
					$.each(json.hits, function(key, value) {
						$('.results').append(that.imageTemplate(value));
					});
					$('.results').append(that.buildPagination());
					/*activate the pagination*/
						$('#page-selection').bootpag({
							total: Math.ceil(json.totalHits/20),
							page: 5,
							maxVisible: 6,
							href: '#pro-page-{{number}}',
							leaps: false,
							next: 'next',
							prev: 'prev'
						}).on("page", function(event, /* page number here */ num){
							$("#content").html("Insert content"); // some ajax content loading...
						});

				}
			}).fail(function() {
		    	console.log( "error" );
		 	});
		}
	};
	app.init();

}());