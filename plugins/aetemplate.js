
/*
	Package: ajsf.aetemplate


*/

(function (){

	/*
		Class: ajsf.Template
	 	
	 	Extends: ajsf.AbstractEvtDispatcher
	*/
	
	ajsf.Template = ajsf.AbstractEvtDispatcher.extend({
		
		/*
			Variable: template_
	
			The template code
	
			Private
		*/
		template_: '',
		
		
		
		
		/*
			Variable: vars_
		
			Variables to insert into template
		
			Private
		*/
		vars_: [],
	
		
		/*
			Variable: res_
		
			Resulting HTML after a render
		
			Private
		*/
		res_: null,
		
		/*
			Variable: url_
		
			Loading template url
		
			Private
		*/
		url_: '',
		
		
		/*
			Variable: lc_
		
			Container for ajax loading
		
			Private
		*/
		lc_: null,


		/*
			Variable: ctn_
		
			Container
		
			Private
		*/
		ctn_: '',

		
		/*
			Variable: undefined_
			
			Undefined value
		
			Private
		*/
		undefined_: '',

		
		
		
		
		
		/*
			Constructor: construct
	
			Create a new template
	
			Parameters:
				template - [string] The HTML template
				vars - [array] An array of variables to insert into template
		*/
		construct: function ( template , vars) {
			this.template_ = template || '' ;
			this.vars_ = vars || [] ;
		},
		
		
		
		/*
			Function: setContainer
		
			Set the template rendering container
		
			Parameters:
				ctn - [DOMElement] The DOM element into render the template
		
			Returns:
			Current instance for chained commands on this element
		*/
		setContainer: function ( ctn )
		{
			this.ctn_ = _(ctn) ;
			return this;
		},

		
		
		
		
		
		/*
			Function: getContainer
		
			Get the template rendering container
		
			Returns:
			The template rendering container
		*/
		getContainer: function ()
		{
			return this.ctn_ ;
		},
		
		
		/*
			Function: setTemplate
		
			Set the template code
		
			Parameters:
				template - [string] Template code
		
			Returns:
			Current instance for chained commands on this element
		*/
		setTemplate: function ( template )
		{
			this.template_ = template ;
			return this;
		},


		/*
			Function: getTemplate
		
			Get the template code

			Returns:
			[string] Template code
		*/
		getTemplate: function ()
		{
			return this.template_ ;
		},
		
		
		/*
			Function: setUndefined
		
			Set the string that is written when a variable is not available. Default is empty: ''.
		
			Parameters:
				str - [string] Undefined string replacement
		
			Returns:
			Current instance for chained commands on this element
		*/
		setUndefined: function ( str )
		{
			this.undefined_ = str ;
			return this;
		},


		/*
			Function: getUndefined

			Get the undefined string
		
			Returns:
			[string] Undefined string replacement
		*/
		getUndefined: function ()
		{
			return this.undefined_ ;
		},
		
		/*
			Function: set
		
			Set or edit a registered variable
		
			Parameters:
				key - [string] Name of variable inside template
				value - [mixed] Value of the variable
		
			Returns:
			Current instance for chained commands on this element
		*/
		set: function ( key, val )
		{
			this.vars_[key] = val ;
			return this ;
		},
		
		
		/*
			Function: get
		
			Get a variable value
		
			Parameters:
				key - [string] Name of variable inside template
				data
		
			Returns:
			Corresponding value is key exists or undefined otherwise
		*/
		get: function ( key , data)
		{
			var val = null, o, args = [] ;
		
			// First we retrieve and clean function arguments
			if ( key.indexOf(':') > -1 ) {
				key = key.split(':') ;
				while ( key.length > 1 )
				{
					args.push(key.pop().trim());
				}
				key = key[0].trim() ;
			}
			
			if ( key.indexOf('.') > -1 )
			{
				val = ajsf.retrieve(key, data || this.vars_) ;
			} else {
				val = (data ? data[key] : this.vars_[key] ) ;
			}
			if ( is(val,'function') )
			{
				if ( key.indexOf('.') > -1 )
				{
					o = ajsf.retrieveParent (key, data || this.vars_) ;
					
					return o.object.apply ( o.parent, args ) ;
				}
				return val.apply(null,args);
			}
			return val;
		},
		
		
		/*
			Function: getAll

			Get all variables
		
			Returns:
			Array of all registered variables
		*/
		getAll: function ()
		{
			return this.vars_ ;
		},
		
		
		/*
			Function: has
		
			Check if a variable key exists in variables array
		
			Parameters:
				key - [string] Name of variable inside template
		
			Returns:
			True if key exists, false otherwise
		*/
		has: function ( key )
		{
			return this.get(key) != undefined ;
		},
		
		
		/*
			Variable: getLastResult
		
			Returns last rendering 
		*/
		getLastResult: function ()
		{
			return this.res_ ;
		},
		
		/*
			Function: render
		
			Render the template
		
			Parameters:
				template
		
			Returns:
		*/
		
		render: function ( template )
		{
			this.res_ = this.render_(template || this.template_, this.vars_ ) ;

			if ( !b.IE ) this.dispatch('rendered');

			if ( this.ctn_ ) this.ctn_.html( this.getLastResult() ) ;
			
			return this.res_ ;
		},
    
		/*
			Function: render_
		
			Do really render the template, with given template and data
		
			Parameters:
				template
				data
		
			Returns:

			Private
		*/
		render_: function ( template , data )
		{
			if(!is(template.indexOf,'function'))
			{
				return '' ;
			}
			
			var k, 
				i = 0,
				j, h, l, m, res = [],
				s = template ,
				l = s.length ;
			
			
			while (i < l)
			{
				j = s.indexOf('<%', i);
				
				if (j == -1)
				{
					res.push( s.substr(i) );
					break;
				} else {
					res.push( s.substring(i, j) );
					i = j;
				}
				if ( s[i+2] == '@' )
				{
					j = s.indexOf("<%@%>", i);
					h = 5 ;
				} else {
					j = s.indexOf("%>", i);
					h = 2;
				}

				if ( s[i+2] == '!' )
				{
					j = s.indexOf("<%!%>", i);
					h = 5 ;
				} else {
					j = s.indexOf("%>", i);
					h = 2;
				}
				
				if (j == -1) {
					
					throw ("Missing '%>' or '@%>' at end of template / " + s.substring(i));
				}
				
				res.push( this.evaluate_(s.substring(i + 2, j), data) );
				
				i = j + h;
			}
			return res.join('') ;
		},
		
		
		/*
			Function: evaluate_
		
			Evaluate a part of a template

			Parameters:
				str
				data
		
			Returns:
		
			Private
		 */
		evaluate_: function ( str , data )
		{
			var operator = str.substring(0,1),
				s2 = str.substring(1).trim() ,
				val, k, res = [] ;
	//pour ie7 s2 pas bon
			switch(operator)
			{
				// This is a variable
				case '=':
					val = this.get(s2, data);
					
					return (val ? (val.trim ? val.trim() : val ) : this.undefined_ ) ;
				// This is a condition
				case '!':
					var i = s2.indexOf( '%>' ),
						i7=s2.indexOf('0'),						
						s3 = s2.substr( 0,i ) , // the test
						
						s37 =  s2.substr( 0,i7 ),   
						s4 = s2.substr( i+2 ) , // data to render if condition fits
						s47 = s2.substr( i7) ,
						i2 = s4.indexOf( '<%-%>' ) ,
						i3 = s4.indexOf( '<%else%>' ) ,
						alternative = '',
						operator = '==',
						val ;
				
					if ( i2 > -1 )
					{
						//alert(i2);
						alternative = s4.substr(i2 + 5);
						s4 = s4.substr(0,i2);
						if ( ajsf.isIE && IEVersion < 8 )
						{
							s4=s4.substr(0,i2-2);
						}
					//alert(s4);
					}
					
					else if (i3 > -1)
					{
						//alert(i3);
						alternative = s4.substr(i3 +8);
						s4 = s4.substr(0,i3);
					}
					
					if ( s3.indexOf('!=') > -1 )
					{
						operator = '!=';
						s3 = s3.split('!=') ;
					} else {
						s3 = s3.split('==') ;
					}
					s3[0] = s3[0].trim() ;
					val = s3.length > 1 && typeof(s3[1]) === 'string' ? s3[1].trim() : '' ;
					
					switch(true)
					{
						case val == 'true': val = true ; break;
						case val == 'false': val = false ; break;
						case !isNaN(parseInt(val)): val = parseInt(val) ; break;
					}
					switch(operator)
					{
						case '!=':
							if ( this.get(s3[0], data) != val )
							{
								return this.render_(s4, data);
							}
							break;
						case '==':
							if ( this.get(s3[0], data) == val )
							{
								return this.render_(s4, data);
							}
							break;
					}
					
					return alternative;
				// This is a comment
				case '#':
					return '';
				// This is a loop
				case '@':
					s2 = s2.split(' ');
					
					val = this.get(s2.shift(), data);
					s2 = s2.join(' ').trim().substr(2);
					if ( val && is(val,'object'))
					{
						for ( k in val )
						{

							res.push( this.render_( s2, val[k] ) );
						}
					}
					return res.join('\n').trim();
					
			}
			
			return this.undefined_ ;
		},
		
		/*
			Function: attach
		
			Attach last render to given node
		
			Parameters:
				node - [DOMElement] The parent DOM node of template result
			 
			Returns:
			[boolean] True if node found and usable, false otherwise 
		*/
		attach: function ( node )
		{
			if ( this.elem_ && _(node).html )
			{
				node.html(this.elem_) ;
				return true ;
			}
			return false;
		},
	
		/*
			Function: destroy
		
			Destroy the Template instance
		*/
		destroy: function ()
		{
			this.vars_ = null ;
			this.res_ = null ;
			if ( this.lc_ )
			{
				this.lc_.destroy () ;
				this.lc_ = null ;
			}
			
		},
		
		/*
			Function: load
		
			Loads an external template.
		
			If a template is yet loading in this instance, this method does not start the second loading. E.g. you can't load two templates. To do so, you have to create two instance of Template class. 
		
			Parameters
				URL
		
			Returns:
			True if loading authorized, false otherwise. 
		*/
		load: function (URL)
		{
			if ( this.lc_ != null )
			{
				return false ;
			}
			this.url_ = URL ;
			ajsf.load('aejax');
			ajsf.ready(ajsf.delegate(this,'load_'));
			return true;
		},
		
		/*
			Functions: load_
		
			Actually loads the external template
		
			Private
		*/
		load_: function ()
		{
			if ( this.url_ )
			{
				// We create a textarea because it's the only element that keep intact HTML code, even errors
				this.lc_ = ajsf.create(null,'textarea','hidden');
				_d.body.appendChild(this.lc_);
				this.lc_.on('ajaxUpdate', ajsf.delegate(this, 'onLoad_'))
						.update(this.url_);
				this.dispatch('startLoad');
			}
		},

		/*
			Function: onLoad_
			
			Load template callback
			
			Private
		*/
		onLoad_: function ()
		{
			this.template_ = this.lc_.value ;
			this.lc_.destroy () ;
			this.lc_ = null ;
			this.dispatch('load');
			this.render () ;
		}
	});
}) () ;
