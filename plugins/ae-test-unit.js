(function(){
    /*
	    Class: ajsf.AeTestUnit

	    Used to make test unit on Javascript code
    */
    ajsf.AeTestUnit = ajsf.Class.extend({
	/*
	    Constructor: construct
	
	    Creates AeTestUnit instance, initializes errors array
	 */
	construct: function ()
	{
	    this.errors = [] ;
	},
	
	/*
	    Function: getErrors
	
	    Return the array of errors
	
	    Returns:
	    An array of errors, can be empty
	 */
	getErrors: function ()
	{
	    return this.errors ;
	},
	
	/*
	    Function: hasError
	
	    Returns true if previous unit test cases returned errors
	
	    Returns:
	    True if test unit has errors, false otherwise
	 */
	hasError: function ()
	{
	    return this.errors.length > 0 ;
	},
	
	/*
	    Function: reinit
	
	    Empty the error array
	 */
	reinit: function ()
	{
	    this.errors = [] ;
	},
	
	/*
	    Function: destroy
	
	    Destroys the AeUnitTest instance
	 */
	destroy: function ()
	{
	    this.errors = null ;
	},
		
	/*
	    Function: assertTrue
	
	    Assert that a value is strictly equal to true, otherwise add an error message 
	 */
	assertTrue: function ( value, message )
	{
	    if ( value !== true )
	    {
		this.errors.push(message); 
	    }
	},	
	assertFalse: function ( value, message )
	{
	    if ( value !== false )
	    {
		this.errors.push(message); 
	    }
	},
		
	assertStrictEq: function ( value , compare , message )
	{
	    if ( value !== compare )
	    {
		this.errors.push(message); 
	    }
	},
		
	assertStrictUneq: function ( value , compare , message )
	{
	    if ( value === compare )
	    {
		this.errors.push(message); 
	    }
	},
		
	assertEq: function ( value , compare , message )
	{
	    if ( value == compare )
	    {
		this.errors.push(message); 
	    }
	},
		
	assertUneq: function ( value , compare , message )
	{
	    if ( value != compare )
	    {
		this.errors.push(message); 
	    }
	},
	
	assertDeepEq: function ( obj1, obj2 , message )
	{
	    var res = true, k ;
	    
	    for ( k in obj1 )
	    {
		try {
		    
		    res = res && obj2[k] == obj1[k] ;
		} catch ( e )
		{}
	    }
	    
	    return res ;
	},
	
	assertNotThrow: function ( func , message )
	{
	    throw {
		func () ;
	    } catch(e)
	    {
		this.errors.push(message);
	    }
	},
	
	assertThrow: function ( func , message )
	{
	    throw {
		func () ;
		this.errors.push(message);
	    } catch(e)
	    {
	    }
	}
	
	
    }) ;
})();
