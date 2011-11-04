
/**********************************
 * AJSF - Aenoa Javascript Framework
 * (c) Xavier Laumonier 2010-2011
 *
 * Since : 
 * Author : Xavier Laumonier
 *
 **********************************/



(function (){
	
	
	ajsf.Drag = ajsf.Class.extend({
		
		construct: function ( e , t , l , w , h )
		{
			this._e = e ;
			
			this._e.stylize('position','absolute');
			this._e.stylize('MozUserSelect','none');
			this._e.unselectable = 'on' ;
			
			this.setBounds (t , l , w , h);
			
			this._dragging = false ;
		
			this._delegation = ajsf.delegate(this,'_onEF') ;
			
			// prevent text selection in IE 
			_d.onselectstart = function () { return false; };
			// prevent IE from trying to drag an image 
			this._e.addListener ( 'dragstart', function() { return false;} ); 
			
			this._delMouseDown = ajsf.delegate(this,'_onPress') ;
			this._delMouseUp = ajsf.delegate(this,'_onRelease') ;
			
			this._e.addListener ( 'mousedown' , this._delMouseDown ) ;
			this._e.addListener ( 'mouseup' , this._delMouseUp ) ;
			_d.addListener ( 'mouseup' , this._delMouseUp ) ;
			
			
		},
		
		
		destroy: function ()
		{
			if ( this.isDragging )
			{
				this._onRelease () ;
			}
			
			if ( this._e )
			{
				this._e.remListener('mousedown', this._delMouseDown);
				this._e.remListener('mouseup', this._delMouseDown);
				this._e = null ;
			}
			
			this._delegation = null ;

			_d.remListener('mouseup', this._delMouseDown);
			
			this._delMouseDown = null ;
			this._delMouseUp = null ;
		},
	
		_e: null ,
		
		_mt: 0 ,
		
		_ml: 0 ,
		
		_prevent: false,
		
		_activated: true,
		
		isDragging: function ()
		{
			return this._dragging ;
		},
		
		setBounds: function ( t , l , w , h )
		{
	
			this._t = t || 0 ;
			this._l = l || 0 ;
			this._w = w || this._l ;
			this._h = h || this._t ;
			
			this._checkBoundsAndSetPos () ;
			
			return this ;
		},
		
		isActivated: function ()
		{
			return this._activated ;
		},
		
		setActivation: function ( v )
		{
			if ( v )
			{
				this._activated = true ;
			} else {
				this._activated = false ;
			}
			return this ;
		},
		
		press: function ()
		{
			this._onPress(null);
			return this ;
		},
		
		_onPress: function (e)
		{
			if ( this._dragging == false && this._activated == true )
			{
				this._dragging = true ;
				//ajsf.timer.registerEnterFrame(this._delegation);
				ajsf.prevent(e);
				
				_d.addListener('mousemove',this._delegation);
				
				this._e.dispatch('dragstart') ;
				
				this._ml = ajsf.mouse.mouseX - this._e.getLeft(true);
				this._mt = ajsf.mouse.mouseY - this._e.getTop(true);
			}
	
		},
		
		_onRelease: function (e)
		{
			if ( this._dragging == true )
			{
				//ajsf.timer.unregisterEnterFrame(this._delegation);
				_d.remListener('mousemove',this._delegation);
				if (  this._activated == true )
				{
					this._e.dispatch('dragend') ;
					
				}
				this._dragging = false ;
				ajsf.prevent(e);
			}
		},
		
		_onEF: function ()
		{
			var p = (this._e ? this._e.offsetParent : null ), x = ajsf.mouse.mouseX , y = ajsf.mouse.mouseY ;
	
			if( !p || this._activated == false ) {
				this._onRelease () ;
				return ;
			}
	
			x = x - p.getLeft(true) - this._ml ;
			y = y - p.getTop(true) - this._mt ;
	
			this._checkBoundsAndSetPos ( x , y ) ;
	
			this._e.dispatch('drag') ;
	
			
		},
		
		checkBounds: function ()
		{
			this._checkBoundsAndSetPos();

			return this ;
		},
		
		_checkBoundsAndSetPos: function ( x, y )
		{
			x = x || this._e.getLeft (false);
			y = y || this._e.getTop (false);
	
			
			if ( y < this._t )
			{
				y = this._t ;
			} else
			if ( y > this._t + this._h )
			{
				y = this._t + this._h ;
			}
	
			if ( x < this._l )
			{
				x = this._l ;
			} else
			if ( x  > this._l + this._w )
			{
				x = this._l + this._w ;
			}
	
			this._e.setPos(x, y ) ;
			
		}
		
		
	});

	ajsf.DragDrop = ajsf.Drag.extend({
		construct: function ( e , t , l , w , h )
		{
			this._super(e , t , l , w , h);

			this._current = null ;
			
		},
		
		_containers: [],
		
		_currentDropped: null,
		
		
		addDropBox: function ( container )
		{
			this._containers.push(container) ;

			return this ;
		},
		
		addDropBoxes: function ( container )
		{
			var els = _('div, li, a',container,false,true), k;
			
			for ( k in els )
			{
				this.addDropBox(els[k]);
			}
			
			return this ;
		},
		
		getCurrentDrop: function ()
		{
			return this._current ;
		},
		
		_onEF: function ()
		{
			this._super () ;
			this._testDrops () ;
		},
		
		_testDrops: function ()
		{
			if (  !this._activated )
			{
				return null ;
			}
			
			this._current = null ;
			
			var k = 0, x1, y1, e, 
				x = ajsf.mouse.mouseX ,
				y = ajsf.mouse.mouseY ,
				l = this._containers.length ;
			
			for(k ; k < l ; k ++ )
			{
				e = this._containers[k];
				x1 = e.getLeft (true) ; 
				y1 = e.getTop (true) ;
				
				if ( x > x1 && x < x1 + e.w() && y > y1 && y < y1 + e.h() )
				{
					this._setCurrent(e);
				} else if ( e !== this._current )
				{
					e.remClass('hover');
				}
			}
			
			return this._current ;
		},
		
		_setCurrent: function (el)
		{
			if ( this._current !== el )
			{
				this._current = el ;
				
				el.addClass('hover');
			}
			
			this._e.dispatch('dragon') ;
		},
		
		_onRelease: function (e)
		{
			if ( this.isDragging () && this.isActivated () )
			{
				this._testDrops () ;
				
				if ( this._current )
				{
					this._current.remClass('hover');
					this._e.dispatch('dropped') ;
					this._current.dispatch('dropchange') ;
				}
			}
			
			this._super (e) ;

			this._current = null ;
		}
		
	});	

}()); 










