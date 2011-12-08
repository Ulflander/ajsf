
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
	
    ajsf.address = {
		
	hidePopupOnChange: true,
			
	prependToTitle: '' ,
		
	titleSeparator: ' | ' ,
		
	_trackers: [] ,
		
	_urlMapping: [] ,
		
	_current: '',
		
	currentURL: '',
		
	_history: [],
		
	initialize: function ()
	{
		    
		    
	    this.prependToTitle = _d.title ;
	    
	    this._update() ;
		
	    _(window).addListener ( 'hashchange' , ajsf.delegate ( this , '_update' ) ) ;
	},
		
	gotoPrevious: function ()
	{
	    history.go(-1);
	},
		
	gotoNext: function ()
	{
	    history.go(1);
	},
		
	_update: function (e)
	{
	    this.currentURL = window.location ;
	    
	    this._current = window.location.hash.substring(1) ;
	    
	    this._history.push( this._current ) ;
			
	    if ( this.hidePopupOnChange && ajsf.popup )
	    {
		ajsf.popup.destroyAll () ;
	    }
			
	    var main = this.getCurrentHashAtIndex(0) ;
			
	    if ( main == '!' )
	    {
		this._current = this._current.slice(2, this._current.length );
		main = this.getCurrentHashAtIndex(0) ;
	    }
			
	    if ( main != null && this._urlMapping[main] != null )
	    {
		this._callMappedFunction(main);
	    } else if ( this._urlMapping['index'] )
{
		this._callMappedFunction('index');
	    }
	},
		
	reupdate: function ()
	{
	    this._update(null);
	},
		
	setHash: function ( hash )
	{
	    window.location.hash = '#!/' + hash ;
	},
		
	/*
		 * This method works only for main hash, sub hashs have to be managed manually
		 */
	mapHashToFunction: function ( hash , method , title , doTrack )
	{
	    if ( is(method,'function') )
	    {
		this._urlMapping[hash] = {
		    method: method, 
		    title: (title ? title : '' ), 
		    doTrack: (doTrack ? true : false )
		} ;
		return true ;
	    }
	    return false ;
	},
		
	/*
		 * This method works only for main hash, sub hashs have to be managed manually
		 */
	unmapHashToFunction: function ( hash , method , title )
	{
	    this._urlMapping[hash] = null ;
	},
		
		
	_callMappedFunction: function ( index )
	{
	    this._urlMapping[index]['method'] ( this._current ) ;
	    this.setTitle(this._urlMapping[index]['title']); 
	},
		
	getCurrentHash: function ()
	{
	    return this._current ;
	},
		
	getCurrentHashAtIndex: function ( index )
	{
	    var a = this._current.split('/');
	    if ( a.length > index )
	    {
		return a[index];
	    }
	    return null ;
	},
		
	getCurrentHashFromIndex: function ( index )
	{
	    var a = this._current.split('/');
	    a.splice(0,index);
	    return a.join('/') ;
	},
			
	setTitle: function ( title )
	{
	    if ( title != null )
	    {
		if ( this.prependToTitle != '' )
		{
		    title = this.prependToTitle + this.titleSeparator + title ;
		}
				
		_d.title = title ;
	    }
	},
		
	getTitle: function ()
	{
			
	},
		
	addTracker: function ( trackerCallback )
	{
			
	},
		
	remTracker: function ( trackerCallback )
	{
			
	},
		
	getAllTrackers: function ()
	{
	    return this._trackers;
	}
			
    };
	
    ajsf.address.initialize () ;
	
})(); 

