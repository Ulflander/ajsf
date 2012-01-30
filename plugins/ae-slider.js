
/**********************************
 * AJSF - Aenoa Javascript Framework
 * (c) Xavier Laumonier 2010-2011
 *
 * Since : 1.0.0
 * Author : Xavier Laumonier
 *
 **********************************/

/*
	Package: ajsf.ae-slider
*/
(function(){
	
    if ( !window.ajsf ) return;
    
    ajsf.load('ae-transitions') ;
    
	
    /*
	 	Class: ajsf.Slider
	 	
	 	This class provides methods to quicly create tabs, ajax navigation menu...
	 	
	 	Extends: ajsf.AbstractEvtDispatcher
	*/
    ajsf.Slider = ajsf.AbstractEvtDispatcher.extend({
	
	/*
	 
	Constructor: construct
	
	Container must be a div containing divs to slide
	
	Example:
	(start code)
	
	<div id="slider">
	
	    <div>
		<img src="first-slide.jpg" />
	    </div>
	
	    <div>
		<img src="first-slide.jpg" />
	    </div>
	
	</div>
	
	<input type="button" value="Prev page" id="slider-prev" />
	<input type="button" value="Next page" id="slider-next" />
	
	<script type="text/javascript>
	    
	    ajsf.load ('ae-slider');
	    ajsf.ready ( function () {
		
		var slider = new ajsf.Slider ( _('#slider') ) ;
		
		// Create the prev button
		_('slider-prev').on('click', function ( e ) {
		    ajsf.prevent(e) ;
	
		    slider.previous () ;
		} ) ;
	
	
		// Create the next button
		_('slider-prev').on('click', function ( e ) {
		    ajsf.prevent(e) ;
	
		    slider.next () ;
		} ) ;
		
	    } ) ;
	    
	</script>
	
	(end)
	
	
	Parameters:
	    - container [DOMElement] Container which childs will slide
	 
	 
	 */
	construct: function ( container )
	{
	    this.setContainer ( container ) ;
	},
	
	
	setContainer: function ( container )
	{
	    this._container = _(container) ;
	    
	    this.reset () ;
	},
	
	reset: function ()
	{
	    // Elements
	    this._els = this._container.childs () ;
	    
	    this._length = this._els.length ;
	    
	    // Current page
	    this._current = -1 ;
	    
	    this.__page (0) ;
	},
	
	next: function ()
	{
	    this.page ( this._current + 1 ) ;
	},
	
	previous: function ()
	{
	    this.page ( this._current - 1 ) ;
	},
	
	page: function ( page )
	{
	    if ( page < 0 || page >= this._length || page == this._current ) {
		
		return ;
	    }
	    
	    this.__page( page ) ;
	},
	
	getCurrent: function ()
	{
	    return this._current ;
	},
	
	getTotal: function ()
	{
	    return this._length ;
	},
	
	__page: function ( page )
	{
	    
	    var i = 0 ,
		self = this,
		prev = this._els[this._current],
		next = this._els[page] ,
		delta = page > this._current ? 1 : -1 ;

	
	    for ( i ; i < this._length ; i ++ )
	    {
		if ( i !== page && (i !== page + delta || !prev ) )
		{
		    this._els[i].hide () ;
		}
	    }
	    
	    this._current = page ;
	    
	    this.dispatch ( 'page' ) ;
	    
	    if ( prev )
	    {
		var t = new ajsf.Transition ( 'HSlide' , prev , next, delta ) ;
	    } else {
	       next.show () ;
	    }
	    
	
	}
	
	
    });
}) () ;