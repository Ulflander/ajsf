(function(){
	
    if ( !window.ajsf ) return;

    if ( !ajsf.forms ) ajsf.forms = {} ;
    
    if ( !ajsf.forms.styles ) ajsf.forms.styles = {} ;

    ajsf.forms.styles.HInputSlider = {
	width: '200px',
	height: '20px',
	display: 'inline-block',
	position: 'relative',
	border: '1px solid #000'
    } ;
    
    ajsf.forms.styles.VInputSlider = {
	width: '20px',
	height: '200px',
	display: 'inline-block',
	position: 'relative',
	border: '1px solid #000'
    } ;
    
    ajsf.forms.styles.HInputSliderHr = {
	height: '1px',
	background: '#000',
	position: 'absolute',
	left: 0,
	right: 0,
	top: '9px'
    } ;

    ajsf.forms.styles.Cursor = {
	height: '20px',
	width: '20px',
	background: '#000',
	position: 'absolute'
    } ;
    
    ajsf.load('aedrag') ;
    
	
    /*
		Class: ajsf.FormSlider
		
		Let create form sliders that replaces form input
	*/
    ajsf.forms.InputSlider = ajsf.AbstractEvtDispatcher.extend({
		
	construct: function ( options )
	{
	    if ( !options.input )
	    {
		throw new Error('ajsf.forms.InputSlider') ;
	    }
	    
	    this.input = options.input ;
		    
	    this.hide = options.hide === false ? false : true ;
		    
	    this.start = options.start || 0 ;
		    
	    this.end = options.end || 1 ;
		    
	    this.stepped = options.stepped || false ;
	    
	    this.cursors = options.cursors || 1 ;
	    
	    this.initial = options.initial || 0 ;
	    
	    this._values = [] ;
	    
	    this._cursors = [] ;
	    
	    this._build () ;
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
	    if ( this.hide === true )
	    {
		 this.input.hide () ;
	    }
	    
	    
	    this.container = ajsf.element() ;
	    
	    this.hr = ajsf.element('hr') ;
	    
	    this.container.stylize(ajsf.forms.styles.HInputSlider) ;
	    
	    this.container.append(this.hr);
	    
	    this.input.insertAfter(this.container) ;
	    
	    for ( var i = 0, cursor ; i < this.cursors ; i ++ )
	    {
		cursor = ajsf.create ( 'div' ) ;
		
		cursor.stylize ( ajsf.forms.styles.Cursor ) ;
		
		
		
		this.container.append ( cursor ) ;
		
		this._cursors[i] = new ajsf.Drag ( cursor , 0, 0, this.container.w () - cursor.w() , 0 ) ;
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