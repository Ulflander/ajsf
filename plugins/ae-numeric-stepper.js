

/**********************************
 * AJSF - Aenoa Javascript Framework
 * (c) Xavier Laumonier 2010-2011
 *
 * Since : 1.0
 * Author : Xavier Laumonier
 *
 **********************************/

(function(){

	/*
		ajsf.AeNumericStepper
		
		Creates a numeric stepper
	*/
	 
	ajsf.AeNumericStepper = ajsf.AbstractEvtDispatcher.extend({
		
		/*
			Constructor: construct
		
			Creates a new string generator instance
		
			Parameters:
				options - [object] A bunch of options
			
			Available options:
				- minVal => The minimum value
				- maxVal => The maximum value
		*/
		construct: function ( options ) {

			this._minVal = 15 ;
			
			this._maxVal = 30 ;
			
			this._buttonTop = null ;
			this._buttonBottom = null ;
			this._input = null ;
			this._w = 20 ;
			this._ltr = ajsf.ltr ;
			
			ajsf.expandOptionsToClass(this, options);
			
			this.build () ;

			this._previous = this.getValue () ;
			
		},
		
		
		/*
			Function: build
			
			Actually build the stepper depending on options
			
			Returns:
			Current instance for chained commands on this element
		 */
		build: function ()
		{
			if ( !this._container )
			{
				return;
			}
			this._container.empty () ;

			if ( !this._input )
			{
				this._input = ajsf.create(null,'input')
									.setAt('type','text')
									.setAt('value',this._minVal)
									.w(this._w) ;
				this._input.on ( 'change', ajsf.delegate(this,'getValue') ) ;
				this._input.on ( 'blur', ajsf.delegate(this,'getValue') ) ;
				
			}
			if ( this._ltr )
			{
				this._container.append(this._input);
			}
			
			if ( !this._buttonBottom )
			{
				this._buttonBottom = this._getButton('-','decrease');
			}
			this._container.append(this._buttonBottom);
			if ( !this._buttonTop )
			{
				this._buttonTop = this._getButton('+','increase');
			}
			this._container.append(this._buttonTop);
			
			
			if ( !this._ltr )
			{
				this._container.append(this._input);
			}
			
		},
		
		/*
			Function: decrease
			
			Decrease the numeric stepper current value (-1)
			
			Returns:
			The new value of the numeric stepper
		 */
		increase: function (e)
		{
			ajsf.prevent(e);
			return this.setValue(this.getValue()+1);
		},
		
		/*
			Function: decrease
			
			Decrease the numeric stepper current value (-1)
			
			Returns:
			The new value of the numeric stepper
		 */
		decrease: function (e)
		{
			ajsf.prevent(e);
			return this.setValue(this.getValue()-1);
		},
		
		/*
			Function: destroy
			
			Destroys the numeric stepper instance
			
			Returns:
			Current instance for chained commands on this element
		 */
		destroy: function ()
		{
			this._container.empty();
			this._container = null ;
			this._buttonBottom = null ;
			this._buttonTop = null ;
			this._input = null ;
		},

		/*
			Function: getShownValue
			
			Get the current string value including leading zero(s) of the given int value, or of the current numeric stepper value
			
			Parameters:
				val - [int] The value to transform to string (optional)
			
			Returns:
			[string] The current value of the numeric stepper
		 */
		getShownValue: function ( val )
		{
			if ( val )
			{
				val = parseInt(val);
			} else {
				val = this.checkValue(
						parseInt(
							this._input.getValue().replace(/([^0-9])/g,'').replace(/^0/g,'')
						)
					);
			}
			var i, fin = ''+val;
			if ( this._leadingZero > 0 )
			{
				for (var i=this._leadingZero; i>0;i--)
				{
					if ( val < Math.pow(10,i) )
					{
						fin = '0'+val;
					}
				}
			}
			return fin ;
		},
		
		/*
			Function: setValue
			
			Set the value of the numeric stepper
			
			Parameters:
				val - [int] The new value of the numeric stepper
				
				
		 */
		setValue: function ( val )
		{
			this._input.setValue(this.getShownValue(this.checkValue(val)));


			if ( this._previous != val )
			{
				this._previous = val ;
				this.dispatch('change');
			}
			
			return this ;
		},
		
		/*
			Function: getValue
			
			Get the actual value of the numeric stepper
			
			Returns:
			[int] The current value of the numeric stepper
		 */
		getValue: function ()
		{
			var val = this._minVal ;
			
			if(this._input)
			{
				val = this.checkValue(
							parseInt(
								this._input.getValue().replace(/([^0-9])/g,'').replace(/^0/g,'')
							)
						);
				this._input.setValue(this.getShownValue(val));
			}
			
			
			return val ;
		},
		
		/*
			Function: checkValue
			
			Check the value depending of max and min values, and return a valid value
			
			Parameters:
				val - [int] Value to test
				
			Returns:
			A valid value
		 */
		checkValue: function ( val )
		{
			val = parseInt(val);
			
			if(isNaN(val))
			{
				val = this._minVal ;
			} else if ( val <= this._minVal )
			{
				val = this._minVal ;
			} else if ( val >= this._maxVal )
			{
				val = this._maxVal ;
			}
			
			return val ;
		},
		
		/*
			Function: setContainer
			
			Set the parent container of the Numeric Stepper
			
			Parameters:
				container - The parent container of the Numeric Stepper
			
			Returns:
			Current instance for chained commands on this element
		*/
		setContainer: function ( container )
		{
			this._container = container ;
			return this ;
		},
	
		/*
			Function: getContainer
			
			Get the parent container of the Numeric Stepper
			
			Returns:
			The parent container of the Numeric Stepper
		*/
		getContainer: function ()
		{
			return this._container ;
		},

		/*
			Function: setMinVal
			
			Set the minimum value in the Numeric Stepper
			
			Parameters:
				minVal - The minimum value in the Numeric Stepper
			
			Returns:
			Current instance for chained commands on this element
		*/
		setMinVal: function ( minVal )
		{
			this._minVal = minVal ;
			return this ;
		},
	
		/*
			Function: getMinVal
			
			Get the minimum value in the Numeric Stepper
			
			Returns:
			The minimum value in the Numeric Stepper
		*/
		getMinVal: function ()
		{
			return this._minVal ;
		},
	
	
		/*
			Function: setMaxVal
			
			Set the maximum value in the Numeric Stepper
			
			Parameters:
				maxVal - The maximum value in the Numeric Stepper
			
			Returns:
			Current instance for chained commands on this element
		*/
		setMaxVal: function ( maxVal )
		{
			this._maxVal = maxVal ;
			return this ;
		},
	
		/*
			Function: getMaxVal
			
			Get the maximum value in the Numeric Stepper
			
			Returns:
			The maximum value in the Numeric Stepper
		*/
		getMaxVal: function ()
		{
			return this._maxVal ;
		},
		/*
			Function: setLeadingZero
			
			Set total of leading zero(s) to add before number in numeric stepper
			
			Parameters:
				leadingZero - [int] Total of leading zero(s) to add before number in numeric stepper
			
			Returns:
			Current instance for chained commands on this element
		*/
		setLeadingZero: function ( leadingZero )
		{
			if ( leadingZero < 0 ) leadingZero = 0 ;
			this._leadingZero = leadingZero ;
			return this ;
		},
	
		/*
			Function: getLeadingZero
			
			Get total of leading zero(s) to add before number in numeric stepper
			
			Returns:
			Total of leading zero(s) to add before number in numeric stepper
		*/
		getLeadingZero: function ()
		{
			return this._leadingZero ;
		},
		/*
			Function: setLTR
			
			Set LTR mode or RTL mode (
			
			Parameters:
				ltr - [boolean] True for LTR mode or false for RTL mode
			
			Returns:
			Current instance for chained commands on this element
		*/
		setLTR: function ( ltr )
		{
			this._ltr = ltr ;
			return this ;
		},
	
		/*
			Function: getLTR
			
			Get LTR mode or RTL mode
			
			Returns:
			True for LTR mode or false for RTL mode
		*/
		getLTR: function ()
		{
			return this._ltr ;
		},

		
		_getButton: function ( label , callback )
		{
			return ajsf.create(null,'a')
				.html(label)
				.setAt('href','#')
				.stylize('cursor','pointer')
				.on ('click', ajsf.delegate(this,callback))
				.avoidTextSelection () ;
		},
		
		_setWidth: function ()
		{
			if ( this._maxVal < 10 && this._minVal > -10 )
			{
				this._w = 10 ;
			} else if ( this._maxVal < 100 && this._minVal > -100 )
			{
				this._w = 20 ;
			} else if ( this._maxVal < 10 && this._minVal > -10 )
			{
				this._w = 30 ;
			}
			
			if ( this._input )
			{
				this._input.stylize('width',this._w);
			}
		}
		
		
	});
	
	
})() ;
