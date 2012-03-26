
	/*
		
		Package: ajsf.IE

		This interface overrides AJSF core event handling (AJSF core event handling is based on browser event handling) for all IE-considered custom events.
		
		It has been done to handles custom events in IE < 9 but it works in all browsers, all versions.
		
		However you should use it only for IE<9.
	 */
		


(function (){
	
	
	var d = ajsf.EXTENDS_DOM.dispatch ,
		a = ajsf.EXTENDS_DOM.addListener,
		r = ajsf.EXTENDS_DOM.remListener ,
		evts =[ 'abort','activate','afterprint','afterupdate','beforeactivate','beforecopy','beforecut','beforedeactivate','beforeeditfocus','beforepaste','beforeprint','beforeunload',
		              'beforeupdate','blur','bounce','canplay','canplaythrough','cellchange','change','click','contextmenu','controlselect','copy','cut','dataavailable','datasetchanged',
		              'datasetcomplete','dblclick','deactivate',/*'drag','dragend','dragenter','dragleave','dragover','dragstart','drop'*/,'durationchange','emptied','ended','error','errorupdate',
		              'filterchange','finish','focus','focusin','focusout','hashchange','help','input','keydown','keypress','keyup','layoutcomplete','load','loadeddata','loadedmetadata',
		              'loadstart','losecapture','message','mousedown','mouseenter','mouseleave','mousemove','mouseout','mouseover','mouseup','mousewheel','move','moveend','movestart',
		              'mssitemodejumplistitemremoved','msthumbnailclick','offline','online','paste','pause','play','playing','progress','progress','propertychange','ratechange',
		              'readystatechange','readystatechange','reset','resize','resizeend','resizestart','rowenter','rowexit','rowsdelete','rowsinserted','scroll','seeked','seeking','select',
		              'selectionchange','selectstart','stalled','start','stop','storage','storagecommit','submit','suspend','timeout','timeupdate','unload','volumechange','waiting' ];

		
		
	ajsf.EXTENDS_DOM.listeners___ = [] ;
		
		
		/*
			Function: addListener
			
			Adds a listener an the element
			
			Parameters:
				action - [string] The action to listen
				callback - [function] Function to call when event is fired
				
			Returns:
			Current instance for chained commands on this element
		*/
	ajsf.EXTENDS_DOM.addListener = function (action, callback) {
			
			if ( typeof(callback) !== "function" ) {
				throw "ajsf_extends_dom::addListener:: function " + callback + " is not a function";
				return this;
			}

			if ( evts.indexOf(action) > -1 ) 
			{
				a.apply( this,  [action , callback] ) ;
				return this ;
			}
			
			if (!this[action+"__evt"]) {
			    this[action+"__evt"] = 0;
			}
			
			if ( !this.listeners___[action] )
			{
			    this.listeners___[action] = [] ;
			}
			
			this.listeners___[action].push(callback) ;
			
			var self = this ;
			
			this.attachEvent("onpropertychange", function(event){
			    if (event.propertyName == action+"__evt") {
				if ( self.listeners___[action].indexOf(callback) > -1 )
				{
				    callback({});
				}
			    }
			});

			return this;
		} ;
		
		
		/*
			Function: dispatch
			
			Dispatch an anonymous event
			
			Parameters:
				action - [string] The action to dispatch
				return - Result of dispatching (False if any listener has prevented the event, true otherwise)
		*/
		ajsf.EXTENDS_DOM.dispatch = function (action, bubbles , cancellable ) {

			if ( evts.indexOf(action) > -1 ) 
			{
				d.apply( this,  [action , bubbles , cancellable] ) ;
				return this ;
			}
			
			
			
			if (this[action+"__evt"]>=0) {
			    this[action+"__evt"]++;
			}
			
			return false ;
		};
		/*
			Function: remListener
			
			Remove a listener from the element
			
			Parameters:
			
				action - [string] The action listener to remove
				callback - [function] The used callback method
			
			Returns:
			Current instance for chained commands on this element
		*/
		ajsf.EXTENDS_DOM.remListener = function (action, callback) { 

			if ( evts.indexOf(action) > -1 ) 
			{
				r.apply( this,  [action , callback] ) ;
				return this ;
			}
			
			if ( this.listeners___[action] && this.listeners___[action].indexOf(callback) > -1 )
			{
			    this.listeners___[action][this.listeners___[action].indexOf(callback)] = null ;
			}
			
			return this;
		};
	
	ajsf.prevent__ = ajsf.prevent ;
	ajsf.prevent = function ( event )
	{
		if ( event.prevented === false )
		{
			event.prevented = true ;
		} else if ( !event.prevented )
		{
			ajsf.prevent__ ( event ) ;
		}
	};

	_d = ajsf.extend ( _d ) ;
}) () ;

