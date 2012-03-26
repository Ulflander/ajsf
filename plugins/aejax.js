
/**********************************
 * AJSF - Aenoa Javascript Framework
 * (c) Xavier Laumonier 2010-2011
 *
 * Since : 
 * Author : Xavier Laumonier
 *
 **********************************/

/**
 * 
 * 
 */
(function (){

    if ( !ajsf )
    {
	ajsf = {} ;
    }

    /**
	 * Requires JSON plugin to decode server responses
	 */
    if ( !ajsf.aejson )
    {
	ajsf.load ( 'aejson' ) ;
    }
	

    /**
	 * Ajax methods available for selected elements using _() function or ajsf.get() method.
	 */
    ajsf.registerInterface ({
		
	getLastUpdateURL: function ()
	{
	    return this._lastAjaxUpdate ;
	},
		
	/**
		 * Update the content of the element
		 * 
		 * @param URL [string] URL of the content to retrieve
		 * @param parameters [object] A list of parameters to send to the URL
		 * @param append [boolean] True to append content, false to replace content. Default to false (replace content)
		 * @param post [boolean] True to set POST mode, false to set GET mode. Default to false (GET mode)
		 * @param post [boolean] True to set AENOA mode (aenoa server formatted parameters), false to set NORMAL (parameters passed as key=>value) mode. Default to false (normal mode)
		 * @return Current instance for chained commands on this element
		 */
	update: function ( URL, parameters , append , post , aenoa , dispatchGlobal ) {
	    
	    ajsf.aejax.setLastUpdateContainer ( this ) ;

	    ajsf.aejax.setLastUpdateURL ( URL ) ;
		
	    this._lastAjaxUpdate = URL ;
	    this.__aejax = new Aejax ( URL ) ;
	    this.__aejax.postMode = (post !== true ? false : true ) ;
	    this.__aejax.aenoaMode = (aenoa !== true ? false : true ) ;
	    this.__append = (append === true ? true : false ) ;
	    for ( var k in parameters )
		this.__aejax.addData ( k , parameters[k] ) ;
			
	    this.__aejax.onEnd = ajsf.delegate(this , function () {
		var s = this.__aejax.getStringResponse () ;
				
				
				
		if ( this.__append )
		{
		    this.innerHTML = this.innerHTML + s ;
		} else {
		    this.innerHTML = s ;
		}
				
		if ( s && s.indexOf('<script') )
		{
		    try{
			_('script',this,false,true).forEach(function(e){
			    eval(e.innerHTML);
			});
		    } catch(e) {};
		}
				
		if ( is(ajsf.aejax.globalCallback,"function") )
		{
		    ajsf.aejax.globalCallback(_(this));
		}
				
		if ( this.onUpdate )
		{
		    this.onUpdate ( this , s ) ;
		}
				
		this.dispatch('ajaxUpdate') ;
				
				
	    //	this.fadeIn () ;
	    }) ;
			
	    if ( dispatchGlobal === false || _d.dispatch('beforeAjaxUpdate') )
	    {
		this.__aejax.connect () ;
		return true ;
	    }
				
	    return false ;
	},
		
	updateSimple: function ( URL )
	{
	    this.__aejax = new Aejax ( URL ) ;
	    this.__aejax.postMode = false ;
	    this.__aejax.aenoaMode = true ;
	    this.__aejax.sendAenoaHeaders = true ;
			
	    this.__aejax.onEnd = ajsf.delegate(this , function () {
		var s = this.__aejax.getStringResponse () ;
		this.innerHTML = s ;
				
		if ( s && s.indexOf('<script') )
		{
		    try{
			_('script',this,false,true).forEach(function(e){
			    eval(e.innerHTML);
			});
		    } catch(e) {};
		}
			
				
		if ( this.onUpdate )
		{
		    this.onUpdate ( this , s ) ;
		}
				
		this.dispatch('ajaxUpdate') ;
				
	    }) ;
			
	    this.__aejax.connect () ;
	},
		
	reupdate: function ()
	{
			
	    if ( this.__aejax )
	    {
		if ( !_d.dispatch('beforeAjaxReupdate') )
		{
		    return ;
		}
				
		this.__aejax.connect();
	    }
	}
    }) ;

    /**
	 * Core Aejax class
	 * @param gatewayURL [string] The URL to the gateway
	 */
    var Aejax = ajsf.Class.extend({
		
		
	construct: function ( gatewayURL )
	{
	    
	    
	    this.aenoaMode = true ;
			
	    this.postMode = false ;
			
	    this.sendAenoaHeaders = true ;
			
	    this.xhr = null ;
			
	    /**
			 * Response as string
			 * @private
			 */
	    this._sr = null ;
			
	    /**
			 * Response as JSON
			 * @private
			 */
	    this._js = null ;
	    
	    this._gateway = gatewayURL ;
			
	    this._service = null ;
			
	    this._success = false ;
			
	    this.onEnd = null ;
			
	    this.mode = "update" ;
			
	    /**
			 * Data to send
			 * @private
			 */
	    this._d = null ;
	}, 
		
		
	connect: function ()
	{
	    this._aexhr () ;
	    
			
	    var parameters = "" ;
			
	    if ( this.xhr == null )
	    {
		return ;
	    }

	    if ( this.aenoaMode )
	    {
		parameters = "protocol=AenoaServerProtocol&service="+this._service+"&data="+this._getFormattedData() ;
	    } else {
		parameters = this._getFormattedData();
	    }
			
	    if ( this.postMode == false )
	    {
		this.xhr.open("GET",(parameters == '' ? this._gateway : this._gateway + "?" + parameters), true );
		this.xhr.onreadystatechange = ajsf.delegate(this,"_onChange") ;
		
		if(this.sendAenoaHeaders)
		{
		    this.srh("Aenoa-Ajax-Connection", "true");
		}
		
		this._addAejaxHeaders () ;
				
		if ( !b.Chrome )
		{
		    this.srh("Origin", ajsf.URL);
		}

		this.xhr.send('') ;
	    } else {
		this.xhr.open("POST",this._gateway , true);
		this.xhr.onreadystatechange = ajsf.delegate(this,"_onChange") ;
		this.srh("Content-type", "application/x-www-form-urlencoded");
		
		if ( b.Chrome == false )
		{
		    this.srh("Connection", "close");
		}

		if(this.sendAenoaHeaders)
		{
		    this.srh("Aenoa-Ajax-Connection", "true");
		}
		this._addAejaxHeaders () ;
		this.xhr.send(parameters) ;
	    }
			
			
	    try {
				
		_d.dispatch('ajaxLoadStart');
				
	    } catch (e) {}
			
	    this._d = {} ;
				
	},
		
		
	_addAejaxHeaders: function ()
	{
	    var h = ajsf.aejax.getNextRequestHeaders(), k ;
	    for ( k in h )
		this.srh(k, h[k] ) ;
	},
		
	_onChange: function (e)
	{
	    if (this.xhr.readyState == 4) {
				

		_d.dispatch('ajaxLoadEnd');
		
		try {
		    this._sr = this.xhr.responseText ;
		} catch (e) {} ;

				
		var s = this.xhr.status ;
		if ( s != 301 && s != 404 && this._r != null)
		{
		    this._success = true ;
		}
		if ( this.aenoaMode )
		{
		    this._js = ajsf.aejson.fromjson ( this._sr ) ;
					
		    this._success = this._js['success']?this._js['success'] : false ;
					
		    if ( _('#__SESS_ID') )
			_('#__SESS_ID').value = this._js['sid'] ;
		}
				
		if ( this.xhr.getResponseHeader('X-AeServer-redirection') )
		{
		    ajsf.redirect ( this.xhr.getResponseHeader('X-AeServer-redirection') ) ;
		}
				
		if ( is(this.onEnd,"function") )
		{
		    this.onEnd (this._success,(this.aenoaMode ? this._js['data'] : this._sr ) ) ;
		}
	    }
	},
		
	addData: function (k,v)
	{
	    if ( this._d== null ) {
		this._d = {} ;	    
	} ;
	this._d[k]=v ;
    },
		
    _getFormattedData: function ()
    {
	if ( this.aenoaMode )
	{
	    return ajsf.aejson.tojson(this._d);
	}
	var str = [] , k ;
	for ( k in this._d )
	{
	    str.push( k + '=' + encodeURIComponent(this._d[k]).split("&").join("\\u0026") ) ;
	}
	return str.join('&') ;
    },
		
    srh: function (k,v) {
	this.xhr.setRequestHeader(k,v) ;
    },
		
    setService: function ( service )
    {
	this._service = service ;
    },
		
    hasResponded: function ()
    {
	return this.xhr != null && this.xhr.readyState == 4 ;
    },
		
    isSuccess: function ()
    {
	return this.hasResponded() && this._success ;
    },
		
    getJSONResponse: function ()
    {
	return this._js;
    },
		
    getStringResponse: function ()
    {
	return this._sr ;
    },
		
    _aexhr: function () {
	this.xhr = null;
			
	if(ajsf.isIE) {
	    try {
		this.xhr = new ActiveXObject("Msxml2.XMLHTTP.4.0");
	    }
	    catch(e){
		try {
		    this.xhr = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
		    this.xhr = new ActiveXObject("Microsoft.XMLHTTP");
		}
	    }
	} else {
	    this.xhr = new XMLHttpRequest();
	}
    }
		
    });
	
ajsf.Aejax = Aejax;

ajsf.aejax = {
		
    _nextReqH: [],
		
    getNextRequestHeaders: function ()
    {
	return this._nextReqH ;
    },
		
    flushNextRequestHeaders: function ()
    {
	this._nextReqH = [];
    },
		
    addHeaderToNextRequest: function ( header , content , overwrite ) 
    {
	overwrite =  ( overwrite === false ? false : true ) ;
			
	if ( !this._nextReqH[header] || overwrite )
	{
	    this._nextReqH[header] = content ;
	}
    },
		
    request: function ( gatewayURL , service , parameters , onDoneCallback , postMode, aenoaMode )
    {
	var a = new Aejax ( gatewayURL ) ;
	a.setService ( service ) ;
	for ( var k in parameters )
	    a.addData ( k , parameters[k] ) ;
	a.onEnd = onDoneCallback ;
	a.postMode = postMode ? postMode : false ;
	a.aenoaMode = aenoaMode ? aenoaMode : false ;
	a.sendAenoaHeaders = a.aenoaMode ;
	a.connect () ;
				
	return a ;
    },
		
    /*
	Function: getJSON
		
		    
    */
    getJSON: function ( URL , callback )
    {
	ajsf.load('aejson') ;
	ajsf.ready(function(){
	    var a = new Aejax ( URL ) ;
			
	    a.onEnd = function ( success , data )
	    {
		callback ( ajsf.aejson.fromjson(data) ) ; 
	    } ;
			
	    a.postMode = true ;
	    a.aenoaMode = false;
	    a.sendAenoaHeaders = true ;
	    a.connect () ;
	});
    },
		
		
    _lastUpCtn: null,
		
    _lastUpURL: '',
		
    setLastUpdateContainer: function ( obj )
    {
	this._lastUpCtn = obj ;
    },
    getLastUpdateContainer: function ( )
    {
	return this._lastUpCtn ;
    },
		
    setLastUpdateURL: function ( url )
    {
	this._lastUpURL = url ;
    },

    getLastUpdateURL: function ()
    {
	return this._lastUpURL ;
    },
		
		
    globalCallback: null,
		
    detail: function (source, title, element)
    {
	if ( !this.detailManager && ajsf.popup )
	{
	    this.detailManager = ajsf.popup.detail ;
	}
			
	if ( this.detailManager && is(this.detailManager.onLoadDetails,"function" ) )
	{
	    this.detailManager.beforeLoadDetails(title,element);
	    var a = new Aejax ( ajsf.URL + 'api' ) ;
	    a.setService ( 'core::Data::getOneAndChilds' ) ;
	    a.addData ( 'source' , source ) ;
	    a.addData ( 'keysAsLabel' , true ) ;
	    a.onEnd = ajsf.delegate ( this.detailManager, "onLoadDetails" ) ;
	    a.postMode = true ;
	    a.aenoaMode = true ;
	    a.connect () ;
					
	    return a ;
	} 
			
	throw "You have to set a detail manager to use aejax Aenoa Data detail service" ;
			
	return false ;
    },
	    
    detailManager: null,
	    
    detailToHTMLList: function ( data , separator , prefix , suffix )
    {
	var str = '<ul>' ;
	
	separator = (separator ? separator : ':');
	prefix = (prefix ? prefix : '' );
	suffix = (suffix ? suffix : '' );
	    	
	for ( var k in data )
	{
	    if(is(data[k],'object')) 
	    {
		data[k] = this.detailToHTMLList ( data[k] , separator , prefix , suffix );
		str+= '<li>' + k + separator + data[k] + '</li>' ;
	    } else {
		str+= '<li>' + k + separator + prefix + data[k] + suffix + '</li>' ;
	    }
	    		
	}
	    	
	return str += '</ul>' ;
    },
	    

    /**
	    * Returns length of strings/arrays etc
	    *
	    * @param string input Input to parse
	    *
	    */
    _getLength: function(input)
    {
	input = input.substring(2);
	var length = Number(input.substr(0, input.indexOf(':')));
	return length;
    }


};
	
})(); 

