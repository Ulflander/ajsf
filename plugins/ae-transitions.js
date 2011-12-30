
/**********************************
 * AJSF - Aenoa Javascript Framework
 * (c) Xavier Laumonier 2010-2011
 *
 * Since : 1.0.0
 * Author : Xavier Laumonier
 *
 **********************************/

/*
	Package: ajsf.ae-transitions
*/
(function(){
	
    if ( !window.ajsf ) return;
    
    ajsf.load('aetween') ;
	
    /*
	 	Class: ajsf.Transition
	 	
	 	This class creates a new transition between 2 objects.
    
		Just create a new
	 	
	 	Extends: ajsf.AbstractEvtDispatcher
	*/
    ajsf.Transition = ajsf.AbstractEvtDispatcher.extend({
	
	construct: function ( transition , obj1, obj2 , delta )
	{
	    this.setTransition ( transition ) ;
	    
	    
	    this.run ( obj1, obj2, delta ) ;
	},
	
	setTransition: function ( transition )
	{
	    transition = transition || 'HSlide' ;
	    
	    if ( transition && is (ajsf.Transition[transition] , 'function' ) )
	    {
		this._t = ajsf.Transition[transition] ;
	    } else {
		this._t = ajsf.Transition[HSlide] ;
	    }
	},
	
	run: function ( obj1 , obj2 , delta )
	{
	    if ( obj1 )
	    {
		this._o1 = obj1 ;
	    }
	    
	    if ( obj2 )
	    {
		this._o2 = obj2 ;
	    }
	
	    
	    if ( !this._o2 )
	    {
		return;
	    }
	    
	    if ( !this._o1 )
	    {
		this._o2.show () ;
		
		return;
	    }
	    
	    
	    this._t ( this._o1 , this._o2, delta ) ;
	}
	
	
    }) ;
    
    
    ajsf.Transition.HSlide = function ( obj1, obj2, delta )
    {
	delta = (delta > 0 ? 1 : -1);
	
	this._o1.show () ;
	this._o2.show () ;
	
	obj2.tween ( {
	    left: (delta * obj1.w()) +'px'
	}, {
	    left: '0px'
	}, 
	"regularEaseOut", 
	1 ) ;
	
	obj1.tween ( {
	    left: obj1.getLeft(false)+'px'
	}, {
	    left: (-delta * obj1.w()) + 'px'
	}, 
	"regularEaseOut", 
	1 ) ;
	
	
    } ;
})() ;