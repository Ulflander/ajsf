

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
		ajsf.AeMailProtector
		
		This little class let you prevent an email address to be visible as is in code
	*/ 
	 
	ajsf.AeMailProtector = ajsf.Class.extend({
		
		/*
			Constructor: construct
		
			Creates a new string generator instance
		
			Parameters:
				options - [object] A bunch of options
			
			Available options:
				- link => The element that will open mail application on click
				- address => The email address as an array
		*/
		construct: function ( options ) {

			this._link = null ;
			
			this._address = null ;
			
			this._delegation = ajsf.delegate ( this, '_mailto' ) ;
			
			ajsf.expandOptionsToClass(this, options);
		},
		
		_mailto: function (e)
		{
		    this._link.href='mailto:'+this._address[0]+'@'+this._address[1]+'.'+this._address[2] ;
		},
		
		
		/*
		 	Function: setLength
		 	
		 	Set the element that will open mail application on click
		 	
		 	Parameters:
		 		link - [HTMLElement] The element that will open mail application on click
		 	
		 	Returns:
			Current instance for chained commands on this element
		 */
		setLink: function ( link )
		{
		    
			if ( this._link )
			{
			    this._link.remListener('click', this._delegation) ;
			}
			
			this._link = link ;
			
			if ( link )
			{
			    this._link.href='#' ;
			    this._link.on('click', this._delegation) ;
			}
			
			return this;
		},

		/*
		 	Function: getLink
		 	
		 	Get the element that will open mail application on click
		 	
		 	Returns:
			HTML element
		 */
		getLink: function ( )
		{
			return this._length ;
		},
		
		/*
		 	Function: setAddress
		 	
		 	Set the email address. Email address must be an array containing :
			- 0: email person
			- 1: email domain without extension
			- 2: domain extension
		 	
			Example:
			> var addr = [
			>    'somebody',
			>    'example',
			>    'com'
			> ];
			> // Will produce the email address : somebody@example.com
			
		 	Parameters:
		 		address - [Array] The address
		 	
		 	Returns:
			Current instance for chained commands on this element
		 */
		setAddress: function ( address )
		{
			
			this._address = address ;
			
			return this;
		},

		/*
		 	Function: getAddress
		 	
		 	Get the element that will open mail application on click
		 	
		 	Returns:
			HTML element
		 */
		getAddress: function ( )
		{
			return this._address ;
		},
		
		/*
			Function: destroy
			
			Destroy the current instance
		 */
		destroy: function ()
		{
			this.setLink(null);
		}
		
		
		
	});
	
	
})() ;
