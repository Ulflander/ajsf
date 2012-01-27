(function(){
    
    
    ajsf.Slide = ajsf.Class.extend({
		
	construct: function ()
	{
	    this.title = '' ;
	    this.content = '' ;
	    this.breadcrumb = '' ;
	    this.image = null ;
	}
    
    }) ;
    /*
	    Class: ajsf.AutoSlides
	*/
    ajsf.AutoSlides = ajsf.Class.extend({
		
	construct: function ( mainElement )
	{
	    var nodes = mainElement.childNodes ;
		    
	    // Creates slides and summarys
	    this._slides = [] ;
	    
	    this._summary = [] ;
	    
	    var bc = [],
	    title = '',
	    main = '',
	    wasP = false,
	    slide ;
	    
	    this._footer = '' ;
		    
			
	    for ( var k in nodes )
	    {
		try {
		    var node = _(nodes[k]) ;

		    if ( node.tagName )
		    {
			switch ( node.tagName )
			{
			    case 'H1':
				slide = new ajsf.Slide () ;
				main = title = slide.title = node.getHtml() ;
				bc = [main] ;
				wasP = false ;
				this._slides.push ( slide ) ;
				break;
			    case 'H2':
			    case 'H3':
				slide = new ajsf.Slide () ;
				title = slide.title = node.getHtml() ;
				bc = [main, title] ;
				slide.breadcrumb = bc.join(' &raquo; ') ;
				wasP = false ;
				break;
			    case 'P':
				if ( wasP )
				{
				    slide.content = slide.content + '<br /><br />' + node.getHtml () ;
				    wasP = true ;
				    break;
				}
				slide = new ajsf.Slide () ;
				slide.title = title ;
				slide.content = node.getHtml() ;
				slide.breadcrumb = bc.join(' &raquo; ') ;
				wasP = true ;
				this._slides.push ( slide ) ;
				break;
			    case 'IMG':
				slide = new ajsf.Slide () ;
				slide.title = title + ' - ' + (node.getAt('title') || '') ;
				slide.content = node.getHtml() ;
				slide.breadcrumb = bc.join(' &raquo; ') ;
				slide.image = node.getAt('src') ;
				wasP = false ;
				this._slides.push ( slide ) ;
				break;
			    case 'FOOTER':
				this._footer = node.getHtml();
				wasP = false ;
				break;
			}
		    }
		    
		    
		
		    
		    node.hide () ;
		    
		} catch (e) {}
		
	    }
	    
	    this._length = this._slides.length ;
	    
	    this._container = ajsf.create(null,'div','slides').stylize({
		display: 'block',
		position: 'absolute',
		padding: '3%',
		zIndex: 10000,
		background: '#fff',
		right: '3%',
		bottom: '3%',
		top: '3%',
		left: '3%',
		border: '10px solid #eee'
	    });
		    
	    this._container.addClass('shadowed');
	    _(_d.body).append(this._container);
	    
	    _d.body.stylize({
		overflow: 'hidden',
		position: 'absolute',
		width: '100%',
		height: '100%',
		background: '#222'
	    });
	    
	    _d.addListener('keyup',ajsf.delegate(this,function(e){
		ajsf.prevent(e);
		if ( _d.hasFocus())
		{

		    var intKeyCode = e.keyCode;
					
		    switch(intKeyCode){
			case 37:
			    this.gotoPrevious() ;
			    break;
			case 39:
			    this.gotoNext() ;
			    break;
			case 38:
			    this.gotoSlide ( 0 ) ;
			    break;
			case 40:
			    this.gotoSlide ( this._length - 1 ) ;
			    break;
		    }
		}
	    }));
	    
	    this._current = -1 ;
	    
	    this.gotoSlide ( 0 ) ;
	},
	
	gotoSlide: function (num)
	{
	    var slide,
	    content = ajsf.create() ;
	    
	    if ( num < 0 || num > this._length -1 || num == this._current )
	    {
		return;
	    }
	    
	    this._current = num ;
		
	    slide = this._slides[num] ;
	    
	    this._container.empty () ;
	    
	    var page = (this._current + 1) + '/' + (this._length) + ' ';
	    
	    this._container.append(
		ajsf.create(null,'h2','bold').html ( page + slide.breadcrumb ) ,
		ajsf.create(null,'h1','huge').html ( slide.title ) ,
		content
		) ;
		
	    if ( slide.image )
	    {
		var img = ajsf.create(null,'img').setAt ( 'src' , slide.image ) ;
		
		content.append ( img ) ;
		content.setClass('img')
	    } else if ( slide.content != '' ) {
		content.append ( ajsf.create(null,'p','huge').html(slide.content) ) ;
	    }
	    
	    if ( this._footer != '' )
	    {
		this._container.append ( ajsf.create ( null, 'footer').stylize({
		    position: 'absolute',
		    bottom: '10px',
		    right: '10px'
		}).html( this._footer ) ) ;
	    }
	    
	},
	
	gotoNext: function ()
	{
	    this.gotoSlide ( this._current + 1 ) ;
	},
	
	gotoPrevious: function ()
	{
	    this.gotoSlide ( this._current - 1 ) ;
	}
		
	
    }) ;
	
})();
