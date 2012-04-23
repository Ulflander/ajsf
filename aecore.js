 
/*
	AJSF - Aenoa Javascript Framework
	(c) Xavier Laumonier 2010-2012
	
	This file contains the main parts of Aenoa Javascript Framework
	
	Since : 0.1
	Author : Xavier Laumonier
 */


(function (){
	
	

	/*
		Package: global
     */
	
	
	/*
	  	Function: glob
	 	
	 	Lets you declare a variable in all major contexts of document (document and window so far)
	  	
	  	Parameters: 
	  		k - Name of the variable to make global
	  		v - Value of the variable to make global
	  		
	  	Returns:
	  	Value of the variable
     */
	var glob = function ( k, v )
	{
		window.document[k] = window[k] = v ;
		return v ;
	} ,
	

	/*
	  	Function: is
	 	
	 	A convenient function for typeof(o) == "type". This function has global scope.
	  	
	  	Parameters: 
	  		o - [mixed] Object to test
	  		t - [string] Type of object required to return true ( "string", "object" ... )
	  		
	  	Returns:
	  	[boolean] Result of typeof 
     */
	is = glob ( "is" , function(o,t){
		return typeof(o) === (t === 'func' ? 'function' : t);
	} ),
	
	getStackDump = glob('getStackDump',

		function () {
			var lines = [];
			for (var frame = Components.stack; frame; frame = frame.caller)
				lines.push(frame.filename + " (" + frame.lineNumber + ")");
			return lines.join("\n");
		}),
	
	/*
	  	Variable: _w
	 	
	 	A convenient variable to access window. This variable has global scope.
	 	
	 	Private
     */
	_w = glob ( "_w" , window ) ,

	/*
	  	Variable: _d
	 	
	 	A convenient variable to access window.document. This variable has global scope.
	 	
	 	Private
     */
	_d = glob ( "_d" , _w.document ) ,
	

	/*
	  	Variable: ua
	 	
	 	A convenient variable to access navigator.userAgent. This variable has global scope.
     */
	ua = glob ( "ua" , navigator.userAgent ) ,


	/*
	  	Variable: b
	 	
	 	An object containing many booleans to provide info about the browser. 
	 	Be warned that not only one of the contained variables could be true. For example, if you visit a site using an iPhone, these variables will be set to true:
	 	
	 	- MobileSafari
	 	- iPhone
	 	- WebKit
	 	
	 	For now, keys are :
	 	
	 	- IE
	 	- IE9
	 	- Opera
	 	- WebKit
	 	- Gecko
	 	- FF
	 	- MobileSafari
	 	- Chrome
	 	- Firebug
	 	- iPhone
	 	- iPad
	 	- tablet
	 	
	 	Example:
	 	(start code)
	 	if ( b.FF || b.Chrome )
	 	{
	 		// do something specific to Firefox or Chrome
	 	}
	 	(end)
	 	
	 	Returns:
     */
	b = glob("b", glob ( "browser" , (function(){
		
		var i = ua.match(/iPhone/i)||ua.match(/iPod/i) ,
		c = _w.console,
		ip = ua.match(/iPad/i) ,
		f = false ;
		
		return {
			IE: /*@cc_on!@*/false,
			IE9: (function(){
				var a;
				try{
					var b=arguments.caller.length;
					a=0;
				}catch(e){
					a=1;
				}
				return ((document.all&&a)==1)
			}()),
			Opera: typeof(_w.opera)==='object',
			WebKit: ua.indexOf('AppleWebKit/') > -1,
			Gecko: ua.indexOf('Gecko') > -1 && ua.indexOf('KHTML') === -1,
			Safari: (/Safari/).test(ua),
			MobileSafari: new RegExp('/Apple.*Mobile.*Safari/').test(ua),
			FF: (/Firefox/).test(ua),
			Chrome: ua.indexOf('Chrome') > -1,
			Firebug: (c && c.firebug) || f,
			iPhone: i || f,
			iPad: ip || f,
			tablet: ip || f
		};
	}()) ) ),
	
	/*
		Variable: IEVersion
		
		The version of IE (if IE is not the current browser, IEVersion is an emtpy string)
     */
	IEVersion = glob('IEVersion',(function(){
		return !b.IE ? '' : parseFloat(navigator.appVersion.split("MSIE")[1]);
	}() ) );
	
	
	


	glob ( "glob", glob ) ;
	
	
	if ( !window.console )
	{
		window.console = {
			log: function ( str )
			{
				return;
			}
		} ;
	}
	
	
	

	
	var _ajsf = {
		/*

		Package: ajsf.EXTENDS_DOM
		
		This package extends core DOM elements, adding many usefull methods.
		
		To apply an interface on an object, use <ajsf.applyInterface> ( theElement ).
		
		Example:
		(start code)
		
		var element = document.getElementById('my-element') ; 	// You should use *ajsf.get* or *global._* functions to retrieve the element and apply DOM interfaces in the same function call.
																// Here we use document.getElementById just for the example.
		
		ajsf.applyInterface ( element ) ; 						// Ok now the interface has been applied on this element. Let's use our great chained extended functions :
		
		element.rotate ( 90 ) 									// Rotate the DOM element by 90 degrees
				.setOpacity( 0.5 ) 								// Set element alpha level
				.html ( '<h1>Hello World</h1>' ) ; 				// And fill with some content
		
		
		(end)
		 	
	 */
		EXTENDS_DOM: {
			
			/*
			Variable: tweenOnDisplay
			
			Private
	     */
			tweenOnDisplay:false,
		
			/*
			Variable: tween
			
			Private
	     */
			tween:false,

			/*
			Function: cssData
		
			Parameters:
				cssText - [string] The css content to apply to this element
				
		  	Returns:
		  	Current instance for chained commands on this element
	     */
			cssData:function(cssText)
			{
				if(this.style) {
					this.style.cssText=cssText ;
				}
				return this;
			},
		
			/*
		  	Function: Rotate
		  	
		 	Rotate the DOM element
		  	
		  	Parameters: 
		  		deg - [int] Rotation in degrees
		  		
		  	Returns:
		  	Current instance for chained commands on this element
	     */
			rotate: function (deg)
			{
				this.stylize('MozTransform', 'rotate('+deg+'deg)') ;
				this.stylize('WebkitTransform', 'rotate('+deg+'deg)');
				this.stylize('transform', 'rotate('+deg+'deg)');
				return this;
			},
		
			/*
			Function: html
			
			Convenient method to set inner html of an element
			
			Parameters:
				content - [string] HTML content to put in this element
			
			Returns:
			Current instance for chained commands on this element
	     */
			html: function ( content )
			{
				this.innerHTML = content ;
				return this ;
			},
		
			/*
			Function: getHtml
			
			Convenient method to get inner html of an element
			
			Returns:
			Inner HTML of this element
	     */
			getHtml: function()
			{
				return this.innerHTML;
			},
		
			/*
			Function: isOver
			
			Parameters:
				obj - [DOMElement] A DOM element to test over position with current element position
			
			Returns:
			True if the current element is over the param element, false otherwise
	     */
			isOver: function ( obj )
			{
				if ( obj )
				{
					obj = ajsf.i(obj);
				
					if ( !this.isInX(obj.getLeft()) && !this.isInX(obj.right()) )
					{
						return false ;
					}

					if ( this.isInY(obj.getTop()) || this.isInY(obj.bottom()) )
					{
						return true ;
					}
				
				}
				return false ;
			},
		

			/*
			Function: isInX
			
			Parameters:
				x - [int | float] X Position to test compared to the current X position
			
			Returns:
			True if param x is between the left and the right position of the current element
	     */
			isInX: function (x) {
				return !(x < this.getLeft() || x > this.right() ) ;
			},
		
		
			/*
			Function: isInY
			
			Parameters:
				y - [int | float] Y Position to test compared to the current Y position
			
			Returns:
			True if param y is between the top and the bottom position of the current element
	     */
			isInY: function (y) {
				return !(y < this.getTop() || y > this.bottom() ) ;
			},
		
			/*
			Function: destroy
			
			Remove the element from its parent
			
			Parameters:
				tween - [boolean] Do fadeOut element before destroying it, default: true
				
			Returns:
			void
	     */
			destroy: function (tween)
			{
				if ( tween && this.tween ){
					this.tween ({
						opacity:1
					},{
						opacity:0
					},"regularEaseOut",0.3,{
						onMotionEnd:ajsf.delegate(this,function(){
							this.empty().detach();
						})
					});
				} else {
					this.empty().detach() ;
				}
			},
		
			/*
			Function: getParent
			
			Returns the parent node of the current element
			
			Returns:
			The parent node
	     */
			getParent: function ()
			{
				return ajsf.extend(this.parentNode);
			},
		
			/*
			Function: detach
			
			Detach from parent node
			
			Returns:
			Current instance for chained commands on this element
	     */
			detach: function ()
			{
				if ( this.parentNode )
				{
					this.parentNode.removeChild(this) ;
				}
				return this;
			},
			/*
			Function: empty
			
			Empty the HTML content of the node
			
			Returns:
			Current instance for chained commands on this element
	     */
			empty: function()
			{
				this.innerHTML = '' ;
				return this ;
			},
	    
			/*
			Function: childs
	    
			Return an array of all childs
		
			Returns:
			An array of all childs
			
	     */	
			childs: function ()
			{
				if ( !this.hasChildNodes() )
				{
					return [] ;
				}
				var c = [], i = 0 , l = this.childNodes.length ;
		
				for ( i ; i < l ; i ++ )
				{
					if(this.childNodes[i].nodeType === 1 ) {
						c.push(ajsf.extend(this.childNodes[i]));
					}
		    
				}
		
				return c ;
			},
	
			/*
			Funtion: prepend
			
			Prepend some HTML content to the node
			
			Parameters:
				str - [string] String of HTML content to prepend
				
			Returns:
			Current instance for chained commands on this element
	 */
			prepend: function(str)
			{
				return this.html( str + this.getHtml() );
			},
	    
	    
			/*
		
		Function: insertAfter
		
		Insert an element after current element
		
		Parameters:
		    element - [DOMElement] Element to insert after current element
	    
		Returns:
		Current instance for chained commands on this element
		
	 */
			insertAfter: function ( element )
			{
				if(this.nextSibling)
				{
					this.parentNode.insertBefore(element, this.nextSibling);
				} else {
					this.parentNode.appendChild(element);
				}
		
				return this ;
			},
	    
	    
			/*
			Function: stylize
			
			Apply the style k to value v
			
			Parameters:
				k - [string | object] The property name or an Object of pairs {key: value}
				v - [string] The value to set (required only if k argument is a string)
				
			Returns:
			Current instance for chained commands on this element
	 */
		
			stylize: function (key,value)
			{
				if(this.style)
				{
					if ( is(key,"object") )
					{
					
						for ( var j in key )
						{
							this.style[j] = key[j];
						}
					} else if ( is(key,"string") ) {
						this.style[key.toString()] = value ;
					}
				}
				return this;
			},
			/*
				Function: getStyle
				
				Get CSS value for a CSS property of the current element
				
				Parameters:
					k - [string | object] The property name

				Returns:
				Undefined if not found, value of CSS property or object of pairs {key: value}
	 */
			getStyle: function ( key )
			{
				if(this.style)
				{
					if ( is(key,"object") )
					{
						var o = {} , j ;
						for ( j in key )
						{
							o[j] = this.style[j] ;
						}
						return o ;
					} else {
						return this.style[key.toString()] ;
					}
				}
				return undefined;
			},
			/*
			Function: setOpacity
			
			Set opacity for the element. Value range is from 0 to 1.
		
			Parameters:
				v - [string] The opactity value
				
			Returns:
			Current instance for chained commands on this element
	 */
			setOpacity:function(v)
			{
				if(this.style){
					this.style.opacity = v ;
					this.style.MozOpacity = v;
					this.style.WebkitOpacity = v;
				}
				if(ajsf.isIE&&!b.IE9){
					this.filters.alpha = v*100;
				}
		
				return this ;
			},
			/*
			Function: getOpacity
			
			Get opacity of this element
			
			Parameters:
				v - [string] The opacity value
				
			Returns:
			Current instance for chained commands on this element
	 */
			getOpacity:function(v)
			{
				if(ajsf.isIE&&!b.IE9){
					return this.filters.alpha;
				}
				if(this.style){
					var u , a = ['opacity','MozOpacity','WebkitOpacity'] ;
					while ( a.length>0 && u === undefined )
					{
						u = this.style[a.shift()];
					}
					return u;
				}
				return 1;
			},
			/*
			Function: switchClass
			
			Switch given class for the element
		
			Parameters:
				classString - [string] The class string
			
			Returns:
			Current instance for chained commands on this element
	 */
			switchClass: function(classString) {
				if ( this.hasClass(classString) )
				{
					this.className = this.className.split(' ' + classString).join('') ;
				} else {
					this.className = this.className + ' ' + classString;
				}
				return this;
			},
			/*
			Function: addClass
			
			Set the given classes on the element
		
			Parameters:
				classString - [string] The class string
				... - [string] [optional] Another class string
				
			Returns:
			Current instance for chained commands on this element
	 */
			addClass:function() {
				var l = arguments.length,
				c = this.className || '' ,
				i = 0 ;
			
				for ( i ; i < l ; i ++) {
					if ( !this.hasClass(arguments[i]) )
					{
						c += ' ' + arguments[i];
					}
				}
				this.className = c.trim();
				return this;
			},
			/*
			Function: remClass
			
			Remove the given class from the element
			
			Parameters:
				classString - [string] The class string
			
			Returns:
			Current instance for chained commands on this element
	 */
			remClass:function() {
				var l = arguments.length,
				i = 0 ,
				c = this.className || '' ;
			
				for ( i ; i < l ; i ++) {
					// TODO: Improve this by creating an ajsf preg_quote function
					c = (' ' + c + ' ').replace ( new RegExp('(\\s'+arguments[i].split('-').join('\\-')+'\\s)', "ig") , ' ' );
				
				}
				this.className = c.trim();
				return this;
			},
			/*
			Function: getClass
			
			Returns the current className

			Returns:
			The element classname
	 */
			getClass: function() {
				return this.className;
			},
			/*
			Function: hasClass
			Check if the element has a class 
		
			Parameters:
				classString - [string] The class string
			
			Returns:
			True if the current element has this class, false otherwise
	 */
			hasClass: function(classString) {
				return this.className && (new RegExp('(\\s'+classString.split('-').join('\\-')+'\\s)', "ig")).test(' ' + this.className+ ' ') ;
			},
			/*
			Function: setClass
			
			Replace class of the element
			
			Parameters:
			classString - [string] The class string
			
			Returns:
			Current instance for chained commands on this element
	 */
			setClass: function ( classString ) {
				this.setAttribute('class', classString.trim() );
				return this;
			},
			/*
			Function: show
			
			Show an element by setting 'display' style prop to 'block', or to given displayStyle
		
			Parameters:
				displayStyle - [string] = a display style such a block, inline-block...
				avoidTween
			
			Returns:
			Current instance for chained commands on this element
	 */
			show: function ( displayStyle , avoidTween ) {
				if ( !this.isVisible () )
				{
					if ( avoidTween === true || !this.tweenOnDisplay || !this.tween ){
						this.stylize ( "display" , displayStyle || "block" ) ;
					}
					else {
						this.tween ({
							opacity:0
						},{
							opacity:1
						},"regularEaseOut",0.3);
					}
				}
				return this;
			},
			/*
			Function: hide
			
			Hide an element by setting 'display' style prop to 'none'
			
			Parameters:
				avoidTween
				
			Returns
			Current instance for chained commands on this element
	 */
			hide: function ( avoidTween ) {
				if ( this.isVisible () )
				{
					if ( avoidTween === true || !this.tweenOnDisplay || !this.tween ){
						this.stylize ( "display" , "none" ) ;
					} else {
						var ref = this;
						this.tween ({
							opacity:1
						},{
							opacity:0
						},"regularEaseOut",0.3,{
							onMotionEnd:function(){
								ref.hide(true);
							}
						});
					}
				}
				return this;
			},
			/*
			Function: append
			
			Append elements given in function arguments
			
			Parameters:
				DOMElement DOM element to append
				DOMElement optional - Another DOM element to append...
			
			Returns:
			Current instance for chained commands on this element
	 */
			append: function ()
			{
				var a = arguments, i = 0, l = a.length ;
				for ( i ; i < l ; i++ )
				{
					this.appendChild(a[i]) ;
				}
				return this;
			},
			/*
			Function: switchShow
			
			Show or hide an element
		
			Returns:
			Current instance for chained commands on this element
	 */
			switchShow:function () {
				return ( this.isVisible() ? this.hide () : this.show () ) ;
			},
			/*
			Function: isVisible
			
			Returns:
			false if the current element style prop 'display' is set to 'none', returns true otherwise 
			[boolean] True if object seems to be visible, false otherwise
	 */
			isVisible:function () {
				return (this.style&&this.style.display?this.style.display!=="none":!this.hasClass("hidden")) ;
			},
			/*
			Function: addListener
			
			Adds a listener an the element
			
			Parameters:
				action - [string] The action to listen, or some multiple actions separated by a comma
				callback - [function] Function to call when event is fired
				
			Returns:
			Current instance for chained commands on this element
	 */
			addListener: function (action, callback) {
				if ( typeof(callback) !== "function" ) {
					throw "ajsf_extends_dom::addListener:: function " + callback + " is not a function";
				}
				if(action.indexOf(',') > -1)
				{
					var actions = action.split(','), i = 0, l = actions.length ;
					for ( i ; i < l ; i ++ ) {
						this.addListener(actions[i].trim(), callback);
					}
					return this ;
				}
				if(this.attachEvent){
					this.attachEvent('on'+action,callback);
				} else if(this.addEventListener){
					this.addEventListener(action,callback,false);
				}
				return this;
			},
			/*
			Function: remListener
			
			Remove a listener from the element
			
			Parameters:
			
				action - [string] The action listener to remove
				callback - [function] The used callback method
			
			Returns:
			Current instance for chained commands on this element
	 */
			remListener:function (action, callback) {
				if ( typeof(callback) !== "function" ) {
					throw "ajsf_extends_dom::remListener:: function " + callback + " is not a function";
				}
				if(this.detachEvent){
					this.detachEvent('on'+action,callback);
				} else{
					this.removeEventListener(action,callback,false);
				}
				return this;
			},
			/*
			Function: listen
			
			Alias of addListener
			
			Parameters:
				action
				callback
			
			Returns:
			Current instance for chained commands on this element
	 */
			listen: function (action,callback) {
				return this.addListener(action, callback);
			} ,
			/*
			Fuction: on
			
			Alias of addListener
			
			Parameters:
				action
				callback
			
			Returns:
			Current instance for chained commands on this element
	 */
			on: function (action,callback) {
				return this.addListener(action, callback);
			} ,
		
			/*
			Funcion: addListeners
			
			Adds many listeners on the element
			
			Parameters:
				arr - [array] An array of length 2 with first value event name and second callback
				
			Returns:
			Current instance for chained commands on this element
	 */
			addListeners:function () {
				var a = arguments, i = 0, l = a.length ;
				for ( i ; i < l ; i++ )
				{
					if ( a[i].length && a[i].length === 2 )
					{
						this.addListener(a[i][0], a[i][1]) ;
					}
				}
				return this;
			},
			/*
			Function: dispatch
			
			Dispatch an anonymous event
			
			Parameters:
				action - [string] The action to dispatch
				bubbles - [boolean]
				cancellable - [boolean]
			
			Returns:
			Result of dispatching (False if any listener has prevented the event, true otherwise)
	 */
			dispatch: function (action, bubbles , cancellable ) {
				var o;
			
				if ( _d.createEventObject && IEVersion < 9 )
				{
					o = _d.createEventObject();
					return ( this.fireEvent ? this.fireEvent('on'+action,o) : _d.fireEvent ( 'on'+action,o ) ) ;
				}
			
				o = _d.createEvent('Events');

				o.initEvent( action, (bubbles === false ? false : true), (cancellable === false ? false : true) ) ;
				return ( this.dispatchEvent ? this.dispatchEvent(o) : _d.dispatchEvent ( o ) ) ;
			},
			/*
			Function: hasAt
			
			Convenient method to acces to hasAttribute method
			
			Parameters:
				attrName
				
			Returns:
	 */
			hasAt: function (attrName) {
				return (this.hasAttribute ? this.hasAttribute(attrName) : this.getAttribue(attrName) !== undefined );
			},
			/*
			Function: hasAts
			
			Check many attributes in one call
			
			Returns:
	 */
			hasAts: function () {
				var i = 0, l = arguments.length ;
				for( i ; i < l ; i ++ )
				{
					if ( !this.hasAt(arguments[i]) )
					{
						return false ;
					}
				}
				return true ;
			},
			/*
			Function: getAt
			
			Convenient method to acces to getAttribute method
			
			Parameters:
				attrName
			
			Returns:
	 */
			getAt: function (attrName) {
				return this.getAttribute(attrName);
			},
		
			/*
			Function: setAt
			
			Convenient method to acces to setAttribute method
			
			Parameters:
				attrName
				attrValue
				
			Returns:
			Current instance for chained commands on this element
	 */
			setAt: function (attrName,attrValue) {
				this.setAttribute(attrName,attrValue);
				return this;
			},

			/*
			Function: remAt
			
			Convenient method to acces to removeAttribute method
			
			Parameters:
				attrName - [string]
				
			Returns:
			Current instance for chained commands on this element
	 */
			remAt: function (attrName,attrValue) {
				this.removeAttribute(attrName);
				return this;
			},
		
			/*
			Function: getLeft
		
			Returns the left position of the element relatively to the parent or relatively to the viewport
		
			Parameters:
				abs
				
			Returns:
	 */
			getLeft: function ( abs, parent )
			{
				var r = 0, o = this, o2;
				while( o !== null && o !== parent ) {
					r += o.offsetLeft;
					
					if ( abs === false )
					{
						break;
					}
					
					o2 = o ;
					
					while ( o2 && o2.parentNode!=o.offsetParent) {
						o2 = o2.parentNode;
					}
					
					o = o.offsetParent;
				}
				return r;
			},

			/*
			Function: getLeft

			Returns the left position of the element relatively to the parent or relatively to the viewport

			Parameters:
				abs

			Returns:
	 */
			getScrollLeft: function ( abs, parent )
			{
				var r = 0, o = this, o2;
				while( o !== null && o !== parent ) {
					r += o.offsetLeft;

					if (o != _d.body && o != _d.documentElement) {
						r -= o.scrollLeft ;
					}

					if ( abs === false )
					{
						break;
					}

					o2 = o ;

					while ( o2 && o2.parentNode!=o.offsetParent) {
						o2 = o2.parentNode;
						r -= o2.scrollLeft || 0 ;
					}

					o = o.offsetParent;
				}
				return r;
			},
			/*
			Function: getTop
		
			Parameters:
				abs
				
		Returns:
		the top position of the element relatively to the parent or relatively to the viewport
	 */
			getTop: function ( abs , parent )
			{
				var r = 0, o = this, o2;
		
				while( o !== null && o !== parent ) {
					
					r += o.offsetTop;
					
					if ( abs === false )
					{
						break;
					}
					
					o2 = o ;
					
					while ( o2 && o2.parentNode!=o.offsetParent) {
						o2 = o2.parentNode;
					}
					
					o = o.offsetParent;
				}
				return r;
			},
			/*
			Function: getTop

			Parameters:
				abs

		Returns:
		the top position of the element relatively to the parent or relatively to the viewport
	 */
			getScrollTop: function ( abs , parent )
			{
				var r = 0, o = this, o2;

				while( o !== null && o !== parent ) {

					r += o.offsetTop;


					if (o != _d.body && o != _d.documentElement) {
						r -= o.scrollTop ;
					}

					if ( abs === false )
					{
						break;
					}

					o2 = o ;

					while ( o2 && o2.parentNode!=o.offsetParent) {
						o2 = o2.parentNode;
						r += o2.scrollTop || 0 ;
					}

					o = o.offsetParent;
				}
				return r;
			},
			/*
			Function: right
			
			Parameters:
				abs
				
			Returns:
			the right position of the element relatively to the viewport
	 */
			right: function ( abs , parent)
			{
				return (this.getLeft(abs, parent) + this.offsetWidth) ;
			},
			/*
			Function: bottom
		
			Parameters:
				abs
			
			Returns:
			the bottom position of the element relatively to the viewport
	 */
			bottom: function ( abs , parent)
			{
				return (this.getTop(abs, parent) + this.offsetHeight );
			},
		
			/*
			Function: getMouseX
			
			Returns:
	 */
			getMouseX: function ()
			{
				return ajsf.mouse.mouseX - this.getLeft(true);
			},
			/*
			Function: getMouseY
			
			Returns:
	 */
			getMouseY: function ()
			{
				return ajsf.mouse.mouseY - this.getTop(true);
			},
			/*
			Function: h
			
			Set OR get element heiaght
			
			Parameters:
				val - [int] Value of height
				suffix - [string] Suffix to use in CSS (default: px)
			
			Returns:
			Element height if used as getter, current instance for chained commands on this element if used as setter
	 */
			h: function ( val, suffix )
			{
				if ( val )
				{
					this.style.height = val + (suffix || 'px') ;
					return this;
				}
				return this.offsetHeight ;
			},
			/*
			Function: w
			
			Set OR get element width
			
			Parameters:
				val - [int] Value of width
				suffix - [string] Suffix to use in CSS (default: px)
			
			Returns:
			Element width if used as getter, current instance for chained commands on this element if used as setter
	 */
			w: function ( val, suffix )
			{
				if ( val )
				{
					this.style.width = val + (suffix || 'px') ;
					return this;
				}
		
				return this.offsetWidth ;
			},
			/*
			Function: setLeft
			
			Parameters:
				v
				suffix
			
			Returns:
	 */
			setLeft: function (v,suffix)
			{
				return this.stylize('left',v + ( suffix === undefined ? 'px' : suffix ) ) ;
			},
			/*
			Function: setTop
			
			Parameters:
				v
				suffix
			
			Returns:
	 */
			setTop: function (v,suffix)
			{
				return this.stylize('top',v + ( suffix === undefined ? 'px' : suffix ) ) ;
			},
			/*
			Function: setPos
			
			Parameters:
				x
				y
				suffix
			
			Returns:
			Current instance for chained commands on this element
	 */
			setPos: function (x,y, suffix)
			{
				this.setLeft(x, suffix) ;
				this.setTop(y, suffix) ;
				return this;
			},
			/*
			Function: setSize
			
			Parameters:
				w
				h
				suffix
			
			Returns:
			Current instance for chained commands on this element
	 */
			setSize: function (w,h, suffix)
			{
				this.w(w, suffix) ;
				this.h(h, suffix) ;
				return this;
			},
		
			/*
			Function: hover
			
			Calls a function when mouse enters the element and another one when mouse leaves element
			
			Parameters:
				func1 - [function] The mouse enter callback function
				func2 - [function] The mouse leave callback function
			
			Returns:
			Current instance for chained commands on this element
	 */
			hover: function ( func1, func2 )
			{
				var self = this;
		
				var func = ajsf.delegate(this,function (ev){
					if( this.__$hov == true && ajsf.mouse.isOutside(this) ) {
						this.__$hov = false ;
						ajsf.delegate(self,func2)() ;
						ajsf.undelayed(25, func,-1);
					}
				}) ;
				
				this.on('mouseover', ajsf.delegate(this,function (ev) {
					if ( this.__$hov !== true ) {
						this.__$hov = true ;
						ajsf.delayed(25, func,-1);
						ajsf.delegate(self,func1)();
					}
				}));

				return this ;
			},
		
			/*
			Function: avoidTextSelection
			
			Prevent from text selection in element
			
			Returns:
			Current instance for chained commands on this element
	 */
			avoidTextSelection: function ()
			{
				this.onselectstart = function() {
					return false;
				};
				this.unselectable = 'on';
				this.stylize('MozUserSelect', 'none');
				this.stylize('cursor', 'default' );
			
				return this ;
			}
		},

	
	

		/*
			Variable: VERSION
			
			Current version of AJSF framework
     */
			
		VERSION:"1.0.b.3",

		/*
			Variable: BASE_URL
		
			The current URL of this JavaScript file, e.g. returns the root folder of AJSF framework
			THROW AN ERROR if no 'script' element has id 'js-aecore' in document.
			If you want URL of webpage, use ajsf.URL instead of ajsf.BASE_URL
			
			Returns:
     */
		BASE_URL: (function(){
			var script = _d.getElementById('js-aecore') ;
			if ( script )
			{
				var arr = script.getAttribute('src').split("/");
				arr.pop ();
				return arr.join("/") + "/";
			}
			return _d.location.href.split('#')[0].replace('run-test.html', '');
		} () ),

		/*
			Variable: URL
			
			The current URL of the page
			[String]
			
			Returns:
     */
		URL: (function(){
			var script = _d.getElementById('js-aecore') ;
			if ( script && script.getAttribute('data-base-url') )
			{
				return script.getAttribute('data-base-url') ;
			}
			return _d.location.href.split('#')[0];
		} ) () ,
		
		URL2: (function(){
			var script = _d.getElementById('js-aecore') ;
			if ( script && script.getAttribute('data-base-url') )
			{
				return script.getAttribute('data-base-url') ;
			} else {
			    return _d.location.href.split('#')[0];
			}
			
		} ) () ,
		
		/*
			Variable: ROOT
			
			Element reference
			
			Returns:
     */
		ROOT: (function(){
			if (b.WebKit && !_d.evaluate)
			{
				return _d;
			}
			if (b.Opera && window.parseFloat(window.opera.version()) < 9.5)
			{
				return _d.body;
			}
			
			return _d.documentElement;
		}() ),
		/*
			Variable: head
			
			The document HEAD element
     */
		head: _d.getElementsByTagName('head'),
		/*
			Variable: isIE
			
			Convenient property to distinguish IE and others browsers
			[boolean]
     */
		isIE: b.IE,
		
		/*
			Variable: ltr
			
			Global variable used by some ajsf plugins to kown if user must read in "Left To Right" (true) or "Right To Left" (false)
     */
		ltr: true,
			
		/*
			Variable: _sel
			Current selection (created by getByClass or get methods)
			
			Private
     */
		_sel:[],
		
		/*
			Variable: _i
			
			Interfaces to add to selected objects
			
			Private
     */
		_i:[],
		
		/*
			Private: _selc
			
			Selection cache for _("#element")
			
			Private
     */
		_selc:[],
		
		/*
			Variable: _lf
			
			On window load callbacks
			
			Private
     */
		_lf:[],
		
		/*
			Variable: _lc
		
			Window load called or not
		
			Private
     */
		_lc:false,

		/*
			Variable: _lw
			
			Scripts waiting to be loaded before that window.onLoad should be called
		
			Private
     */
		_lw:0,
		
		
		/*
			Variable: _scrollcbs
			
			Private
     */
		
		_scrollcbs: [],

		/*
			Variable: _toLoad
			
			Private
     */
		_toLoad: [] ,

		/*
			Variable: _urlizeAcc
			
			Used by urlize method
			
			Private
     */
		_urlizeAcc: 'Þßàáâãäåæçèéêëìíîïðñòóôõöøùúûýýþÿŕ',
		/*
			Variable: _urlizeNoAcc
			
			Used by urlize method
			
			Private
     */
		_urlizeNoAcc: 'bsaaaaaaaceeeeiiiidnoooooouuuyybyr',

		/*
			Variable: _urlizeRules
			
			Used by urlize method - complex rules
			
			Private
     */
		_urlizeRules: [],

		compatMode: function ()
		{
			glob('$', null);
		},

		/*
			Function: toString
			
			Version of the framework
			
			Returns:
     */
		toString: function (){
			return "[ajsfCoreObject]";
		},
		
		/*
			Function: addScrollCB
			
			Parameters:
				id
				f
     */
		addScrollCB: function (id,f){
			if(is(f,'function') )
			{
				this._scrollcbs[id] = f;
			}
		},

		/*
			Function: remScrollCB
			
			Parameters:
				id
     */
		remScrollCB: function (id){
			if(this._scrollcbs[id])
			{
				this._scrollcbs[id] = null ;
			}
		},
		
		/*
			Function: addScrollingElement
			
			Parameters:
				e
     */
		addScrollingElement: function (e)
		{
			ajsf.get(e).addListener('scroll',ajsf.delegate(this,"_onScroll")) ;
		},
		
		/*
			Function: remScrollingElement
			
			Parameters:
				e
     */
		remScrollingElement: function (e)
		{
			ajsf.get(e).remListener('scroll',ajsf.delegate(this,"_onScroll")) ;
		},
		/*
			Function: _onScroll
			
			Private
     */
		_onScroll: function()
		{
			var k ;
			
			for ( k in this._scrollcbs )
			{
				if (this._scrollcbs[k])
				{
					this._scrollcbs[k] () ;
				} else {
					this.remScrollCB(k);
				}
			}
		},
		
		/*
			Function: expandOptionsToClass
			
			Apply a set of properties from an anonymous object to a class instance or a static class setters.
			
			This is used to quickly set a bunch of values into an object, using this object setters.
			
			(start code)
			var myClass = {
				function setFoo ( foo ) 
				{
					this.foo_ = foo;
				}
				function getFoo ()
				{
					return this.foo_ ;
				}
				function setBarFoo ( bar ) 
				{
					this.bar_ = bar;
				}
				function getBarFoo ()
				{
					return this.bar_ ;
				}
			};
			
			var options = {
				foo: "hello world foo",
				fooBar: "hello world foobar"
			};
			
			ajsf.expandOptionsToClass ( myClass, options ) ;
			
			alert( myClass.getFoo() ); // Alerts "hello world foo"
			alert( myClass.getBarFoo() ); // Alerts "hello world foobar"
			
			(end)
			
			Parameters:
				c - [object] Class instance or static class
				opts - [object] A bunch of values
			
			Returns:
			ajsf reference for global chained commands
     */
		expandOptionsToClass: function ( c , opts )
		{
			var s, k,
			f = function(m,p1,p2){
				return p1+p2.toUpperCase();
			} ;
				
			for ( k in opts )
			{
				// The setter name
				s = 'set' + k.split('_').join(' ').replace( /(^|\s)([a-z])/g , f ).split(' ').join('') ;
				// Test if setter exists
				
				if (c[s] && is(c[s],'function') )
				{
					// Set the value
					c[s] ( opts[k] ) ;
				}
			}
			return this;
		},
		
		/*
		Function: addWheelListener
		
		Parameters:
			callback
     */
		addWheelListener: function ( callback , container )
		{

			var c = container || _d ,
				e = (b.FF ? "DOMMouseScroll" : "mousewheel");

			if (c.attachEvent)
			{
				c.attachEvent("on"+e, callback);
			} else if (c.addEventListener){
				c.addEventListener(e, callback, false);
			}
				    
		},
		
		/*
			Function: getWheelDelta
			
			Parameters:
				e
			
			Returns:
     */
		getWheelDelta: function (e)
		{
			return (e && e.detail) ? e.detail*(-120) : (e && e.wheelDelta ? e.wheelDelta : 0 ) ;
		},
		
		/*
			Function: create

			[DEPRECATED] You should use	<ajsf.element>, order of arguments is changed

			Creates a new element in the DOM
			
			Parameters:
				id - [String] id attribute of the new element, default: no id
				type - [String] type of element, default: div
				cl - [String] class of element, default: no class
				html - HTML content to insert into newly created element
			
			Returns:
			HTMLElement The new DOM element, interfaces are applied
     */
		create: function ( id,type,cl , html)
		{
			return this.element(type,cl,id,html) ;
		},

		/*
			Function: element

			Creates a new element in the DOM

			Parameters:
				type - [String] type of element, default: divd
				cl - [String] class of element, default: no class
				id - [String] id attribute of the new element, default: no i
				html - HTML content to insert into newly created element

			Returns:
			HTMLElement The new DOM element, interfaces are applied
     */
		element: function ( type , cl , id , html )
		{
			var e = ajsf.i( _d.createElement ( ( !type ? 'div' : type ) ) ) ;
			if(e) {
				if(id) {
					e.setAt('id',id) ;
				}
				if(cl) {
					e.setAt('class',cl) ;
				}
				if(html) {
					e.html(html);
				}
			}
			return e ;
		},
		
		/*
			Function: createAll
			
			Creates a serie of new elements in the DOM using ajsf.create method, and append them in container if container given
			
			Parameters:
			elements - [Array] Array of elements like this one [ [element1id,element1type,element1class] , [element2id,element2type,element2class] , ... ]
			container - DOM element as container, optional
			
			Returns:
			[Array] An array of references to the elements, in the same order than elements param array
     */
		createAll: function ( elements, container )
		{
			var a = [] , e , k ;
			for ( k in elements )
			{
				e = ajsf.create(elements[k][0],elements[k][1],elements[k][2]) ;
				if ( container && e )
				{
					container.appendChild(e);
				}
				a.push(e) ;
			}
			return a ;
		},
		
		/*
			Function: delegate
			
			Returns a function that call a delegated method.
		
			The method can be a string, then it must exist in the given context.
			The method can otherwise be a function object, then you can use anonymous functions that will be executed in the given context.
		
			Good to know: the delegate method creates a variable into context named __caller that identifies context from where delegated method has been called.
			That's particularly usefull on event catching
		
			(start code)
			<input type="button" id="test-delegation" value="Click !" />
		
			<script type="text/javascript">
		
				 var myContextTo = {
				 		foo: 'NOT test-delegation'
				 } ;
				
				 var delegatedMethod = ajsf.delegate ( myContextTo, function (e)
				 {
				 
				 		alert(this.foo); // Alerts 'NOT test-delegation'
				 		alert(this.__caller); // Alerts '[object HTMLInputElement]'
				 		alert(this.__caller.getAttribute('id')); // Alerts 'test-delegation'
				 });
 		
				_('#test-delegation').on('click', delegatedMethod) ;
		
			</script>
			(end)
			
			Parameters:
				context - [Object] that contain the method to call
				method - The method name or a function object
				
			Returns:
			function A function that will call the delegated method.
     */
		delegate: function ( context , method )
		{
			var applyOn ;
			
			if ( is(method,"function") )
			{
				applyOn = method;
			}
			else
			{
				applyOn = context[method];
				if (!is(applyOn,"function"))
				{
					return function () {} ;
				}
			}
			return function () {
				context.__caller = this ;
				return applyOn.apply ( context , arguments );
			};
		},
		
		/*
			function: getBody
			
			Returns:
     */
		getBody:function () {
			return _d.body ;
		},
		
		/*
			Function: _onwindowload
			
			On window load: set listener for body load
			
			Returns:
			
			Private
     */
		_onwindowload: function ()
		{
			if ( this._lc === true || this._lw > 0 ) {
				return false;
			}
	    
			if ( this._lc === false )
			{
				ajsf.mouse.initialize () ;
				ajsf.timer.initialize () ;
			}
	    
			this._lc = true ;
			
			var a=0, lf = this._lf , b = lf.length ;
			this._lf = [];
			for ( a;a<b;a++ )
			{
				lf[a] () ;
			}

	  
			
			return true ;
		},
	
		/*
			Function: getSelection
			
			Returns the current selection
			
			Returns:
			The currently selected elements
     */
		getSelection: function ()
		{
			return this._sel ;
		},
		
		/*
			Function: ready
			
			Adds a listener on for on load window event
			
			Parameters:
				callback
			
			Returns:
			ajsf reference for global chained commands
     */
		ready: function(callback)
		{
			if ( this._lc )
			{
				callback () ;
			}
			else {
				this._lf.push ( callback ) ;
			}

			return this;
		},
		
		/*
			Function: isReady
			
			Check if document is ready for JS
			
			
			Returns:
			Boolean true if document is ready, false otherwise
     */
		isReady: function ()
		{
			return this._lc === true ;
		},
		/*
			Function: resetDOMLoadState
			
			Reset document loading state
			(Used by ajsf.load and ajsf.stylesheet.has functions)
			
			Private
     */
		resetDOMLoadState: function ()
		{
			this._lc = false ;
		},

		/*
			Function: addListener
			
			Adds a listener an the current selection
		
			Parameters:
			action - [string] The action to listen
			callback - [function] Function to call when event is fired
			
			Returns:
			ajsf reference for global chained commands
     */
		addListener: function (action, callback)
		{
			var l = this._sel.length, i = 0 ;
			if(this.isIE){
				for(i; i<l; i++){
					this._sel[i].attachEvent('on'+action,callback);
				}
			} else{
				for(i; i<l; i++){
					this._sel[i].addEventListener(action,callback,false);
				}
			}
			return this;
		},
		/*
			Function: prevent
			
			Prevents an event to perform its default behavior
			
			Parameters:
				e
     */
		prevent: function (e)
		{
			if (e && e.preventDefault) {
				e.preventDefault();
			} else if(window.event){
				window.event.returnValue = false;
			}
	    
		},
		/*
			Function: redirect
			
			Parameters:
				url - [string] The URL to reach
     */
		redirect: function (url)
		{
			window.location.href = url ;
		},
		/*
			Function: emptyCache
			
			Empty the selected identified elements cache
	
			Returns:
			ajsf reference for global chained commands
     */
		emptyCache: function ()
		{
			this._selc = [] ;
			return this;
		},
		// Check in the DOM if the given id corresponds to an element
		
		/*
			Function: exists
			
			Parameters:
				id
			
			Returns:
     */
		exists: function (id)
		{
			return _d.getElementById(id) !== null ;
		},
		/*
			Function: get
			
			Find elements with the given selector within the given or global context
			
			Inspired from http://www.freelancephp.net/simpleselector-javascript-dom-selector/
			
			Note that you can select elements in the page using _ function.
			
			Examples:
			(start code)
			 	_('p') ;						// select all 'p' tags
			 	_('tbody>tr') ;					// select all 'tr' tags in any tbody element
			 	_('#some-id') ;					// select element identified 'some-id'
			 	_('.classname') ;				// select all elements that have class classname
			 	_('#wrap, .special,p') ;		// use multiple selectors seperated by comma
			 	_( 'p', '#wrap' ) ;				// give a context to select only in a given DOM context
			 	_( 'p', domObjectRef ) ;		// context can be a DOM node
			 	_( '[attr-name]' ) ;			// selection based on attribute existence 
			 	_( '[attr-name=value]' ) ;		// selection based on attribute existence and its value
			 	_( '#bar*' ) ;					// selection based on partial id name : will select nodes that have id bar1, barFoo, bar_foo ...
			(end)
			
			All identified elements (searched using #some-id) are cached to not be reinited next time.
			
			Use ajsf.emptyCache method if you need to update these elements interfaces.
			
			More methods to come soon.
			
			Parameters:
				selector - [string | DOM node] 
				context - [string | DOM node | array of DOM nodes]
				ignoreCache - [boolean] True to ignore cache, any value otherwise
				asArray - [boolean] Force returning an array, even if an unique element has been found: true to allways return array, false to never return array, null to return array for many selection subset and the element for unique selection subset
			
			Returns:
			[DOM node | array of DOM nodes | empty array] One or many elements
			
			See Also: 
			<Global._>
     */
		get: function ( selector, context , ignoreCache , asArray )
		{
			if (selector&&(!selector.split||is(selector,'object')))
			{
				return this.extend( selector ) ;
			}
			
			if(!selector)
			{
				return asArray ? [] : false;
			}
			
			// local vars
			var selectors = selector.split( ',' ),
			elements = [],
			wrappers = [], w, a = 0 , x = 0 , i = 0, j = 1, b, k, y = selectors.length ;
			
			// Empty current selection
			this._sel = [] ;
			
			// set wrappers
			if ( is( context, 'string') ) {
				// set array to wrappers
				wrappers = ajsf.get( context , null , true, true);
			} else if ( context && context.constructor === Array ) {
				wrappers = context;
			} else {
				// document is default context
				wrappers.push( context || document );
			}
			
			b = wrappers.length ;
			
			if ( !b )
			{
				return asArray ? [] : null;
			}
			
			// find matching elements within the wrappers (context)
			for ( a ; a < b; a++ ) {
				for ( x = 0, y; x < y; x++ ) {
					// selector: trim spaces
					var s = selectors[x].trim(),
					// get operator
					operator = s.substr( 0, 1 ),
					// get key
					key = s.substr( 1 ),
					els = [],
					l = 0 ;
					
					// We require childs of a given element
					if ( s.indexOf('>') > -1 )
					{
						l = s.split('>');
						// Spit the query and rerun ajsf.get
						els = this.get(l[1].trim(), this.get(l[0].trim(),context), ignoreCache,true) ;
						for( k in els )
						{
							// No need here to apply interfaces: interfaces has been applied yet
							elements.push(els[k]);
						}
						
					} else
					// get matching elements
					if ( operator === '#' ) {

						// Check for cache selection
						if ( typeof(this._selc[s]) !== "undefined" && ignoreCache !== true )
						{
							// Element was cached
							elements.push( this._selc[s] ) ;
						// Element not cached, lets get it
						} else {
							
							if ( key.indexOf('*') > -1 )
							{
								els = this.getByReg(key.replace('*','[a-zA-Z0-9_\\-\\/]{1,}'), wrappers[ a ]) ;

								// Apply interfaces on element and store it
								l = els.length ;
								for ( i = 0, j = l; i < j; i++ )
								{
									elements.push(this.extend( els[ i ] ) );
								}
								
							} else {
								els[0] = _d.getElementById( key );
								// check if element is part of context
								if ( els[0] && this.isDescendant( els[0], wrappers[a] ) )
								{
									// Apply interfaces on element and store it
									elements.push( this.extend( els[0] ) );
								}
							}
						}
					} else {
						if ( operator === '/' ) {
							els = this.getByReg( s, wrappers[ a ] );
						} else if ( operator === '[' ) {
							els = this.getByAttr( s.substr ( 1 , s.length -2 ), wrappers[ a ] );
						} else if ( operator === '.' ) {
							els = this.getByClass( key, wrappers[ a ] );
						} else if (wrappers[ a ].getElementsByTagName) {
							els = wrappers[ a ].getElementsByTagName( s );
						} else {
							els = [];
						}
					
						// Apply interfaces on element and store it
						l = els.length ;
						for ( i = 0, j = l; i < j; i++ )
						{
							elements.push(this.extend( els[ i ] ) );
						}
					}
				}
			}

			// Setting current selection,
			this._sel = elements ;
			// Return selection
			return ( (asArray == null && this._sel.length == 1) || asArray == false ) ? this._sel[0] : this._sel;
		},
	
	
		/*
			Function: isDescendant
			
			Check wether an element is a descendant of the given ancestor
			
			Parameters:
				descendant - [DOM node]
				ancestor - [DOM node]
				
			Returns:
			[boolean]
     */
		isDescendant: function ( descendant, ancestor )
		{
			return ( ( descendant.parentNode === ancestor) || (descendant.parentNode !== _d ) && arguments.callee( descendant.parentNode, ancestor ) );
		},
	
		/*
			Function: getByClass
			
			Cross browser function for getting elements by className
			
			Parameters:
				className - [string]
				context - [DOM node]
				
			Returns:
			[array of DOM nodes]
     */
		getByClass: function ( className, context )
		{
			var elements = [],
			expr = new RegExp('\\b' + className + '\\b'),
			wrapper = (context && context.getElementsByTagName ? context : document) ,
			all = wrapper.getElementsByTagName( '*' ),
			l = all.length,
			x = 0;
	
			for ( x; x < l; x++ ) {
				if ( expr.test( all[ x ].className ) )
				{
					elements.push(all[ x ]);
				}
			}
	
			return elements;
		},

		/*
			Function: getByReg
			
			Cross browser function for getting elements using a regexp
			
			Parameters:
				regexp - [string]
				context - [DOM node]
				
			Returns:
			[array of DOM nodes]
     */
		getByReg: function ( regexp, context )
		{
			var elements = [],
			expr = new RegExp(regexp),
			wrapper = context || document,
			all = wrapper.getElementsByTagName( '*' ),
			l = all.length,
			x = 0;

			for (x; x < l; x++ ) {
				if ( expr.test( all[ x ].getAttribute('id') ) )
				{
					elements.push(all[ x ]);
				}
			}

			return elements;
		},
	
		/*
			Function: getByAttr
			
			Cross browser function for getting elements by attribute existence
			
			Parameters:
				attrName - [string] Attribute name or attribute name and value
				context - [DOM node]
				
			Returns:
			[array of DOM nodes]
     */
		getByAttr: function ( attrName, context )
		{
			var elements = [],
			value = null ,
			wrapper = context || document,
			all = wrapper.getElementsByTagName ? wrapper.getElementsByTagName( '*' ) : [],
			l = all.length,
			a = attrName.split('='),
			x = 0;
				
			if ( a.length > 1 ){
				value = a[1] ;
				attrName = a[0];
			}
			
			for ( x; x < l; x++ ) {
				if ( all[x].getAttribute && all[x].getAttribute ( attrName ) && ( value === null || value === all[x].getAttribute( attrName ) ) )
				{
					elements.push(all[ x ]);
				}
			}
			return elements;
		},

		/*
			Function: extend
			
			Apply all interfaces on an object OR if second param is given, apply given prototype on class object
			
			Parameters:
				o - [DOM node | object | Function] The target where add methods and props from interface
				i - [object] Interface to apply to object
				
			Returns:
			[object] A reference to the object
     */
		extend: function(o) {
			if ( !o )
			{
				o = {};
			}
			
			if ( this._i.length === 0 )
			{
				this._i.push(this.EXTENDS_DOM);
			}
			
			var j=0, k, l = this._i.length ;
			
			for ( j ; j<l ; j ++ )
			{
				for ( k in this._i[j] )
				{
					o[k] = this._i[j][k];
				}
			}
			
			return o;
		},
	
		extendAll: function (a) {
			if ( !a || !a.length )
			{
				return a;
			}
	    
			for ( var i = 0 , l = a.length ; i < l ; i ++ )
			{
				a[i] = this.extend(a[i]);
			}
	    
			return a ;
		},
		/*
			Function: i
			
			Alias of extend
			
			Parameters:
				o - [DOM node | object] The target where add methods and props from interface
			
			Returns:
			[object] A reference to the object
     */
		i: function(o)
		{
			return this.extend(o);
		},
		/*
			Function: registerInterface
			
			Register a new interface applied on selected elements
			Will empty identified elements cache
		
			Parameters:
				interf - [object] The interface
				emptyCache - [boolean] Should empty the cache or not, default to true
			
			Returns:
			ajsf reference for global chained commands
     */
		registerInterface: function (interf, emptyCache)
		{
			this._i.push(interf) ;
			if ( typeof(emptyCache) === 'undefined' || emptyCache === true )
			{
				this.emptyCache () ;
			}
			return this ;
		},

		
		/*
			Function: unregisterInterface
			
			Unregister an interface previously registered using registerInterface method
			Will empty the selected identified elements cache
		
			Parameters:
				interf - [object] The interface
				emptyCache - [boolean] Should empty the cache or not, default to true
			
			Returns:
			ajsf reference for global chained commands
     */
		unregisterInterface: function (interf, emptyCache)
		{
			var j;
			
			for ( j in this._i)
			{
				if ( this._i[j] == interf)
				{
					this._i[j] = undefined ;
				}
			}
			if ( typeof(emptyCache) == 'undefined' || emptyCache === true )
			{
				this.emptyCache () ;
			}
			return this ;
		},
		
		
		
		/*
			Function: load
			
			Loads a plugin.
		
			Parameters:
				plugin - [string] The plugin URL (external) or the plugin name (ajsf dependant)
			
			Returns:
			ajsf reference for global chained commands
     */
		load: function ( )
		{
			
			var i = 0, l = arguments.length , plugin ;
			
			for ( i ; i < l ; i ++ )
			{
				plugin = arguments[i] ;
		
				if ( plugin.indexOf("/") == -1 && plugin.indexOf(".") == -1 )
				{
					plugin = this.BASE_URL + 'plugins/' + plugin + ".js" ;
				}
	    
				if ( this._toLoad.indexOf(plugin) === -1 && this._isPluginLoaded(plugin) == false )
				{
					this._lw ++ ;
					this._toLoad.push( plugin ) ;
				}
			}
			
			if ( this._toLoad.length > 0 )
			{
				this.resetDOMLoadState () ;
				this._load ( this._toLoad.shift() ) ;
			}
			
			return this;
		},
		
		_isPluginLoaded: function ( plugin )
		{
			var scripts = _d.getElementsByTagName('script'), sc , l = scripts.length , x = 0 ;
			for ( x = 0; x < l; x++ )
			{
				if ( scripts[x].getAttribute ("src") == plugin )
				{
					return true;
				}
			}
	    
			return false ;
		},
		
		/*
			Function: pluginsLoaded
			
			Returns:
     */
		pluginsLoaded: function ()
		{
			return this._lw === 0 ;
		},
		
		/*
			Function: _onPluginLoad
			
			Called when plugin or external file is loaded
			
			Private
     */
		_onPluginLoad: function ()
		{
			this._lw-=1;
			if ( this._toLoad.length > 0 )
			{
				this._load ( this._toLoad.shift() ) ;
			} else {
				this._onwindowload () ;
			}
		},
		
		/*
			Function: _load
			
			Parameters:
				plugin
			
			Returns:
			
			Private
     */
		_load: function ( plugin )
		{
			var head = _d.getElementsByTagName('head')[0] || document.documentElement ,
			sc = _d.createElement('script'),
			done = false ;
		

			sc.setAttribute("type","text/javascript");
			sc.setAttribute("src", plugin ) ;
	    
			if ( ajsf.isIE )
			{
				sc.onreadystatechange = function(e){
					if ( this.readyState === "loaded" || this.readyState === "complete" )
					{
						done = true ;
						sc.onreadystatechange = null;
						ajsf._onPluginLoad() ;
					}
				};
			} else {
				_(sc).addListener("load",ajsf.delegate(ajsf,"_onPluginLoad"));
			}

			head.appendChild(sc);
		},
    
    
		_jsonpidx: 0,
    
		getJSONP: function ( url , callback )
		{
			var cb = 'callback_' + this._jsonpidx ;
	
			glob ( cb , callback ) ;
	
			if ( url.indexOf('?') < 0 )
			{
				url += '?' ;
			}
			this._jsonpidx += 1 ;
			url += '&jsonp=' + cb ;
			sc = _d.createElement('script') ;
			sc.setAttribute("type","text/javascript");
			sc.setAttribute("src", url ) ;
			_d.getElementsByTagName('head')[0].appendChild(sc);
		},
		
		/*
			Function: isN
			
			Test whether a variable is a number
			
			Parameters:
				n - [mixed] A variable to test
				
			Returns:
			[boolean] True if n is a number, false otherwise 
     */
		isN: function (n)
		{
			return !isNaN(parseFloat(n)) && isFinite(n);
		},
		/*
			Function: initLayoutElement
			
			Init css display prop
			This function should be deprecated

			Parameters:
				obj - [DOM node | object] The targeted element to init
				
			Return:
			[object] A reference to the object
     */
		initLayoutElement: function ( obj )
		{
			return obj;
		},
		
		/*
			Function: addToUrlization
			
			Adds some simple letters to the urlization process.
			From and To strings must have the same length. Each char of "from" will be replaced by the corresponding char of "to".
			
			Parameteres:
				from - [string] Chars from 
				to - [string] Chars to
			
			Returns:
     */
		addToUrlization: function ( from, to )
		{
			if ( from && to && from.length === to.length && (this._urlizeAcc.indexOf(from) === -1 || this._urlizeNoAcc.indexOf(from) > -1) )
			{
				this._urlizeAcc += from ;
				this._urlizeNoAcc += to ;
			}
		},

		/*
			Function: addUrlizationRule
			
			Adds some strings to the urlization process.
			From char will be fully replaced by to char on urlization
			
			Parameteres:
				from - [string] Chars from 
				to - [string] Chars to
			
			Returns:
     */
		addUrlizationRule: function (from, to)
		{
			if ( from && to )
			{
				this._urlizeRules[from] = to ;
			}
		},
		
		/*
			Function: urlize
			
			Urlize a string : replace accent chars, spaces
			
			Parameters:
				str - [string] Message to display
				
			Returns:
			[string] The urlized string
     */
		urlize: function (str)
		{
			if ( is(str,'string') ) {
				
				str = str.toLowerCase().split('');
				
				var s = [],
				l = str.length,
				y = 0, i = -1 ;
				
				for ( y; y < l; y++) {
					if ( ( i = this._urlizeAcc.indexOf(str[y]) ) > -1) {
						s[y] = this._urlizeNoAcc[i];
					} else {
						s[y] = str[y];
					}
					if (this._urlizeRules[str[y]])
					{
						s[y] = str[y] ;
					}
				}
				
				return s.join('').trim().replace(/[^a-z0-9\- ]/g,'').split(' ').join('-').replace(/[\-]{2,}/g,'-');
				
			}
			return '' ;
		},
		
		

		/*
		 	Function: getLeadZero
		 	
		 	Add a string zero character before a number lower than 10
		 	
		 	Returns:
		 	[string]
     */
		getLeadZero: function ( num )
		{
			return (parseInt(num)<10 ?'0':'') + num ;
		},
		
		/*
			Function: alert
			
			Sends an alert (Javascript AJSF Dialog if plugin aepopup loaded, browser alert otherwise
			
			Parameters:
				text
				title
				closeText
				
			Returns:
			ajsf.popup.Dialog instance if available, null otherwise
     */
		alert: function ( text, title , closeText )
		{
			if ( ajsf.popup )
			{
				return new ajsf.popup.Dialog(title, text, closeText);
			} else {
				alert ( text ) ;
			}
			
			return null ;
		},

		
		/*
			Function: delayed
			
			Delay execution of a function.
			If parameter repeat is given, then the execution is repeated until repeat value is reached.
			
			Parameters:
				delay - [number] Delay before execution of the callback
				callback - [function] Function to call
				repeat - [number] Number of executions, default: 1
     */
		delayed: function ( delay, callback, repeat )
		{
			ajsf.timer.registerTimer ( delay , callback , ( repeat ? repeat : 1 ) ) ;
		},
		/*
			Function: next
			
			Delay execution of a function to the next frame
			
			Parameters:
				callback - [function] Function to call on next frame
     */
		next: function ( callback )
		{
			ajsf.timer.registerTimer ( ajsf.timer.getFrameRate() , callback , 1 ) ;
		},
		/*
			Function: undelayed
			
			If parameter repeat is given, then the execution is repeated until repeat value is reached
			
			Parameters:
				delay - [number] Delay before execution of the callback
				callback - [function] Function to call
				repeat
     */
		undelayed: function ( delay, callback , repeat )
		{
			ajsf.timer.unregisterTimer ( delay , callback , ( repeat ? repeat : 1  ) ) ;
		},
		
		
		/*
			Package: ajsf.Common
     */

		/*
			Function: validate
			
			Validate a string with a regex (using RegExp.test method)
			
			Parameters:
				regex - [string] String to feed regexp
				str - [string] String to test
				
			Returns:
			[boolean] True if regex pattern matches on str string, false otherwise
     */
		validate: function ( regex , str )
		{
			var reg = new RegExp(regex) ;
			return reg.test(str) ;
		},
		/*
			Function: retrieve
			
			Parse a string to access to an object (JS variable, HTML element...) in the DOM, from the ROOT node
		
			e.g.: "obj1.obj2.function1" will return a reference of the function1 in obj2 in obj1
			
			Parameters:
				str
				root
				
			Returns:
     */
		retrieve: function ( str , root)
		{
			return this.retrieveParent(str , root ).object ;
		},

		/*
			Function: retrieveParent
			
			Parse a string to access to an object (JS variable, HTML element...) in the DOM, from the ROOT node
			
			e.g.: "obj1.obj2.function1" will return a reference of the function1 in obj2 in obj1
			
			Parameters:
				str
				root
				
			Returns:
     */
		retrieveParent: function ( str , root )
		{
			var a = str.split('.') ,
			o = root || ajsf.ROOT , p = null,
			l = a.length ,
			i = 0 ;
		
			for ( i ; i < l ; i++ )
			{
				if (null!=o[a[i]])
				{
					p = o ;
					o = o[a[i]] ;
				} else {
					break;
				}
			}
			return {
				parent: p,
				object: o
			} ;
		},
		
		

		/*
			Package: ajsf.Timer
     */
		
		/*
			Variable: timer
			
			Timers manager
			Mostly copied from an old actionscript timing system.
     */
		timer: {
			
			/*
				Variable: _fr
				
				Private
	 */
			_fr: 40,
			
			/*
				Variable: _t
				Timers
				
				Private
	 */
			_t: [],
			
			/*
				Variable: _ef
				On enter frame ccallbacks
				
				Private
	 */
			_ef: [],
			
			/*
				Variable: _i
				
				Private
	 */
			_i: -1,
			
			/*
				Variable: _d
				Time diff
				
				Private
	 */
			_d: 0,
			
			/*
				Function: getFrameRate
				
				Returns:
	 */
			getFrameRate: function ()
			{
				return this._fr ;
			},
			/*
				Function: initialize
				
				Returns:
	 */
			initialize: function ()
			{
				this._d = (new Date()).getTime () ;
				this._i = setTimeout ( function ()
				{
					var a = ajsf.timer, k, i = 0, l = a._t.length, d = [] , now = (new Date()).getTime (), timeDiff = now - a._d ;

					for ( k in a._ef )
					{
						a._ef[k] () ;
					}
					
					for ( i in a._t )
					{
						if(a._t[i]._onEF)
							a._t[i]._onEF (timeDiff) ;
					}

					for ( i in a._t )
					{
						if ( a._t[i].isDestroyed )
						{
							a._t.splice(i,1);
						}
					}
					
					a._d = now ;

					a._i = setTimeout ( arguments.callee , a._fr ) ;
				} , this._fr ) ;
			},
			
			/*
				Variable: _onEF
				
				Private
	 */
			_onEF: 0,
			
			/*
				Function: _destroyIndex
				
				Parameters:
					i
	 */
			_destroyIndex: function(i)
			{
				if (this._t[i])
				{
					this._t[i].destroy () ;
					
					this._t.splice(i,1);
				}
			},
			
			/*
				Function: ef
				
				Parameters:
					c
	 */
			ef: function ( c )
			{
				this.registerEnterFrame(c);
			},
			
			/*
				Function: registerEnterFrame
				
				Parameters:
					callback
	 */
			registerEnterFrame: function ( callback )
			{
				this._ef.push(callback) ;
			},

			/*
				Function: uef
				
				Parameters:
					c
	 */
			uef: function ( c )
			{
				this.unregisterEnterFrame(c);
			},

			/*
				Function: unregisterEnterFrame
				
				Parameters:
					callback
					
				Returns:
	 */
			unregisterEnterFrame: function ( callback )
			{
				var i = 0, l = this._ef.length ;
				for ( i ; i<l ; i++ )
				{
					if ( callback == this._ef[i] )
					{
						delete(this._ef[i]);
						return;
					}
				}
			},
			
			/*
				Function: registerTimer
				
				Parameters:
					delay
					callback
					repeat
	 */
			registerTimer: function ( delay, callback , repeat )
			{
				this._t.push( new ajsf.timer.TimerObj ( delay , callback, repeat ) ) ;
			},

			/*
				Function: unregisterTimer
				
				Parameters:
					delay
					callback
					repeat
				
				Returns:
	 */
			unregisterTimer: function ( delay, callback , repeat )
			{
				var i = 0, l = this._t.length ;
				for ( i ; i<l ; i++ )
				{
					if ( this._t[i].isThis ( delay, callback, repeat ) )
					{
						this._destroyIndex(i);
						return;
					}
				}
			}
			
			
			
		},

		/*
			Package: ajsf.Stylesheet
     */
		
		/*
			Variable: stylesheets
			
			This object contains several methods to modify global document stylesheets
     */
		stylesheets: {
			
			/*
				Variable: _added
				
				Array of CSS files loaded using ajsf.stylesheets.load
				
				Private
	 */
			_added: [],
			
			/*
				Function: load
				
				Inserts a new stylesheet into the document
				
				Parameters:
					url
	 */
			load: function ( url )
			{
				if (this._added.indexOf(url) == -1 && ajsf.aejax)
				{
					this._added.push(url);
					ajsf.resetDOMLoadState () ;
					var e = ajsf.create(null,'style','hidden');
					e.setAttribute('type','text/css');
					e.onUpdate=ajsf.delegate(this,'_onAdded');
					ajsf._lw ++ ;
					e.update(url) ;
				}
			},
			
			
			
			/*
				Function: _onAdded
				
				Private

	 */
			_onAdded: function (e)
			{
				// TODO: check for CSS content in case of 404, 403 HTTP status...
				( b.IE ? e.cssData : e.html)( this.expand(e.innerHTML) );
				_d.getElementsByTagName('head')[0].appendChild( e);
				ajsf._lw -- ;
				ajsf._onwindowload () ;
			},
			
			/*
				Function: expand
				
				Expand CSS rules from CSS3 valid rules to browser unvalid rules
				
				Example:
				container {
					box-shadow: 2px 2px 5px #000;
				}
				will become:
				container {
					box-shadow: 2px 2px 5px #000;
					-moz-box-shadow: 2px 2px 5px #000;
					-webkit-box-shadow: 2px 2px 5px #000;
					
				Parameters:
					css
					
				Returns:
				}
	 */
			expand: function ( css )
			{
				var rule , rules = ['box-shadow','border-radius','background-size'] ;
				while ( (rule = rules.shift()) )
				{
					css = css.replace(
						new RegExp('([^-])'+rule+':([^;\}]+)([;|\}])','ig'),
						'$1'+rule+':$2;-moz-'+rule+':$2;-webkit-'+rule+':$2$3' ) ;
					
					if ( rule == 'background-size' )
					{
						css = css.replace(
							new RegExp('([^-])'+rule+':([^;\}]+)([;|\}])','ig'),
							'$1'+rule+':$2;-khtml-'+rule+':$2;-icab-'+rule+':$2$3' ) ;
					}
				}
				
				return css ;
			},
			
			/*
				Function: inject
				
				Inject a string CSS stylesheet into page headers
				
				Parameters:
					cssString
	 */
			inject: function ( cssString )
			{
				if ( is('object',cssString) )
				{
					cssString = this.stringify(cssString);
				}
				
				if (this._added.indexOf(cssString) == -1)
				{
					this._added.push(cssString);
					var e = ajsf.create(null,'style');
					e.setAt('type','text/css');
					cssString = this.expand(cssString) ;
					e.innerHTML = cssString ;
					( b.IE ? e.cssData : e.html)( cssString );
					_u('head').insertBefore(e , _u('script','head') );
				}
			},
			
			/*
				Function: stringify
				
				Parameters:
					obj
					
				Returns:
	 */
			stringify: function ( obj )
			{
				if ( !obj ) return '' ;
				
				var str = '', k ;
				
				for ( k in obj ) str += k.replace( /([A-Z])/g , function(m,p1){
					return '-'+p1.toLowerCase();
				} ) + ':' + obj[k] + ';' ;
 				
				return str;
			}
		},

		

		/*
	    Package: ajsf.Mouse.Related
     */
		
		/*
	    Variable: mouse
     */
		mouse: {
			
			/*
				Variable: mouseX
	 */
			mouseX: 0,
			/*
				Variable: mouseY
	 */
			mouseY: 0,
			/*
				Function: update
				
				Parameters:
					x
					y
					
	 */
			viewportX: 0,
			viewportY: 0,
			
			__e: null,
			
			update: function ( x , y )
			{
				this.mouseX = x ;
				this.mouseY = y ;
			},
			
			/*
				Function: initialize
	 */
			initialize: function ()
			{
				var self = this ;
				_d.addListener ( 'mousemove' , function (e) {
					e = e || window.event ;
					self.__e = e ;
					var doc = document.documentElement, body = document.body;

					if ( e.pageX ) {
						ajsf.mouse.update(e.pageX , e.pageY) ;
						ajsf.mouse.viewportX = e.pageX - document.body.scrollLeft  ;
						ajsf.mouse.viewportY = e.pageY - document.body.scrollTop  ;
					} else {

						ajsf.mouse.update( e.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0) ,
							e.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc   && doc.clientTop  || body && body.clientTop  || 0) ) ;
						ajsf.mouse.viewportX = e.clientX ;
						ajsf.mouse.viewportY = e.clientY ;
					}
				}) ;
			},
			/*
				Function: isInside
				
				Parameters:
					obj - [DOMElement] Element to test
					margin - [int] Inner margin to consider (default: 0, positive values)
					
				Returns:
	 */
			isInside: function (obj, margin) {
				if (!_(obj).getTop) return false;
				margin = margin || 0 ;
		
				var x = this.mouseX - obj.getScrollLeft(true), y = this.mouseY - obj.getScrollTop(true) ;
		
				return ( x > 0 + margin && x < obj.w() - margin && y > 0 + margin && y < obj.h() - margin ) ;
			},
			/*
				Function: isOutside
				
				Parameters:
					obj
					
				Returns:
	 */
			isOutside: function (obj) {
				return !this.isInside(obj, 0);
			},
			
			getViewportX: function (  )
			{
				return ajsf.mouse.viewportX ;
			},
			
			getViewportY: function (  )
			{
				return ajsf.mouse.viewportY ;
			}
			
		},

		

		/*
			Package: ajsf.Viewport.Related
     */
		
		/*
		Variable: viewport
     */
		viewport: {
		
			/*
				Function: getWidth
				
				Returns:
	 */
			getWidth: function () {
				return this.getDimension("Width");
			},
			/*
				Function: getHeight
				
				Returns:
	 */
			getHeight: function () {
				return this.getDimension("Height");
			},
			/*
				Function: getDimension
				
				Parameters:
					dim
				
				Returns:
	 */
			getDimension: function (dim) {
				return ajsf.ROOT["client"+dim];
			},
			/*
				Function: getsize
				
				Returns:
	 */
			getSize: function () {
				return {
					width: this.getWidth(),
					height: this.getHeight()
				};
			}
		}
		
	
	} ;

	
	if ( !window.ajsf )
	{
		glob('ajsf',_ajsf) ;
	}
	
	/*
	 	Function: _
	 	
	 	A global scoped alias of ajsf.get function.
	 	
	 	Parameters:
	 		selector
	 		context
	 		ignoreCache
	 		asArray
	 	
		Returns:
		[DOM node | array of DOM nodes | empty array] One or many elements
			
	 	See also:
	 	<ajsf.get>
 */
	glob( '_' , function ( selector , context , ignoreCache , asArray ) {
		return ajsf.get ( selector , context , ignoreCache , asArray ) ;
	} ) ;
	
	
	
	/*
	 	Function: _a
	 	
	 	A global scoped alias of ajsf.get function with predefined parameters :
	 	- ignoreCache is set to true
	 	- asArray is set to true
	 	
	 	Parameters:
	 		selector
	 		context
	 	
		Returns:
		[DOM node | array of DOM nodes | empty array] One or many elements
		
	 	See Also:
	 	<ajsf.get>
	 	
	 	Private
 */
	glob( '_a' , function ( selector , context ) {
		return ajsf.get ( selector , context , false , true ) ;
	} ) ;
	
	
	/*
	 	Function: _u
	 	
	 	A global scoped alias of ajsf.get function with predefined parameters :
	 	- context is null
	 	- ignoreCache is set to false
	 	- asArray is set to false
	 	
	 	Parameters:
	 		selector
	 		context
	 	
		Returns:
		[DOM node | array of DOM nodes | empty array] One or many elements
			
	 	See Also:
	 	<ajsf.get>
	 	
	 	Private
 */
	glob( '_u' , function ( selector , context ) {
		return ajsf.get ( selector , context , true , false ) ;
	} ) ;
		
		
	

	/*
		Package: ajsf.CORE JAVASCRIPT PROTOTYPES IMPROVEMENT
 */
	
	
	
	/*
	Function: Math.rand
	
	Parameters:
		val
	
	Returns:
 */
	Math.rand = function ( val )
	{
		return (val == 0 ? 0 : Math.floor(Math.random()*(val)+1) );
	};



	/*
	Package: ajsf.Array.improvement
 */
	
	/*
		Function: Array.sort
		
		Parameters:
			arr
		
		Returns:
 */
	Array.sort = function ( arr )
	{
		arr.sort(function(a,b){
			return (a-b);
		});
	};
	/*
		Function: Array.usort
		
		Parameters:
			arr
		
		Returns:
 */
	Array.usort = function ( arr )
	{
		arr.sort(function(a,b){
			return (a-b);
		});
		arr.reverse () ;
	};
	/*
		Function: Array.sortk
		
		Parameters:
			arr
			key
		
		Returns:
 */
	Array.sortk = function ( arr, key )
	{
		arr.sort(function(a,b){
			return (a[key]-b[key]);
		});
	};
	/*
		Function: Array.usortk
		
		Parameters:
			arr
			key
		
		Returns:
 */
	Array.usortk = function ( arr, key )
	{
		arr.sort(function(a,b){
			return (a[key]-b[key]);
		});
		arr.reverse () ;
	};
	
	
	if (!Array.prototype.indexOf)
	{
		/*
			Function: Array.prototype.indexOf
			
			Check out https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array for these compatibility methods
			
			Parameters:
				searchElement
				fromIndex
			
			Returns:
			Index of element in array, -1 if not found
     */
		Array.prototype.indexOf = function(searchElement /*, fromIndex */)
		{
			"use strict";
			
			if (this === void 0 || this === null)
				throw new TypeError();
			
			var t = Object(this);
			var len = t.length >>> 0;
			if (len === 0)
				return -1;
			
			var n = 0;
			
			if (arguments.length > 0)
			{
				n = Number(arguments[1]);
				if (n !== n) // shortcut for verifying if it's NaN
					n = 0;
				else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0))
					n = (n > 0 || -1) * Math.floor(Math.abs(n));
			}
			
			if (n >= len)
				return -1;
			
			var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
			
			for (k ; k < len; k++)
			{
				if (k in t && t[k] === searchElement)
					return k;
			}
			return -1;
		};
	}
	
	if (!Array.prototype.forEach)
	{
		/*
			Function: Array.prototype.forEach
			
			https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array for these compatibility methods
			
			Parameters:
				fun
			
			Returns:
			void
     */
		Array.prototype.forEach = function(fun /*, thisp */)
		{
			"use strict";
			
			if (this === void 0 || this === null )
			{
				throw new TypeError();
			}
			
			if ( !is(fun,'function' ) )
			{
				return;
			}
			
			var t = Object(this),
			len = t.length >>> 0,
			thisp = arguments[1], i = 0;

			
			for ( i ; i < len; i++)
			{
				if (i in t)
				{
					fun.call(thisp, t[i], i, t);
				}
			}
		};
	}
	/*
		Package: ajsf.String.Improvement
 */
	
	/*
		Function: String.prototype.trim
		
		Returns:
 */
	String.prototype.trim = function() {
		return this.replace(/^[\s\t\n\r]+|[\s\t\n\r]+$/g, '');
	};

	String.prototype.capitalize = function(){
		return this.replace( /(^|\s)([a-z])/g , function(m,p1,p2){
			return p1+p2.toUpperCase();
		} );
	};
	
	String.prototype.ucfirst = function(){
		return this.replace( /(^)([a-z])/g , function(m,p1,p2){
			return p1+p2.toUpperCase();
		} );
	};
	

	

	/*
		Package: ajsf.CORE.AJSF.CLASSES
 */
	
	
	
	/*
		AJSF Base Class
	
	
		Simple JavaScript Inheritance
		By John Resig http://ejohn.org/
		MIT Licensed.
 */
	// Inspired by base2 and Prototype
	(function(){
		var initializing = false, fnTest = /xyz/.test(function(){
			xyz;
		}) ? /\b_super\b/ : /.*/,
		expandProps = function ( prop, prototype, _super )
		{
	    
			// Copy the properties over onto the new prototype
			for (var name in prop) {
				// Check if we're overwriting an existing function
				prototype[name] = typeof prop[name] == "function" &&
				typeof _super[name] == "function" && fnTest.test(prop[name]) ?
				(function(name, fn){
					return function() {
						var tmp = this._super;
	            
						// Add a new ._super() method that is the same method
						// but on the super-class
						this._super = _super[name];
	            
						// The method only need to be bound temporarily, so we
						// remove it when we're done executing
						var ret = fn.apply(this, arguments);
						this._super = tmp;
	            
						return ret;
					};
				})(name, prop[name]) :
				prop[name];
			}
	    
		};
		// The base Class implementation (does nothing)
	  
		/*
	  	Function: ajsf.Class
     */
		ajsf.Class = function(){};
	  
		// Create a new Class that inherits from this class, or from the given prototype
		/*
	  	Function: ajsf.Class.extend
	  	
	  	Parameters:
	  		prop
	  		prototype
	  		
	  	Returns:
     */
		ajsf.Class.extend = function(prop, prototype) {
			var _super = this.prototype;
	    
			// Instantiate a base class (but only create the instance,
			// don't run the init constructor)
			initializing = true;
			if (!prototype)
			{
				prototype = new this();
			} else {
				prototype = new prototype ();
			}
			initializing = false;
	    
			expandProps ( prop, prototype , _super ) ;
	    
			// The dummy class constructor
			function Class() {
				// All construction is actually done in the init method
				if ( !initializing )
				{
					if ( this.init__) {
						this.init__ () ;
					}
					if ( this.construct ) {
						this.construct.apply(this, arguments);
					}
				}
			}
	    
			// Populate our constructed prototype object
			Class.prototype = prototype;
	    
			// Enforce the constructor to be what we expect
			Class.constructor = Class;
	
			// And make this class extendable
			Class.extend = arguments.callee;
	
			Class.overload = function(prop)
			{
				expandProps ( prop, this.prototype , this.prototype ) ;
			} ;
		 
			return Class;
		};
	})();
	
	/*
		AJSF AbstractEvtDispatcher Class
		To do so , this method construct a dummy container that dispatch and receive events.
 */
	ajsf.AbstractEvtDispatcher = ajsf.Class.extend({
		
		/*
			Variable: dispatcher__
			
			Private
     */
		dispatcher__: null,
		
		/*
			Function: init__
			
			Private
     */
		init__: function ()
		{
			this.dispatcher__ = ajsf.create () ;
		},
		/*
			Function: dispatch
			
			Parameters:
				event
				
			Returns:
     */
		dispatch: function ( event )
		{
			return this.dispatcher__.dispatch( event ) ;
		},
		/*
			Function: on
			
			Parameters:
				event
				callback
     */
		on: function ( event , callback )
		{
			this.dispatcher__.on(event, callback) ;
		},
		listen: function ( evt, cbk )
		{
			this.on(evt, cbk);
		},
		addListener: function ( evt, cbk )
		{
			this.on(evt, cbk);
		}
	
	});
	
	/*
		AJSF TimerObj class
 */
	ajsf.timer.TimerObj = ajsf.Class.extend({
		construct: function ( delay , callback, repeat ) {
			this._d =  delay ;
			this._c = callback ;
			this._r = repeat ;
			this._r2 = repeat ;
			this._dif = delay ;
			this.isDestroyed = false ;
		},
	
		/*
			Function: _onEF
			
			Called by ajsf.timer._onEF
			
			Parameters:
				timeDiff
				
			Private
     */
		_onEF: function ( timeDiff)
		{
			this._dif -= timeDiff ;
			if ( this._dif <= 0 && !this.isDestroyed )
			{
				if( !this.callback() )
				{
					this.destroy () ;
				}
			}
		},
		
		/*
			Function: callback
			
			Returns:
     */
		callback: function (  )
		{
			if ( this._c )
			{
				this._c () ;
			}
	
			this._r = this._r - 1 ;
			
			if ( this._r == 0 )
			{
				return false ;
			}
			
			this._dif = this._d ;
			
			return true ;
		},
		
		/*
			Function: inThis
			
			Parameters:
				delay
				callback
				repeat
				
			Returns
     */
		isThis: function ( delay, callback, repeat )
		{
			return ( this._d == delay && this._c == callback && this._r2 == repeat ) ;
		},
		
		destroy: function ()
		{
			this.isDestroyed = true ;
			this._c = null ;
		}
	});


	/*
		AJSF Config Class
 */
	ajsf.Config = ajsf.Class.extend({
		
		/*
			Constructor: construct
     */
		construct: function ()
		{
			this._c = [] ;
		},
		/*
			Function: set
			
			Parameters:
				key
				value
			
			Returns:
			Current instance for chained commands on this element
     */
		set: function ( key, value )
		{
			this._c[key] = value ;
			return this;
		},
		
		/*
			Function: get
			
			Parameters:
				key - [string] Name of the conf value
				def - Default value to return if key not found
     */
		get: function ( key , def )
		{
			return this._c[key] || def ;
		},
		/*
			Function: unset
			
			Parameters:
				key
     */
		unset: function ( key )
		{
			delete this._c[key] ;
		}
	});
	

	/*
		AJSF Point Class
 */
	ajsf.Point = ajsf.Class.extend({
		/*
			Constructor: construct
			
			Parameters:
				x
				y
			
			Returns:
     */
		construct: function (x , y)
		{
			this._x = x ;
			this._y = y ;
		},
		x: function ()
		{
			return this._x ;
		},
		y: function ()
		{
			return this._y ;
		}
	});
	

	/*
		AJSF Size Class
 */
	ajsf.Size = ajsf.Class.extend({
		/*
			Constructor: construct
			
			Parameters:
				w
				h
     */
		construct: function(w , h)
		{
			this._x = w ;
			this._y = h ;
		},
		
		/*
			Function: w
			
			Returns:
     */
		w: function ()
		{
			return this._x ;
		},
		/*
			Function: h
			
			Returns:
     */
		h: function ()
		{
			return this._y ;
		}
	});
	
	
	
	


	/*
		Package: ajsf.CORE AJSF PRE INIT
 */

	/*
		AJSF _d Class
		The convenient variable to access window.document updated with interfaces
 */
	_d = ajsf.extend ( _d ) ;
	
	/*
		A convenient variable to access ajsf main object
 */
	glob('$', glob('ajsf', ajsf) ) ;
	


	
})();






//Dean Edwards/Matthias Miller/John Resig

(function(i2)
{
	var _timer ,
	_done = false,
	i1= function ()
	{
		if ( !ajsf.isIE && !document.body )
		{
			if ( !_timer )
			{
				_timer = setInterval(i1, 10);
			}
			return;
		}
	
		// kill the timer
		if (_timer)
		{
			clearInterval(_timer);
		}
			
		// quit if this function has already been called
		if (_done)
		{
			return;
		}
			
		// flag this function so we don't do the same thing twice
		_done = true;
			
		i2 () ;
	};
		
	/* for Mozilla/Opera9 */
	if (document.addEventListener) {
		document.addEventListener("DOMContentReady", i1, false);
	}
	
	/* for Internet Explorer */
	/*@cc_on @*/
	/*@if (@_win32)
		document.write("<script id=__ie_onload defer src=javascript:void(0)><\/script>");
		var script = document.getElementById("__ie_onload");
		script.onreadystatechange = function() {
			if (this.readyState == "complete") {
				i1(); // call the onload handler
			}
		};
		return;
	/*@end @*/
	
	/* for Safari */
	if (/WebKit/i.test(navigator.userAgent)) { // sniff
		_timer = setInterval(function() {
			if (/loaded|complete/.test(document.readyState)) {
				i1(); // call the onload handler
			}
		}, 10);
	}
	
	/* for other browsers */
	window.onload = i1;

})(ajsf.delegate ( ajsf , "_onwindowload" ));

