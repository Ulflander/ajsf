(function(){
	
    if ( !window.ajsf ) return;

    if ( !ajsf.forms ) ajsf.forms = {} ;
    
    if ( !ajsf.forms.styles ) ajsf.forms.styles = {} ;

    ajsf.forms.styles.HInputSlider = {
	width: '200px',
	height: '40px',
	display: 'inline-block',
	position: 'relative',
	margin: '0 10px'
    } ;
    
    ajsf.forms.styles.VInputSlider = {
	width: '40px',
	height: '200px',
	display: 'inline-block',
	position: 'relative',
	margin: '10px 0'
    } ;
    
    ajsf.forms.styles.HInputSliderHr = {
	height: '1px',
	background: '#ddd',
	position: 'absolute',
	left: 0,
	right: 0
    } ;
    
    ajsf.forms.styles.VInputSliderHr = {
	width: '1px',
	height: '100%',
	top: 0,
	paddingTop: 0,
	marginTop: 0,
	background: '#ddd',
	position: 'absolute',
	left: '10px'
    } ;

    ajsf.forms.styles.Cursor = {
	height: '20px',
	width: '20px',
	background: '#aaa',
	cursor: 'pointer',
	position: 'absolute'
    } ;
    
    ajsf.forms.styles.Gap = {
	height: '10px',
	width: '10px',
	background: '#aaf',
	position: 'absolute'
    } ;
    
    ajsf.forms.styles.HSliderLabel = {
	position: 'absolute',
	fontSize: '0.8em',
	background: 'transparent url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAKCAIAAAD6sKMdAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABRJREFUeNpiePfuHRMDAwMhDBBgAGuMAt0J4LruAAAAAElFTkSuQmCC) no-repeat center 5px'
    } ; 
    
    
    ajsf.forms.styles.VSliderLabel = {
	position: 'absolute',
	fontSize: '0.8em',
	background: 'transparent url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAABCAIAAABol6gpAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABFJREFUeNpifPfuHQNuABBgAFEgAszhqqD2AAAAAElFTkSuQmCC) no-repeat 5px center '
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
	    
	    
	    this.min = 0 ;
	    
	    this.max = options.max ? parseInt(options.max) : 1 ;
	    
	    this.decimals = (function(d){
		
		if ( d === undefined ) {
		    return 1 ;
		}
		
		d = parseInt(d) ;
		
		if ( !isNaN(d) ) {
		    return d ;
		}
		
		return 1 ;
	    })( options.decimals )
		    
	    this.hide = options.hide === false ? false : true ;
		    		    
	    this.stepped = options.stepped && options.stepped === true ? true : false ;
	    
	    this.cursors = options.cursors || 1 ;
	    
	    this.initial = options.initial || 0 ;
	    
	    this.vertical = options.vertical && options.vertical === true ? true : false ;
	    
	    this.steps = parseInt(options.steps) || 0 ;
	    
	    this.mode = options.mode || ajsf.forms.InputSlider.VALUE ;
	    
	    this.invert = options.invert === true ? true : false ;
	    
	    this.w = this.vertical ? 'h' : 'w' ;
	    this.x = this.vertical ? 'getTop' : 'getLeft' ;
	    this.sx = this.vertical ? 'setTop' : 'setLeft' ;
	    
	    this.labelcb = options.label || function ( label ) {
		return label ;
	    } 
	    
	    this._values = [] ;
	    
	    this._cursors = [] ;
	    
	    this.cursor = null ;
	    
	    this.gapCursor = null ;
	    
	    this.cursorDragger = null ;
	    
	    this.gapCursorDragger = null ;
	    
	    if ( options.width )
	    {
		ajsf.forms.styles.HInputSlider.width = options.width + 'px' ;
		ajsf.forms.styles.VInputSlider.width = options.width + 'px' ;
	    }
	    if ( options.height )
	    {
		ajsf.forms.styles.HInputSlider.height = options.height + 'px' ;
		ajsf.forms.styles.VInputSlider.height = options.height + 'px' ;
	    }
	    
	    this.size = 0 ;
	    
	    this.inited = false ;
	    
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
	    return this.input ;
	},
	
	getValue: function ()
	{
	    return this._values.join(',') ;
	},
	
	setValue: function ( val )
	{
	    if ( this.mode == ajsf.forms.InputSlider.GAP && val.toString().indexOf(',') > -1 )
	    {
		var vals = val.split(',') ;
		
		
		vals[0] = this.validate(vals[0]) ;
		vals[1] = this.validate(vals[1]) ;
		
		
		this.cursor[this.sx] ( (this.size - this.cursor[this.w]() + 20) * (100 * vals[0] / this.max) / 100 - (this.cursor[this.w]() / 2) ) ;
		
		this.gapCursor[this.sx] ( (this.size - this.cursor[this.w]() + 20) * (100 * vals[1] / this.max) / 100 - (this.cursor[this.w]() / 2) ) ;
		
		
	    } else if ( this.cursor ) {
		
		val = this.validate(val) ;
		
		this.cursor[this.sx] ( (this.size - this.cursor[this.w]() + 20) * (100 * val / this.max) / 100 - (this.cursor[this.w]() / 2) ) ;
	    }
	    
	    this._refresh () ;
	} ,
	
	validate: function ( val )
	{
	    return val < this.min ? this.min : val > this.max ? this.max : val ;
	},
	
	validatePos: function ( val , min )
	{
	    min = min || -10 ;
	    return val < min ? min : val > this.size ? this.size : val ;
	},
	
	_build: function ()
	{
	    
	    
	    if ( this.hide === true )
	    {
		this.input.hide () ;
	    }
	    
	    
	    // Create main element
	    this.container = ajsf.element('div','ajsf-slider') ;
	    
	    this.hr = ajsf.element('hr') ;
	    
	    if ( !this.vertical )
	    {
		this.container.stylize(ajsf.forms.styles.HInputSlider) ;
		this.hr.stylize ( ajsf.forms.styles.HInputSliderHr) ;
	    } else {
		this.container.stylize(ajsf.forms.styles.VInputSlider) ;
		this.hr.stylize ( ajsf.forms.styles.VInputSliderHr) ;
	    }
	    
	    this.container.append(this.hr);
	    
	    this.input.insertAfter(this.container) ;
	    
	    
	    this.size = this.container[this.w] () > 0 ? this.container[this.w] () : this.vertical ? parseInt(ajsf.forms.styles.VInputSlider.height) : parseInt(ajsf.forms.styles.HInputSlider.width) ;
	    
	    
	    
	    
	    if ( this.mode == ajsf.forms.InputSlider.GAP )
	    {
		this.gap = ajsf.element ('div', 'slider-gap').stylize(ajsf.forms.styles.Gap ) ;
		
		this.container.append ( this.gap ) ;
	    }
	    
	    
	    var i = 1, label, val, labelStyles = this.vertical ? ajsf.forms.styles.VSliderLabel : ajsf.forms.styles.HSliderLabel ;
	    
	    // Create main labels 
	    this.labels = {
		start: ajsf.element('span', 'slider-label first-label')
		.stylize(labelStyles)
		.html(this.labelcb(this.invert?this.max:this.min)) ,
		end: ajsf.element('span', 'slider-label last-label')
		.stylize(labelStyles)
		.html(this.labelcb(this.invert?this.min:this.max)) 
	    } ;
	    
	    
	    
	    this.container.append(this.labels.start);
	    
	    // Position of labels
	    if ( !this.vertical )
	    {
		this.labels.start.stylize({
		    left: 0,
		    paddingTop: '25px',
		    backgroundPosition: 'left 5px'
		});
		this.labels.end.stylize({
		    right: '-10px',
		    paddingTop: '25px',
		    marginLeft: '10px',
		    backgroundPosition: '10px 5px'
		});
	    } else {
		this.labels.start.stylize({
		    top: 0,
		    paddingLeft: '25px',
		    marginTop: '-10px',
		    backgroundPosition: '5px 10px'
		});
		this.labels.end.stylize({
		    bottom: '-10px',
		    paddingLeft: '25px',
		    backgroundPosition: '5px 5px'
		});
	    }
	    
	    // Create steps labels
	    for ( i ; i < this.steps ; i ++ )
	    {
		val = this.max / this.steps * (this.invert ? this.steps - i : i) ;
		
		label = ajsf.element('span', 'slider-label')
		.stylize( labelStyles )
		.html( this.labelcb(val.toFixed(this.decimals)) ) ;
		
		this.container.append ( label ) ;
		
		if ( !this.vertical )
		{
		    label.stylize({
			left: ((this.size / (this.steps) * i) - label[this.w]()/2) + 'px',
			paddingTop: '25px'
		    });
		} else {
		    label.stylize({
			top: ((this.size / (this.steps) * i) - label[this.w]()/2) + 'px',
			paddingLeft: '25px'
		    });
		}
		
	    }
	    
	    this.container.append (this.labels.end);
	    
	    this.cursor = ajsf.element ( 'div' ) ;
		
	    this.cursor.stylize ( ajsf.forms.styles.Cursor ) ;
		
	    this.container.append ( this.cursor ) ;
		
	    if ( !this.vertical )
	    {
		this.cursorDragger = new ajsf.Drag ( this.cursor ) ;
	    } else {
		this.cursorDragger = new ajsf.Drag ( this.cursor ) ;
	    }
	    
	    this.cursor.on('drag', ajsf.delegate ( this, '_refresh') ) ;

	    if ( this.mode == ajsf.forms.InputSlider.GAP )
	    {
		
		this.gapCursor = ajsf.element ( 'div' ) ;

		this.gapCursor.stylize ( ajsf.forms.styles.Cursor ) ;
		this.gapCursor.stylize('background', '#f00');
		this.container.append ( this.gapCursor ) ;

		if ( !this.vertical )
		{
		    this.gapCursorDragger = new ajsf.Drag ( this.gapCursor ) ;
		    this.gap.setTop(5);
		} else {
		    this.gapCursorDragger = new ajsf.Drag ( this.gapCursor ) ;
		    this.gap.setLeft(5);
		}

		this.gapCursor.on('drag, dragend', ajsf.delegate ( this, '_refresh') ) ;
		
	    }
	    
	    this.setValue(this.input.value);
	    
	    this.inited = true ;
	},
	
	// Refresh display
	_refresh: function (e)
	{
	    if ( this.mode == ajsf.forms.InputSlider.VALUE )
	    {
		if ( !this.vertical )
		{
		    this.cursorDragger.setBounds ( 0, -10, this.size - this.cursor[this.w]() + 20 , 0 ) ;
		} else {
		    this.cursorDragger.setBounds ( -10, 0, 0, this.size - this.cursor[this.w]() + 20 ) ;
		}
	    } else {
	    
		if ( !this.vertical )
		{
		    this.gapCursorDragger.setBounds ( 0, this.validatePos(this.cursor[this.x](false) + 25) , this.validatePos(this.size - this.cursor[this.x](false) - 35)  , 0 ) ;
		    this.cursorDragger.setBounds ( 0, -10, this.validatePos(this.gapCursor[this.x](false) - 15, 10) , 0 ) ;

		} else {
		    this.gapCursorDragger.setBounds ( this.validatePos(this.cursor[this.x](false) + 25), 0, 0, this.validatePos(this.size - this.cursor[this.x](false) - 35) ) ;
		    this.cursorDragger.setBounds ( this.validatePos(-10), 0, 0, this.validatePos(this.gapCursor[this.x](false) - 15, 10) ) ;
		}


		this.gap[this.sx](this.cursor[this.x](false)) ;
		this.gap[this.w](this.gapCursor[this.x](false)-this.cursor[this.x](false)) ;
		
	    }
	    
	    this._update () ;
	},
	
	// Refresh input values
	_update: function ()
	{
	    var val, val2 , old = this.input.value ;
	    
	    
	    if ( this.mode == ajsf.forms.InputSlider.VALUE )
	    {
		val = (this.max * (this.cursor[this.x] (false) + 10) * 100 / (this.size - this.cursor[this.w]() + 20) / 100).toFixed(this.decimals) ;
		
		this.input.value = this.invert ? this.max - val : val ;
		
		return;
	    }
	    
	    
	    val = (this.max * (this.cursor[this.x] (false) + 10) * 100 / (this.size - this.cursor[this.w]() + 20) / 100).toFixed(this.decimals) ;
	    val2 = (this.max * (this.gapCursor[this.x] (false) + 10) * 100 / (this.size - this.gapCursor[this.w]() + 20) / 100).toFixed(this.decimals) ;
	    
	    if ( this.invert )
	    {
		this.input.value = (this.max - val2) + ',' + (this.max - val) ;
	    } else {
		this.input.value = val + ',' + val2 ;
	    }
	
	    if ( this.inited === true && old !== this.input.value)
	    {
		this.dispatch('change');
	    }
	}
		
    }) ;
    
    ajsf.forms.InputSlider.GAP = 'GAP' ;
    ajsf.forms.InputSlider.VALUE = 'VALUE' ;
})();