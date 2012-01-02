

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
		Class: ajsf.AeStringGenerator
		
		This plugin is part of Aenoa Auto Plugins.
	*/
	 
	ajsf.AeStringGenerator = ajsf.Class.extend({
		
		/*
			Constructor: construct
		
			Creates a new string generator instance
		
			Parameters:
				options - [object] A bunch of options
			
			Available options:
				- length => The length of the generated string
				- input => The input associated with the string generator. This input will be updated each time a new string is generated.
		*/
		construct: function ( options ) {

			this._length = 15 ;
			
			this._input = null ;
			
			this._button = null ;
			
			this._current = '' ;
			
			ajsf.expandOptionsToClass(this, options);
		},
		
		
		/*
		 	Function: setLength
		 	
		 	Set the length of the random generated string. Default length is 15 characters.
		 	
		 	Parameters:
		 		length - [int] The required length
		 	
		 	Returns:
			Current instance for chained commands on this element
		 */
		setLength: function ( length )
		{
			this._length = parseInt(length) ;
		},

		/*
		 	Function: getLength
		 	
		 	The length of the random generated string
		 	
		 	Returns:
			Length of the random generated string
		 */
		getLength: function ( )
		{
			return this._length ;
		},
		
		/*
			Function: destroy
			
			Destroy the current instance
		 */
		destroy: function ()
		{
			this.setInput(null);
		},
		
		
		/*
		 	Function: setInput
		 	
		 	Set the input element associated with the string generator
		 	
		 	Parameters:
		 		input - [HTMLInputElement] the input element to fill with generated strings
		 	
		 	Returns:
			Current instance for chained commands on this element
		 */
		setInput: function ( input )
		{
			if ( this._input != null )
			{
				this._input = null ;
				
				this._button.destroy () ;
				
				this._button = null ;
			}
			
			this._input = input ;
			
			if ( !this._input )
			{
				return this ;
			}
			
			var button = ajsf.create( null, 'a', 'icon16 reload unlabeled', '&nbsp;&nbsp;'),
				instance = this ;
			
			button.on('click',function (e){
				ajsf.prevent(e);
				instance.regenerate() ;
			});
			
			button.setAt('href','#');
			
			this._button = button ;
			
			this._input.getParent().insertBefore(button,this._input);
			
			if ( this._input.getValue() == '' )
			{
				this.regenerate () ;
			}
			
			return this;
		},

		/*
		 	Function: getInput
		 	
			Returns the input element associated with the string generator
		 	
		 	Returns:
			The input element associated with the string generator
		 */
		getInput: function ( )
		{
			return this._input ;
		},
		
		/*
			Function: regenerate
		
			Create a new random string and set as value in the associated input
		
			Parameters:
				length - [int] Default is class property length
		
			Returns:
			Current instance for chained commands on this element
		*/
		regenerate: function ( )
		{

			var len = this._length || 15,
				chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
				l = chars.length,
				i = 0,
				str = '' ;
			
			for ( i ; i < len ; i++ )
			{
				str += chars[Math.floor(Math.random() * l)];
			}
			
			this._current = str ;
			
			if ( this._input && is(this._input.setValue, 'function' ) )
			{
				this._input.setValue(str) ;
			}
			
			return str;
		},
		
		/*
		 	Function: getCurrent
		 	
		 	Returns the last generated string
		 	
		 	Returns:
		 	The last generated string
		 */
		getCurrent: function ()
		{
			return this._current ;
		}
		
		
	});
	
	
})() ;
