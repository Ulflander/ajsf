


/**********************************
 * AJSF - Aenoa Javascript Framework
 * (c) Xavier Laumonier 2010-2011
 *
 * Since : 
 * Author : Xavier Laumonier
 *
 **********************************/


(function (){

	ajsf_DEBUG = {
			
		_recursivity: 64 , 
		
		_cur: 0,
		
		_pr: function ( obj , indent )
		{
			if ( typeof(obj) == "undefined" )
			{
				return "<br />" + indent + "ajsf_DEBUG::pr Object to print is null or undefined.<br />" ;
			}
		
			this._cur ++ ;
			
			if ( this._cur > this._recursivity )
			{
				return obj ;
			}
			
			if ( indent == null )
			{
				indent = "" ;
			} else {
				indent += "&nbsp;&nbsp;" ;
			}
			
			var str = "" ;
			
			if ( typeof(obj) == "object" )
			{
				str += indent + obj + "{<br />" ;
				for ( var k in obj )
				{
					str += indent+indent + k + ":" + (typeof(obj[k]) == "object" ? this._pr(obj[k],indent) : obj[k] ) + ",}<br/>";
				}
				str += indent + "}" ;
			} else {
				str += indent + obj + " <br />" ;
			}
			
			return str ;
		},
		
		pr: function ( obj )
		{
			this._cur = 0 ;
			this.pe ( this._pr ( obj ) ) ; 
		},

		pe: function ( obj , isError )
		{
			if  (this.__tf)
			this.__tf.innerHTML = '<div class="code '+(isError==true?'red-block icon16 error':'')+' bold">' + obj + '</div>' + this.__tf.innerHTML; 
		},
		
		__console: null,
		
		__tf: null,
		
		__form: '<textarea id="__csloe" ></textarea><input class="margedtop" type="button" value="Execute" onclick="javascript:execute()" />',
		
		execute: function ()
		{
			var str = _("#__csloe").value ;
			this.pe ( "Executing: " + str ) ; 
			eval ( str ) ;
		},
		
		initConsole: function ()
		{
			this.__console = _d.createElement('div') ;
			this.__console.setAttribute ( 'style' , 'z-index:99999;position: absolute; top: 50px; width: 400px; height: 500px; left: -390px; -ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=95)";filter:alpha(opacity=95);-moz-opacity: 0.95;opacity: 0.95;' ) ;
			this.__console.setAttribute ( 'class' , 'col-5 p marged r-10 blue-block b light-shadowed bold' ) ;
			this.__console.innerHTML = '<p>Javascript console | <a href="javascript:void(0);" id="__closeConsole">Close</a> | <a href="javascript:void(0);" id="__expandConsole">Expand</a></p>' ;
			
			this.__console._switched = false ;
			this.__console._expanded = false ;
			this.__console._switching = false ;

			var expandConsole = $.delegate ( this.__console , function () {
				if ( this._switching == true )
				{
					return;
				}
				
				this._switching = true ;
				
				if ( this._expanded )
				{
					this.tweenTo ( {width:400} , "regularEaseOut" , 0.5 ) ;
					this._expanded = false ;
				} else {
					this.tweenTo ( {width:$.viewport.getWidth()-60} , "regularEaseOut" , 0.5 ) ;
					this._expanded = true ;
				}
			}) ;
			
			var updateConsole = $.delegate ( this.__console , function () {
				this._switching = false ;
			}) ;

			var hideConsole = $.delegate ( this.__console , function () {
				if ( this._switched == true && this._switching == false )
				{
					this.tweenTo ( {left:-390} , "regularEaseOut" , 0.5 ) ;
					if ( this._expanded )
					{
						expandConsole () ;
					}
					this._switching = true ;
					this._switched = false ;
				}
			}) ;

			this.__tf = _d.createElement('div') ;
			this.__tf.setAttribute ( 'style' , 'overflow: scroll; height: 260px;' ) ;
			this.__tf.setAttribute ( 'class' , 'blue-block r-5 padded bordered margedbottom' ) ;
			this.__console.appendChild ( this.__tf ) ;
			var f = _d.createElement('div') ;
			f.innerHTML = this.__form ;
			this.__console.appendChild ( this.__tf ) ;
			this.__console.appendChild ( f ) ;
			
			_d.body.appendChild(this.__console) ;

			
			this.__console.addListener ( 'motionEnd' , updateConsole ) ;
			this.__console.addListener ( 'mouseover' , showConsole ) ;

			_("#__closeConsole").addListener ( 'mouseup' , hideConsole ) ;
			_("#__expandConsole").addListener ( 'mouseup' , expandConsole ) ;
			
		}
	} ;
	
	$.registerInterface ( {
		pr: $.delegate(ajsf_DEBUG , "pr" )
	} ) ;
	
	ajsf.ready ($.delegate( ajsf_DEBUG, "initConsole" ));
	
	ajsf.load('aetween');
		
}() ); 

if ( typeof(pr) == 'undefined' )
{
	var pr = function ( something )
	{
		ajsf_DEBUG.pr ( something ) ;
	}
	glob('pr',pr);
}
if ( typeof(pe) == 'undefined' )
{
	var pe = function ( something , isError )
	{
		ajsf_DEBUG.pe ( something , isError ) ;
	}
	
	glob('pe',pe);
}
if ( typeof(execute) == 'undefined' )
{
	var execute = function ( something )
	{
		ajsf_DEBUG.execute ( something ) ;
	}
}
