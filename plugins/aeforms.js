

/**********************************
 * AJSF - Aenoa Javascript Framework
 * (c) Xavier Laumonier 2010-2011
 *
 * Since : 
 * Author : Xavier Laumonier
 *
 **********************************/

/**********************************
 * 
 **********************************/

(function (){

	
ajsf.forms = {
	
		
	selectAllRange: function (input)
	{
		if ( !input.createTextRange ) return ;
		
		var range = input.createTextRange();;
		range.collapse(true);
		range.moveStart('character', 0);
		range.moveEnd('character', input.value.length );
		range.select(); 
	}
		
} ;

ajsf.forms.PasswordConfirm = ajsf.Class.extend({
	
	construct: function ( password, password_confirm )
	{
	}
});


ajsf.forms.Form = ajsf.Class.extend({
	
	construct: function ( formElement , ajaxize , ajaxUpdateContainer )
	{
		this._data = {} ;
	
		this._f = ajsf.extend(formElement) ;
		
		this._f.controller = this ;

		if ( ajaxize )
		{
			ajsf.aeforms.ajaxize(this._f, null , ajaxUpdateContainer) ;
		} else {
			ajsf.aeforms.setupInputs(this._f);
		}
		if ( this._f.getAt('data-modified') == 'modified' )
		{
			this._f.dispatch('change') ;
			
			if ( this._f.getAt('data-odd') !== 'odd' )
			{
				this._f.isModified = true ;
			}
		}
	},
	setUpdateContainer: function ( ctn )
	{
		if ( !this._f.updateContainer )
		{
			ajsf.aeforms.ajaxize(this._f, null , ctn) ;
		} else {
			this._f.updateContainer = ctn ;
		}
	},
	submit: function ( message )
	{
		this._f.doSubmit ( message ) ;
	},
	submitOnKeyUp: function ( element )
	{
		ajsf.extend(element).on ('keyup', function (){
			this.form.doSubmit () ;
		});
	},
	appendData: function (o)
	{
		for ( var k in o )
		{
			this._data[k] = o[k] ;
		}
	},
	getAppendedData: function ()
	{
		return this._data ;
	},
	setModified: function ( val )
	{
		this._f.isModified = (val === true);
	},
	flushAppendedData: function ()
	{
		var d = this._data ;
		this._data = {} ;
		return d ;
	},
	getForm: function ()
	{
		return this._f ;
	},
	getInput: function (index)
	{
		return this._f.elements[index] ;
	},
	disableAll: function ()
	{

		for ( k in this.elements )
		{
			elem = _(this.elements[k]);
			if(elem.getAttribute&&elem.getAttribute('type') != 'file')
			{
				elem.disabled = true ;
			}
		}
	}
});
	


ajsf.aeforms = {
		
		/**
		 * Forms relative to tables
		 */
		table: {
			
			selectCheckboxes: function ( tableId, check )
			{
				var s = _('input', '#' + tableId , false,true) , k ;
				
				for ( k in s )
				{
					if ( s[k] && s[k].type == 'checkbox' )
					{
						s[k].checked = check ;
					}
				}
			}
	
	
		},
		
		suggestions: {
			
			addCallback: function (f)
			{
				if (is(f,'function'))
					this._callbacks.push(f);
			},

			remCallback: function (f)
			{
				this._callbacks.splice(this._callbacks.indexOf(f),1);
			},
			
			_executeCallbacks: function (label,data,dbid,table,field)
			{
				for ( var k in this._callbacks )
				{
					label = this._callbacks[k] (label,data,dbid,table,field);
				}
				return label ;
			},
			
			_onSelect: function (inputID,label,id)
			{
				$.aeforms.pickin.select(inputID,label,id);
				
			},
			
			_callbacks: [],
			
			_index: -1,
			
			_input: null,
			
			isCurrentInput: function ( input )
			{
				return input == this._input ;
			},

			isHighlighted: function (  )
			{
				return this._index > -1 ;
			},
			
			down: function ()
			{
				if ( this._length == 0 ) return;
				
				this._unhighlight () ;
				
				if ( this._index > 0 )
				{
					this._index-- ;
					this._highlight() ;
				}
			},
			
			up: function ()
			{
				if ( this.length == 0 ) return;
				
				this._unhighlight () ;
				
				if ( this._index < this._length - 1 )
				{
					this._index++;
					this._highlight() ;
				}
			},
			
			_unhighlight: function ( indexToNull )
			{
				if ( this._index > -1 )
				{
					this._list[this._index].remClass('hover');
					
					if ( indexToNull === true ) this._index = -1 ;
				}
			},
			
			_highlight: function ()
			{
				this._list[this._index].addClass('hover');
			},
			
			_length: 0,
			
			_current: null,
			
			_list: new Array (),
			
			show: function ( input , suggestions )
			{
				var e,k ,o , src, field;
				
				if ( this._suggestionsCtn == null )
				{
					e = _d.createElement('ul');
					e.setAttribute('id','suggestionsCtn' ) ;
					e.setAttribute('class','suggestions no-list-style' ) ;
					_d.body.appendChild(e) ;
					this._suggestionsCtn = _(e) ;
					this._suggestionsCtn.tweenOnDisplay = true; 
				} else {
					e = this._suggestionsCtn ;
					e.innerHTML = '';
				}
				
				this._input = input ;
				this._length = 0 ;
				this._index = -1 ;
				this._suggestionsCtn.input = input ;
				
				if ( !_d.dispatch('formSuggestion') )
				{
					return;
				}

				if ( input.hasAttribute('data-ac-init-cb') )
				{
					o = $.retrieve(input.getAttribute('data-ac-init-cb') ) ;
					if (is(o,'function'))
					{
						suggestions = o ( suggestions ) ;
					}
				}
				
				src = input.getAttribute('data-ac-source') ;
				src = src.split('/') ;
				
				field = src[2] ;
				e.show () ;
				
				var callback = function ( data, mainField ) { return data[mainField] ; } ,
					label = '' ,
					suffix = '',
					prefix = '',
					content = '' ,
					element = null,
					primary = (input.hasAttribute('data-ac-primary-key') ? input.getAttribute('data-ac-primary-key') : 'id' ) ;
				
				if ( input.hasAttribute('data-ac-cb') )
				{
					o = $.retrieve(input.getAttribute('data-ac-cb') ) ;
					if (is(o,'function'))
					{
						callback = o; 
					}	
				}
				
				if ( suggestions.length > 0 )
				{
					for ( k in suggestions )
					{
						suffix = '' ;
						prefix = '' ;
						label = callback ( suggestions[k] , field ) ;
						if ( is(label,'object') )
						{
							suffix = label[2] ;
							prefix = label[0] ;
							label = label[1] ;
						}
						content = suggestions[k][primary] ;
						
						label = this._executeCallbacks(label, suggestions[k], src[0], src[1], src[2]) ;
						
						element = $.create ( null, 'li' , 'sans-serif hoverable' ) ;
						
						element._i = input.getAttribute('id');
						element._l = label;
						element._c = content ;
						
						element.addListener ( 'click' , function (e) {$.aeforms.suggestions._onSelect(this._i, this._l, this._c);}) ;
						element.addListener ( 'mouseover' , function (e) {$.aeforms.suggestions._unhighlight(true);}) ;
						
						element.innerHTML = prefix +label+suffix ;
						
						this._list[this._length] = element ;
						
						e.appendChild(element);
						
						this._length ++ ;
					}
				} else if ( input.hasAttribute('data-ac-empty-message') )
				{
					element = $.create ( null, 'li' , 'sans-serif' ) ;

					element.innerHTML = input.getAttribute('data-ac-empty-message') ;
					
					e.appendChild(element);
				}
				
				this._windowResizeHandler () ;
			},
			
			
			selectCurrent: function ()
			{
				if ( this._index > -1 )
				{
					var e = this._list[this._index] ;
					this._onSelect ( e._i, e._l, e._c ) ;
				}
			},

			_suggestionsCtn: null,
			
			_windowResizeHandler: function ()
			{
				if ( this._suggestionsCtn )
				{
					var e =  this._suggestionsCtn ;
					
					e.setLeft( e.input.getLeft() ) ;
					e.setTop( e.input.getTop () + e.input.h () ) ;
					e.scrollTop = 0 ;
					e.stylize ('width', e.input.w () + 'px' ) ;
				}
			},
			
			hide: function ()
			{
				if ( this._suggestionsCtn )
				{
					this._suggestionsCtn.destroy (false) ;
				}			
				this._suggestionsCtn = null ;
				
				this._list = new Array () ;
				this._index = -1 ;
				this._length = 0 ;
				this._input = null ;
			},
			
			isVisible: function ()
			{
				return this._list && this._list.length > 0 ;
			}
		},
	
		pickin: {
			
			unselect: function(o, id, inputID)
			{
				_('#'+inputID+'/'+id).destroy (true) ;
				var e = _('#'+inputID.split('/input').join('')), a = e.value.split(',') ;
				a.splice(a.indexOf(id),1) ;
				e.value = a.join(',') ;
				e.dispatch('change') ;
				e.inputValidation () ;
			},
			
			unselectLast: function ( inputID )
			{
				if ( this.lastSelected == null ) return ;
				
				this.unselect(null, this.lastSelected, inputID)
				
			},
			
			lastSelected: null,
			
			select: function(inputID,label,id)
			{
				if (label==undefined)
				{
					label = id ;
				}
				
				this.lastSelected = id ; 
				
				var e= _('#' + inputID) , 
					html = '<div id="'+inputID+'/' +id+ '"><a onclick="$.aeforms.pickin.unselect(this.offsetParent,\''+id+'\',\''+inputID+'\');return false;">X</a> ' + label + '</div>', 
					e2 = _('#' + inputID.split('/input').join('')) ,
					e3 = _('#' + inputID.split('/input').join('/display')),
					a = ( e2.value ? e2.value.split(',') : [] ) ;

				if ( !e3.hasAttribute('data-ac-multi') || e3.getAttribute('data-ac-multi') == "false" )
				{
					e3.value = (e3.hasAttribute('placeholder') ? e3.getAttribute('placeholder') : '' );
					e3.blur ();
					e3.setClass ('idle');
					ajsf.aeforms.suggestions.hide () ;
				}
				
				e.addClass('valid idle');
				
				if ( !e3.hasAttribute('data-ac-multi') || e3.getAttribute('data-ac-multi') == "false" )
				{
					e3.innerHTML = html;
					e2.value = id ;
				} else
				{
					if ( a.length == 0 || a.indexOf(id) == -1 )
					{
						e3.innerHTML = e3.innerHTML + html;
						a.push(id);
						e2.value = a.join(',') ;
					} else {
						_('#'+inputID+'/'+id).tween({opacity:0},{opacity:1},"regularEaseOut",0.5);
					}
				}
				e2._currentLabel = label ;
				e2.getLastLabel = function () {
					return this._currentLabel ;
				};
				e2.dispatch('change') ;
				e2.inputValidation () ;
			}
			
		},
		
		isForm: function (e)
		{
			return (e.toString&&e.toString()=="[object HTMLFormElement]");
		},
		
		submitTo: function ( formId , submissionURL )
		{
	
			var f = (is(formId,'string') ? _( '#' + formId ) : formId ) ;
			if ( this.isForm(f) )
			{
				f.action = submissionURL ;
				f.submit () ;
			}
		},
		
		
		
		/**
		 * Add auto validation, and others cool auto stuff process on an input
		 */
		addAutoValidation: function ( input )
		{
			if(!input || !input.getAttribute  ) return;
			
			var id = input.getAttribute('id') ,
				p , e ;
			
			// If no title, but a placeholder, set the placeholder as the title. After all, it's pretty the same for an input
			if ( !input.title && input.hasAttribute("placeholder"))
				input.title = input.getAttribute("placeholder");
			
			// We create a box for error messages, dedicated to this input
			p = input.getParent() ;
			e = _d.createElement('div');
			e.setAttribute('id','errors_'+ id) ;
			e.setAttribute('class','error-msg' ) ;
			e.setAttribute('style','display:none' ) ;
			p.appendChild(e);
			
			input.hideSuggestionsDelegation = $.delegate($.aeforms.suggestions,'hide') ;
			
			input.behavior = null ;
			
			if ( input.hasAttribute('data-behavior') )
			{
				switch ( input.getAttribute( 'data-behavior' ) ) 
				{
					case "latlng":
						input.addListener('focus',function(e){
							$.aeforms.advanced.latlngBehavior(this);
						});
						break;
				}
			}
			
			// It's the same behavior as the HTML5 placeholder behavior
			if(  (input.value == '' || input.title == input.value ) )
			{
				input.value = input.title ;
				input.setClass ( 'idle' ) ;
			}
			
			// On focus, we init validity
			input.addListener('focus',function(e){
				$.undelayed(600,this.hideSuggestionsDelegation);
				this.inputValidation() ;
				if ( this.value == this.title )
				{
					this.value = '' ;
				}
			});
			
			input.addListener('change',function(){
				this.form.dispatch('change');
			});
			
			// On unfocus on input, we recheck validity
			input.addListener('blur',function(e){
				// If empty, the set title as value (placeholder behavior)
				if ( this.value == '' )
				{
					this.value = this.title;
				}
				this.inputValidation() ;
				$.delayed(300,this.hideSuggestionsDelegation);
				
			});

			if ( _('#'+id+'/__data',null,true,true).length == 1 )
			{
				var obj = $.aejson.fromjson(_('#'+id+'/__data').innerHTML) ,
					obj2 = _('#'+id+'/input') ,
					src = obj2.getAttribute('data-ac-source').split('/') ,
					key = obj2.getAttribute('data-ac-primary-key') ,
					label = '';
				
				
				for ( var k in obj )
				{
					label = obj[k][src[2]];
					label = this.suggestions._executeCallbacks(label, obj[k], src[0], src[1], src[2]) ;
					
					$.aeforms.pickin.select ( id + '/input' , label , obj[k][key] ) ;
				}
			}

			input.autoComplete = function ()
			{
				if ( this.hasAttribute('data-ac-source') )
				{
					this._autoComplete () ;
				}
			} ;

			input._autoComplete = function ()
			{
				var src = this.getAttribute('data-ac-source') ,
					conds = ( this.hasAttribute('data-ac-conditions') ? this.getAttribute('data-ac-conditions') : '' ) ;
				
				if ( this.lastValue && this.lastValue === this.value )
				{
					return ;
				}
				
				this.lastValue = this.value ;
				
				$.aejax.request($.URL + 'api' , 'core::data::autoComplete', {query: this.value, source: src, conditions: conds, results: 20} , $.delegate(this,"onAutoCompleteUpdate"), true, true ) ;
			} ;


			input.autoCompleteDelegation = $.delegate(input,'_autoComplete') ;
			
			// On key down we check for some special cases
			input.addListener('keydown',function(e)
			{
				return true ;
			});
			
			// On key up, we run validation
			input.addListener('keyup',function(e){
				if ( this.inputValidation() )
				{
					if ( this.hasAttribute('data-ac-source') )
					{
						var intKeyCode = e.keyCode;

						if ( ajsf.aeforms.suggestions.isVisible () && ( intKeyCode == 40 || intKeyCode == 38 || intKeyCode == 27 ) )
						{
							// Up arrow key
							if ( intKeyCode == 40 )
							{
								$.aeforms.suggestions.up () ;
								ajsf.prevent(e);
							// Down arrow key
							} else if ( intKeyCode == 38 )
							{
								$.aeforms.suggestions.down () ;
								ajsf.prevent(e);
							// Escape
							} else if ( intKeyCode == 27 )
							{
								$.aeforms.pickin.unselectLast ( this.getAt('id') ) ;
							// Enter, tab
							}

							
						} else {
							_(this).addClass('updating') ;
							$.undelayed( 200, this.autoCompleteDelegation ) ;
							$.delayed( 200, this.autoCompleteDelegation ) ;
						}
					}
				}

				if ( this.hasAt('data-behavior-urlize-to') )
				{
					e = _('#'+this.getAt('data-behavior-urlize-to')) ;
					e.value = $.urlize(this.value) ;
					if(e.inputValidation) e.inputValidation () ;
				}
			});
			
			input.addListener('keydown',function(e){
				var intKeyCode = e.keyCode;
				if (this.hasAttribute('data-ac-source') && (intKeyCode === 13 || intKeyCode === 9 ) && ajsf.aeforms.suggestions.isVisible () && this.inputValidation())
				{
					$.aeforms.suggestions.selectCurrent () ;
					this.setValue('');
					this.inputValidation () ;
					if ( intKeyCode === 13 )
					{
						this.blur () ;
						ajsf.prevent(e);
					}
				}
			});
			input.onAutoCompleteUpdate = function ( success , data )
			{
				_(this).remClass('updating') ;
				if ( success )
				{
					$.aeforms.suggestions.show ( this , data['results'] ) ;
				} else {
					$.aeforms.suggestions.hide (  ) ;
				}
			} ;
			

			if ( input.hasAttribute('data-ac-target') )
			{
				e = _('#'+input.getAttribute('data-ac-target'));
				e.input = input ;
				e.addListener('click',function(){this.input.focus ();});
			}


			switch(input.getAttribute('data-field-type'))
			{
				case 'color-picker':
					new ajsf.forms.ColorPicker ( input );
					break;
			}
			
			
			

			if ( input.hasAt('data-upload') )
			{
				if ( ajsf.forms.UploadForm )
				{
					input.uploadForm = new ajsf.forms.UploadForm(input);
				}
				return;
			}

			
			// If we detect than the content is yet defined, we pre-validate it
			if ( input.value != input.title )
				input.inputValidation();
		},
		
		
		/**
		 * The ajaxize method let's automatically adapt a form with a serie of web 2.0 behaviors:
		 * - placeholder, required and pattern attributes are fully functional on all recent browsers
		 * - 
		 * 
		 */
		setupInputs: function ( object )
		{
			if ( object.isSetuped ) return false;
			
			object.isSetuped = true ;
			
			var inputs = [], e, t, msg ;
			
			// Get all labels 
			labels = _('label',object,false,true);
			
			for ( k in labels )
			{
				// Get label linked input type
				e = _('#'+(labels[k].getAt('for'))) ;
				t = e.type ;
				inputs.push(e) ;
				this.addAutoValidation(e);
				if ( e && e.on )
				{
					e.on ('change',function(){
						this.form.dispatch('change') ;
					});
				}
			}

			if ( ajsf.aejson )
			{
				_('[data-source-main]', object, false, true).forEach (function(e){
						var o = $.aejson.fromjson(e.innerHTML) ;
						if ( o )
						{
							e.html(o[0][e.getAt('data-source-main')]) ;
						}
						e.show () ;
				});
			}

			// Setting local vars
			var tid=object.getAt('id'), e, str='', k, t,p, labels ;
			
			object.on ('change',function(e){
				if (this.getAt('data-odd') !== 'odd' ) this.isModified = true ;
			});


			object.onsubmit = function () {
				return this.doSubmit();
			} ;


			if ( object.hasAt ("data-validation-message") )
			{
				msg = object.getAt ("data-validation-message") ;
			}
			
			
			
			object.doSubmit = function ( msg )
			{
				
				
				$.aeforms.suggestions.hide ();

				
				// Define some basic vars
				var k, elem, first, validated = true, o = {} , o2 ;

				// First append data
				if ( this.controller )
				{
					o2 = this.controller.flushAppendedData() ;
					for ( k in o2 )
					{
						o[k] = o2[k] ;
					}
				}
				
				// Loop on element to validate all
				for ( k in this.elements )
				{
					elem = _(this.elements[k]);
					if ( elem )
					{
						
						if( elem.getAttribute && elem.hasAt('id') && elem.getAt('type') != 'submit' && elem.toString() != '[object HTMLFieldSetElement]' )
						{
							if ( !first )
							{
								first= elem;
							}
							if ( elem.inputValidation && elem.inputValidation() == false )
							{
								validated = false ;
							} else if (elem.hasAttribute('data-odd') == false )
							{
								o[elem.getAttribute('id')] = elem.getValue() ;
							}
						}
					}
				}
				
				
				// Not validated
				if ( !validated )
				{
					if ( this._emptyMsgBox )
					{
						this._emptyMsgBox.show () ;
					} else if ( msg )
					{
						elem = $.create(null,'div','expanded notify error', msg );

						this._emptyMsgBox = elem ;
						
						e = _('.form-response',this, true,false);
						
						if (e)
						{
							e.empty () ;
							e.appendChild(elem);
						} else {
							this.appendChild(elem) ;
						}
					}
					
					this.isModified = false ;
					this.isValidated = false ;
					return false;
				}else if ( this._emptyMsgBox )
				{
					this.isValidated = true ;
					this._emptyMsgBox.hide () ;
				}
				
				if ( this.dispatch('beforeSubmit') )
				{
					if ( this.updateContainer )
					{
						this.isModified = false ;
						this.updateContainer.update ( this.ajaxAction , o , false , true ) ;
					} else if ( this.ajaxAction )
					{
						this.isModified = false ;
						this.action = this.ajaxAction ;
						this.submit () ;
						return true ;
					} else {
						this.isModified = false ;
						this.submit () ;
						return true ;
					}
				}

				// Disable all elements and build the ajax data object
				this.controller.disableAll () ;
				
				// Always return false, it's a convenient function that should never be called directly)
				return false ;
			};
			
			
			return inputs ;
		},
		
		
		/**
		 * The ajaxize method let's automatically adapt a form with a serie of web 2.0 behaviors:
		 * - placeholder, required and pattern attributes are fully functional on all recent browsers
		 * - 
		 * 
		 */
		ajaxize: function ( object , emptyMessage , updateContainer )
		{
			// Check if object is a not form, then return
			if ( !this.isForm(object) ) {
				return ;
			}
			
			if (object.ajaxAction != undefined )
			{
				return ;
			}
			
			if ( !object.controller )
			{
				new ajsf.forms.Form( object, false );
			}
			
			object = $.i(object);
			
			
			// Setup form to deactivate normal submission process
			object.ajaxAction = object.action ;
			object.setAttribute ('data-ajax-action', object.ajaxAction ) ;
			object.action = '#' ;
			object.isModified = false ;
			object.isValidated = false ;
			
			if (updateContainer != null )
			{
				object.updateContainer = updateContainer ;
			} else {
				object.updateContainer = object ;
			}
			
			

			ajsf.aeforms.setupInputs(object);
			
			
		}
	
		
};
	
	
	

$.registerInterface ( {
		
		/**
		 * Validate an input based on its HTML5 pattern attribute 
		 */
		inputValidation: function ()
		{
			// Final class to set
			var c='',e;
			
			if ( this.value && this.value == '' && this.title)
			{
				this.value = this.title;
			}

			// Required
			if ( this.hasAttribute('required') && this.getAttribute ('required') == 'required' )
			{
				c='valid';
				
				// In all cases, empty values or title values are not permitted
				if ( this.value == this.title )
				{
					c='invalid idle';
				} else
				// Has Regexp pattern for validation
				if ( this.hasAttribute('pattern') && this.getAttribute('pattern') != ''
					&& $.validate(this.getAttribute('pattern'),this.value) == false )
				{
					c = 'invalid' ;
				} else if ( this.value == '' )
				{
					c = 'invalid' ;
				}
			// Not required
			} else {
				if ( this.value == this.title )
				{
					c='idle';
				} else 
					// Has Regexp pattern for validation
				if ( this.hasAttribute('pattern') && this.getAttribute('pattern') != ''
						&& $.validate(this.getAttribute('pattern'),this.value) == false )
				{
					c = 'invalid' ;
				} else {
					c='valid';
				}
			}
			
			e = _('#errors_' + this.getAttribute('id'),false, false, false);
			if ( e )
			{
				if ( c.indexOf('invalid')>-1 && this.hasAttribute('data-error') )
				{
					e.show ();
					e.innerHTML = this.getAttribute('data-error');
				} else if(e.hide)
				{
					e.hide ();
				}
			}
			
			e = _('#' + this.getAttribute('id') + '/display');
			
			if ( e && e.setClass )
			{
				e.remClass('idle','invalid','valid');
				e.addClass(c);
			}
			
			this.remClass('idle','invalid','valid');
			this.addClass(c);
			
			this.dispatch('validation');
			
			return c.indexOf('invalid')==-1 ;
		},
		
		getValue: function ()
		{
			if ( this.checked )
			{
				return (this.checked ? 'true' : 'false' ) ;
			}
			
			if ( this.value !== undefined )
			{
				return (this.hasAttribute('placeholder') && this.value == this.getAttribute('placeholder') ? '' : this.value ) ;
			}
			
			return '' ;
		},
		
		setValue: function ( value )
		{	
			this.value = value ;
			this.inputValidation();
			this.form.isModified = true ;
			return this ;
		}
} );

_(window).addListener ('resize', $.delegate($.aeforms.suggestions,'_windowResizeHandler')) ;
	
}() ); 
