

(function(){
    
	if ( !window.ajsf ) return ;
    
	ajsf.load('aepopup', 'aetween');
	ajsf.ready (function(){
	
		ajsf.stylesheets.inject('.ajsf-lightbox-container{'+ajsf.stylesheets.stringify({
			'text-align': 'center',
			'border':'1px solid #111'
		})+'}') ;
	
		ajsf.stylesheets.inject('.ajsf-lightbox-image{'+ajsf.stylesheets.stringify({
			'height': '100%',
			'max-height': '100%',
			'max-width': '100%;'
	    
		})+'}') ;
	
		_a('a').forEach ( function ( el )
		{
			_a('.lightbox', el).forEach(function(el2)
			{
				el2.on('click' , function (e) {

					ajsf.prevent(e);

					var window = new ajsf.popup.Window ( el2.getAt('title') , '' , '', false ),
					_destroy = function (e){

						window.destroy () ;
					},
					img = ajsf.create(null,'img', 'ajsf-lightbox-image')
						.setAt('src', el.getAt('href'))
						.setAt('alt',el2.getAt('title')) ;
	
		
					window.getCloseLinkEl().remClass('icon16').addClass('icon') ;
					
					window.getMainEl().append(img);
					
					window.getTitleEl().hide() ;
					
					window.getContainer()
						.addClass('ajsf-lightbox-container')
						.stylize({
							'height': '100%',
							'max-height': img.h(),
							'max-width': img.w()
						}).fadeIn() ;
		    
		    
					window.getWrapper().setOpacity(1).on('click', _destroy ).fadeIn() ;

				}) ;
			});
		} ) ;
	    
	}) ;
	
}) () ;
