
/**********************************
 * AJSF - Aenoa Javascript Framework
 * (c) Xavier Laumonier 2010-2011
 *
 * Since : 
 * Author : Xavier Laumonier
 *
 **********************************/


(function (){
	
    $.aejson = {
			
	/*
		Funcion= tojson
	
		Parameters:
			o
		 
		Returns:
	*/
	tojson:function(o)
	{
	    if (typeof(JSON) == 'object' && JSON.stringify)
	    {
		return JSON.stringify(o).replace("&","\\u0026");
	    }
       
	    var type = typeof(o);
    
	    if (o === null)
		return "null";
    
	    if (type == "undefined")
		return undefined;
        
	    if (type == "number" || type == "boolean")
		return o + "";
    
	    if (type == "string")
		return this._escape(o);
    
	    if (type == 'object')
	    {
		if (typeof o.tojson == "function") 
		{
		    return this.tojson( o.toJSON() );
		}
		if (o.constructor === Date)
		{
		    var month = o.getUTCMonth() + 1;
		    if (month < 10) month = '0' + month;

		    var day = o.getUTCDate();
		    if (day < 10) day = '0' + day;

		    var year = o.getUTCFullYear();
                
		    var hours = o.getUTCHours();
		    if (hours < 10) hours = '0' + hours;
                
		    var minutes = o.getUTCMinutes();
		    if (minutes < 10) minutes = '0' + minutes;
                
		    var seconds = o.getUTCSeconds();
		    if (seconds < 10) seconds = '0' + seconds;
                
		    var milli = o.getUTCMilliseconds();
		    if (milli < 100) milli = '0' + milli;
		    if (milli < 10) milli = '0' + milli;

		    return '"' + year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds + '.' + milli + 'Z"'; 
		}

		if (o.constructor === Array) 
		{
		    var ret = [];
		    for (var i = 0; i < o.length; i++)
			ret.push( this.tojson(o[i]) || "null" );

		    return "[" + ret.join(",") + "]";
		}
        
		var pairs = [];
		for (var k in o) {
		    var name;
		    var type = typeof k;

		    if (type == "number")
		    {
			name = '"' + k + '"';
		    }
		    else if (type == "string")
		    {
			name = this._escape(k);
		    } else {
			continue;  //skip non-string or number keys
		    }
		    if (typeof o[k] == "function")
		    {
			continue;
		    }
		    var val = this.tojson(o[k]);
            
		    pairs.push(name + ":" + val);
		}
		var str = "{" + pairs.join(", ") + "}" ;
		return str;
	    }
        
	    return "null";
	},
	/*
		Function: _escape
	
		Parameters:
			string
			
		Returns:
	
		Private
	*/
	_escape: function(string)
	{
	    return '"'+encodeURIComponent(string)+'"';
	},
	/*
    	Function: fromjson
    
    	Parameters:
    		str
    	 
    	Returns:
    
    */
	fromjson: function (str)
	{
	    try {
		return JSON.parse (str) ;
	    } catch (e)
	    {
		try {
		    return eval("("+str+")");
		} catch (e) { }
	    }
	    return false ;
	}
		
    };


}() ); 