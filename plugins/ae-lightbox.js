

(function(){
    
    if ( !window.ajsf ) return ;
    
    var style = 
    ajsf.load('aepopup');
    ajsf.ready (function(){
	
	ajsf.stylesheets.inject('.ajsf-lightbox-container{'+ajsf.stylesheets.stringify({
	    'text-align': 'center'
	})+'}') ;
	
	ajsf.stylesheets.inject('.ajsf-lightbox-image{'+ajsf.stylesheets.stringify({
	    'height': '100%',
	    'max-height': '100%',
	    'max-width': '100%;'
	    
	})+'}') ;
	
	_a('a').forEach ( function ( el )
	{
	    _a('.lightbox').forEach(function(el2)
	    {
		el.on('click' , function (e) {

		    ajsf.prevent(e);

		    var window = new ajsf.popup.Window ( el.getAt('title') , '' , '', false ),
			_destroy = function (e){
			    window.destroy () ;
			},
			img = ajsf.create(null,'img', 'ajsf-lightbox-image')
			    .setAt('src', el.href)
			    .setAt('alt',el.getAt('title')) ;
	
		
		    window.getCloseLinkEl().remClass('icon16').addClass('icon') ;
		    window.getContainer().addClass('ajsf-lightbox-container') ;
		    window.getMainEl().append(img);
		    window.getTitleEl().hide() ;
		    window.getContainer().stylize({
			'height': '100%',
			'max-height': img.h(),
			'max-width': img.w()
		    }) ;
		    
		    
		    window.getWrapper().setOpacity(1).on('click', _destroy ) ;

		}) ;
	    });
	} ) ;
	    
    }) ;
	
}) () ;
