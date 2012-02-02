(function(){
	
    if ( !window.ajsf ) return;

    ajsf.load('aedrag') ;
	
    /*
		Class: ajsf.FormSlider
		
		Let create form sliders that replaces form input
	*/
    ajsf.InputSlider = ajsf.AbstractEvtDispatcher.extend({
		
	construct: function ( options )
	{
	    if ( !options.input )
	    {
		throw new Error('ajsf.InputSlider') ;
	    }
		    
	    this.input = options.input ;
		    
	    this.hide = options.hide || true ;
		    
	    this.input.hide () ;
		    
	    this.start = options.start || 0 ;
		    
	    this.end = options.end || 1 ;
		    
	    this.stepped = options.stepped || false ;
	    
	    this.cursors = options.cursors || 1 ;
	    
	    this.initial = option.initial || 0 ;
	    
	    this._values = [] ;
	    
	    this.container = ajsf.element() ;
	},
	
	/*
	    Function: getContainer
	
	    Returns the slide container
	
	    Returns:
	    [DOMElement] The slider container
	 
	 */
	getContainer: function ()
	{
	    return this.container ;
	},
	
	/*
	    Function: getInput
	
	    Returns the slide container
	
	    Returns:
	    [DOMElement] The input element populated by the 
	 
	 */
	getInput: function ()
	{
	    return this.container ;
	},
	
	getValue: function ()
	{
	    return this._values.join(',') ;
	},
	
	
	_build: function ()
	{
	    if ( this.hide )
	    {
		 this.input.hide () ;
	    }
	},
	
	_refresh: function (e)
	{
	    for ( var i = 0 ; i < this.cursors ; i ++ )
	    {
		this._values[i] = 0 ;
	    }
	},
	
	_getValByCursor: function ( index )
	{
	    
	}
		
    }) ;
})();