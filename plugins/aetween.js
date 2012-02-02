
/*
	
*/

(function(){

	/*
		Package: ajsf.tweener

		These methods can be accessed only using ajsf.tweener reference:

		(start code)

		<div id="myElement"></div>

		<script type="text/javascript">

			ajsf.load('aetween').ready(function(){

				ajsf.tweener.tween ( _('#myElement') , {top: '10px'} , {top: '20px'} ) ;

			});

		</script>

		(end)
	*/
	ajsf.tweener={
				
		/*
				Variable: __tw
				
				Private
			*/
		__tw:[],
			
		/*
				Function: tween
				
				Create a new tween
				
				Parameters:
					obj
					propsFrom
					propsTo
					easing
					duration
					
				Returns:
			*/
		tween:function(obj,propsFrom,propsTo,easing,duration)
		{
			var t=new ajsf.Tween(obj,propsFrom,propsTo,easing,duration);
			return t;
		},
				
		/*
				Function: registerTween

				Add a new tween in global tweens array

				Parameters:
					tween
			*/
		registerTween:function(tween)
		{
			this.__tw.push(tween);
		},
			
		/*
				Function: unregisterTween

				Remove a tween from the global tweens array

				Parameters:
					tween
			*/
		unregisterTween:function(tween)
		{
			for(var k in this.__tw)
			{
				if(this.__tw[k]===tween)
				{
					delete(this.__tw[k]);
					break;
				}
			}
		},
				
		/*
			Function: stopByTarget

			Resume or stop all tweens given a target

			Parameters:
				obj
				stop
		*/
		stopByTarget:function(obj,stop)
		{
			for(var k in this.__tw)
			{
				if(this.__tw[k].getTarget()===obj)
				{
					if(stop===true)
					{
						this.__tw[k].stop();
					}else{
						this.__tw[k].resume();
					}
				}
			}
		},
		
		_regex:new RegExp("in|cm|mm|pt|pc|px|rem|em|%|ex|gd|vw|vh|vm|deg|grad|rad|ms|s|khz|hz","g")
	};
		

	/*
		Package: ajsf.tweener.DOMInterface

		These methods are automatically added to DOM elements selected using ajsf.

		They mostly are helpers functions to setup quickly tweens on elements.

		Example:
		(start code)

		<div id="myElement"></div>

		<script type="text/javascript">

			ajsf.load('aetween').ready(function(){

				_('#myElement').fadeIn () ;
				
			});

		</script>

		(end)
	*/
	ajsf.registerInterface({
		
		isTweening:false,

		_tweens:[],
		
		/*
			Function: fadeOut

			Fade out object

			Parameters:
				duration
				destroyOnEnd
			
			Returns:
			Current instance for chained commands on this element
		*/
		fadeOut:function(duration,destroyOnEnd)
		{
			var p={},d=duration||0.5;
			
			if(destroyOnEnd===true)
			{
				p.onMotionEnd=ajsf.delegate(this,'destroy');
			}else{
				p.onMotionEnd=ajsf.delegate(this,'hide');
			}
			this.tween({
				opacity:1
			},{
				opacity:0
			},"regularEaseOut",d,p);
			return this;
		},
		
		/*
			Function: mayFadeOut

			Fade out object if object is currently visible

			Parameters:
				duration
				destroyOnEnd
			
			Returns:
			Current instance for chained commands on this element
		*/
		mayFadeOut:function(duration,destroyOnEnd)
		{
			if(this.isVisible())this.fadeOut(duration,destroyOnEnd);
			return this;
		},
		/*
			Function: fadeIn

			Fade in object
			
			Parameters:
				duration
			
			Returns:
			Current instance for chained commands on this element
		*/
		fadeIn:function(duration)
		{
			this.cancelTweens();
			this.tween({
				opacity:0
			},{
				opacity:1
			},"regularEaseOut",duration||0.5,{
				onMotionEnd:null
			});
			return this;
		},
		/*
			Function: mayFadeIn

			Fade in object if object is currently hidden

			Parameters:
				duration
			
			Returns:
			Current instance for chained commands on this element
		*/
		mayFadeIn:function(duration)
		{
			if(!this.isVisible())this.fadeIn(duration);
			return this;
		},
		/*
			Function: panFrom

			Pan object from a specific position to its current position
			
			Parameters:
				propsFrom
				duration
			
			Returns:
			Current instance for chained commands on this element
		*/
		panFrom:function(propsFrom,duration)
		{
			this.tweenFrom(propsFrom,"regularEaseOut",duration);
			return this;
		},
		/*
			Function: panTo

			Pan object from its current position to a specific position

			Parameters:
				propsTo
				duration
				destroyOnEnd
			
			Returns:
			Current instance for chained commands on this element
		*/
		panTo:function(propTo,duration,destroyOnEnd)
		{
			var p={};
			duration=duration||0.5;
			
			if(destroyOnEnd===true)
			{
				p.onMotionEnd=ajsf.delegate(this,'destroy');
			}
			return this.tweenTo(propTo,"regularEaseOut",duration,p);
		},
		/*
			Function: tweenTo

			Tween object from its current properties to specific properties
			
			Parameters:
				props
				easing
				duration
				params
			
			Returns:
			Current instance for chained commands on this element
		*/
		tweenTo:function(props,easing,duration,params)
		{
			if(!params)params={};
			params.dispatcher=this;
			ajsf.tweener.tween(this.style,props,easing,duration,params);
			return this;
		},
		/*
			Function: tweenFrom

			Tween object from specific properties to its current properties
			
			Parameters:
				props
				easing
				duration
				params

			Returns:
			Current instance for chained commands on this element
		*/
		tweenFrom:function(props,easing,duration,params)
		{

			var propsTo={},k;
			for(k in props)
			{
				propsTo[k]=this.style[k];
				if(k!="opacity")
				{
					this.style[k]=props[k];
				}else{
					this.setOpacity(propsFrom[k]);
				}
			}
			if(!params)params={};
			params.dispatcher=this;
			ajsf.tweener.tween(this.style,propsTo,easing,duration,params);
			return this;
		},
		/*
			Function: tween

			Manually setup tween

			Parameters:
				propsFrom
				propsTo
				easing
				duration
				params

			Returns:
			Current instance for chained commands on this element
		*/
		tween:function(propsFrom,propsTo,easing,duration,params)
		{
			for(var k in propsFrom)
			{
				if(k!="opacity")
				{
					this.style[k]=propsFrom[k];
				}else{
					this.setOpacity(propsFrom[k]);
				}
			}
			if(!params)params={};
			params.dispatcher=this;
			ajsf.tweener.tween(this.style,propsTo,easing,duration,params);
			return this;
		},
		/*
			Function: stop

			Stop all currently running tweens of this element
			
			Returns:
			Current instance for chained commands on this element
		*/
		stop:function()
		{
			ajsf.tweener.stopByTarget(this.style);
			return this;
		},
		/*
			Function: cancelTweens

			Resume all currently running tweens of this element
			
			Returns:
			Current instance for chained commands on this element
		*/
		cancelTweens:function()
		{
			ajsf.tweener.stopByTarget(this.style,true);
			return this;
		},
		
		/*
			Variable:_tweening
		*/
		_tweening:[]
	});
	
	

	/*
		Class: ajsf.Tween

		The actual tween class
	*/
	ajsf.Tween=ajsf.Class.extend({

		isPlaying:false,

		_delegation:null,

		_obj:{},

		_propsFrom:{},

		_props:{},

		_ease:null,

		_time:0,

		_duration:1000,

		_suffixes:{},

		_dispatcher:null,

		_onMotionEnd:null,

		_delay:0,
		
		/*
			Constructor: construct

			Creates a new tween

			Parameters:
				obj
				propsTo
				easing
				duration
				parameters
			
			Returns:
		*/
		construct: function(obj,propsTo,easing,duration,parameters)
		{
			if(!obj)
			{
				return;
			}
			
			this._obj=obj;
			
			this._props=this._filterProps(propsTo);
			
			if(this._propsFrom.length!=this._props.length)
			{
				this._propsFrom=null;
				this._props=null;
				this._obj=null;
				
				return;
			}
			
			easing=easing||'regularEaseOut';
			
			
			this._ease=ajsf.Tween[easing];
			
			this._duration=(duration?duration*1000:500);
			
		
			if(parameters)
			{
				for(var k in parameters)
				{
			
					switch(k)
					{
						case'delay':
							this._delay=parseFloat(parameters[k])*1000;
							break;
						case'dispatcher':
							this._dispatcher=parameters[k];
							break;
						case'onMotionEnd':
							this._onMotionEnd=parameters[k];
							break;
					}
				}
			}
			
			
			
			if(!this._dispatcher&&typeof(this._obj.dispatch)=="function")
			{
				this._dispatcher=this._obj;
			}
			
			this._delegation=ajsf.delegate(this,'_update');
			
			ajsf.tweener.registerTween(this);
			
			if(this._delay==0)
			{
				this.start();
			}else{
				ajsf.delayed(this._delay,ajsf.delegate(this,"start"));
			}
		},
	
		/*
			Function: toString

			Get a string representation of a tween

			Returns:
			A string representation of the tween
		*/
		toString:function()
		{
			return "[Tween/target:"+this._obj+"/duration:"+this._duration+"/dispatcher:"+this._dispatcher+"]";
		},
		/*
			Function: getTarget

			Get target element of the tween
			
			Returns:
		*/
		getTarget:function()
		{
			return this._obj;
		},
		
		_filterProps:function(props){
			
			var _props={},res=null,p,p2,l=0,k;
			this._propsFrom={};
			for(k in props)
			{
				if(this._obj[k]==undefined)
				{
					this._obj[k]=0;
				}
				if(is(this._obj[k],"string"))
				{
					p=parseFloat(String(this._obj[k]).replace(ajsf.tweener._regex,""));
					p2=parseFloat(String(props[k]).replace(ajsf.tweener._regex,""));
		
					this._propsFrom[k]=p;
					_props[k]=p2;
		
					res=this._obj[k].match(ajsf.tweener._regex);
					if(res!=null)
					{
						this._suffixes[k]=res[0];
					}else{
						this._suffixes[k]='';
					}
						
					l++;
				}else{
					
					p=this._obj[k];
					p2=props[k];
			
					this._suffixes[k]='';
					this._propsFrom[k]=p;
					_props[k]=p2;
					l++;
				}
				
			}
			return _props;
		},
		/*
			Function: resume

			Resume the tween (go to end of tween)
		*/
		resume:function(){
			if(this.isPlaying==true)
			{
				this._time=this._duration;
				this._update();
			}
		},
		/*
			Function: isFinished

			Check if tween is finished
			
			Returns:
		*/
		isFinished:function(){
			return(isPlaying==false);
		},
		
		/*
			Function: start

			Start the tween
		*/
		start:function(){
			if(this.isPlaying==false)
			{
				if(this._dispatcher&&is(this._dispatcher.show,"function"))
				{
					this._dispatcher.show("block",true);
				}
				
				this._startTime=(new Date()).getTime();
				
				this.isPlaying=true;
		
				ajsf.timer.registerEnterFrame(this._delegation);
				
			}
		},
		
		/*
			Function: stop

			Stop the tween
		*/
		stop:function(){
			if(this.isPlaying==true){
				this.isPlaying=false;
				
				ajsf.timer.unregisterEnterFrame(this._delegation);
		
				ajsf.tweener.unregisterTween(this);
			}
		},

		_update:function(){
			this._time=(new Date()).getTime()-this._startTime;
			if(this._time>=this._duration)
			{
				ajsf.timer.unregisterEnterFrame(this._delegation);
		
				this._time=this._duration;
		
				this._apply();
				
				if(this._dispatcher)
				{
					this._dispatcher.dispatch("motionEnd");
				}
				if(is(this._onMotionEnd,'function'))
				{
					this._onMotionEnd();
				}
				
				ajsf.tweener.unregisterTween(this);
			}else{
				this._apply();
			}
		},

		_apply:function(){
			var p,k;
			for(k in this._props)
			{
				
				p=this._ease(this._time/1000,this._propsFrom[k],this._props[k]-this._propsFrom[k],this._duration/1000);
		
				if(!isNaN(p)&&p<10000)
				{
					this._setProperty(k,p,this._suffixes[k]);
				}else{
					this._setProperty(k,0,this._suffixes[k]);
				}
			}
		},

		_setProperty:function(p,value,suffix){
			if(p!=='opacity')
			{
				this._obj[p]=value+''+suffix;
			}else{
				this._obj['opacity']=value;
				this._obj['MozOpacity']=value;
				this._obj['WebkitOpacity']=value;
				if(b.IE&&!b.IE9)
				{
					this._dispatcher.filters.alpha=parseInt(value*100);
				}
			}
		}
	});
	
	
	
	

	/*
		Package: ajsf.Tween.easing

		
	*/
	
	/*
		Function: ajsf.Tween.backEaseIn
		
		Parameters:
			t
			b
			c
			d
			a
			p
			
		Returns:
	*/
	ajsf.Tween.backEaseIn=function(t,b,c,d,a,p){
		if(s==undefined)var s=1.70158;
		return c*(t/=d)*t*((s+1)*t-s)+b;
	};
	/*
		Function: ajsf.Tween.backEaseOut
		
		Parameters:
			t
			b
			c
			d
			a
			p
			
		Returns:
	*/
	ajsf.Tween.backEaseOut=function(t,b,c,d,a,p){
		if(s==undefined)var s=1.70158;
		return c*((t=t/d-1)*t*((s+1)*t+s)+1)+b;
	};
	/*
		Function: ajsf.Tween.backEaseInOut
		
		Parameters:
			t
			b
			c
			d
			a
			p
			
		Returns:
	*/
	ajsf.Tween.backEaseInOut=function(t,b,c,d,a,p){
		if(s==undefined)var s=1.70158;
		if((t/=d/2)<1)return c/2*(t*t*(((s*=(1.525))+1)*t-s))+b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t+s)+2)+b;
	};
	/*
		Function: ajsf.Tween.elasticEaseIn
		
		Parameters:
			t
			b
			c
			d
			a
			p
			
		Returns:
	*/
	ajsf.Tween.elasticEaseIn=function(t,b,c,d,a,p){
		if(t==0)return b;
		if((t/=d)==1)return b+c;
		if(!p)p=d*.3;
		var s;
		if(!a||a<Math.abs(c)){
			a=c;
			s=p/4;
		}
		else{
			s=p/(2*Math.PI)*Math.asin(c/a);
		}
		return -(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;
		
	};
	/*
		Function: ajsf.Tween.elasticEaseOut
		
		Parameters:
			t
			b
			c
			d
			a
			p
			
		Returns:
	*/
	ajsf.Tween.elasticEaseOut=function(t,b,c,d,a,p){
		if(t==0)return b;
		if((t/=d)==1)return b+c;
		if(!p)p=d*.3;
		var s;
		if(!a||a<Math.abs(c)){
			a=c;
			s=p/4;
		}
		else s=p/(2*Math.PI)*Math.asin(c/a);
		return (a*Math.pow(2,-10*t)*Math.sin((t*d-s)*(2*Math.PI)/p)+c+b);
	};
	/*
		Function: ajsf.Tween.elasticEaseInOut
		
		Parameters:
			t
			b
			c
			d
			a
			p
			
		Returns:
	*/
	ajsf.Tween.elasticEaseInOut=function(t,b,c,d,a,p){
		if(t==0)return b;
		if((t/=d/2)==2)return b+c;
		if(!p)p=d*(.3*1.5);
		var s;
		if(!a||a<Math.abs(c)){
			a=c;
			s=p/4;
		}
		else s=p/(2*Math.PI)*Math.asin(c/a);
		if(t<1)return-.5*(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;
		return a*Math.pow(2,-10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p)*.5+c+b;
	};
	
	/*
		Function: ajsf.Tween.bounceEaseOut
		
		Parameters:
			t
			b
			c
			d
			
		Returns:
	*/
	ajsf.Tween.bounceEaseOut=function(t,b,c,d){
		if((t/=d)<(1/2.75)){
			return c*(7.5625*t*t)+b;
		}else if(t<(2/2.75)){
			return c*(7.5625*(t-=(1.5/2.75))*t+.75)+b;
		}else if(t<(2.5/2.75)){
			return c*(7.5625*(t-=(2.25/2.75))*t+.9375)+b;
		}else{
			return c*(7.5625*(t-=(2.625/2.75))*t+.984375)+b;
		}
	};
	/*
		Function: ajsf.Tween.bounceEaseIn
		
		Parameters:
			t
			b
			c
			d
			
		Returns:
	*/
	ajsf.Tween.bounceEaseIn=function(t,b,c,d){
		return c-ajsf.Tween.bounceEaseOut(d-t,0,c,d)+b;
	};
	/*
		Function: ajsf.Tween.bounceEaseInOut
		
		Parameters:
			t
			b
			c
			d
			
		Returns:
	*/
	ajsf.Tween.bounceEaseInOut=function(t,b,c,d){
		if(t<d/2)return ajsf.Tween.bounceEaseIn(t*2,0,c,d)*.5+b;
		else return ajsf.Tween.bounceEaseOut(t*2-d,0,c,d)*.5+c*.5+b;
	};
	/*
		Function: ajsf.Tween.strongEaseInOut
		
		Parameters:
			t
			b
			c
			d
			
		Returns:
	*/
	ajsf.Tween.strongEaseInOut=function(t,b,c,d){
		return c*(t/=d)*t*t*t*t+b;
	};
	/*
		Function: ajsf.Tween.regularEaseIn
		
		Parameters:
			t
			b
			c
			d
			
		Returns:
	*/
	ajsf.Tween.regularEaseIn=function(t,b,c,d){
		return c*(t/=d)*t+b;
	};
	/*
		Function: ajsf.Tween.regularEaseOut
		
		Parameters:
			t
			b
			c
			d
			
		Returns:
	*/
	ajsf.Tween.regularEaseOut=function(t,b,c,d){
		return -c*(t/=d)*(t-2)+b;
	};
	/*
		Function: ajsf.Tween.regularEaseInOut
		
		Parameters:
			t
			b
			c
			d
			
		Returns:
	*/
	ajsf.Tween.regularEaseInOut=function(t,b,c,d){
		if((t/=d/2)<1)return c/2*t*t+b;
		return -c/2*((--t)*(t-2)-1)+b;
	};
	/*
		Function: ajsf.Tween.strongEaseIn
		
		Parameters:
			t
			b
			c
			d
			
		Returns:
	*/
	ajsf.Tween.strongEaseIn=function(t,b,c,d){
		return c*(t/=d)*t*t*t*t+b;
	};
	/*
		Function: ajsf.Tween.strongEaseOut
		
		Parameters:
			t
			b
			c
			d
			
		Returns:
	*/
	ajsf.Tween.strongEaseOut=function(t,b,c,d){
		return c*((t=t/d-1)*t*t*t*t+1)+b;
	};
	/*
		Function: ajsf.Tween.strongEaseInOut
		
		Parameters:
			t
			b
			c
			d
			
		Returns:
	*/
	ajsf.Tween.strongEaseInOut=function(t,b,c,d){
		if((t/=d/2)<1)return c/2*t*t*t*t*t+b;
		return c/2*((t-=2)*t*t*t*t+2)+b;
	};
		
}());





