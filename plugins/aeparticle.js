
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
	
	if ( $.motion == undefined )
	{
		$.motion = {};
	}
	
	
	
	$.motion.ParticleSystem = function ( container , options )
	{
		this._emitter = new $.Point(0,0) ;
		this._n = 100 ;

		this._c = container ;
		this._image = '' ;
		this._velocity = new $.Point(2,5) ;

		this._wind = 0 ;
		
		this._gravity = 1 ;
		
		this._pool = [] ;
		
		this._particles = [] ;
		
		this._s = new $.Size(10,10) ;
		
		this._lifetime = 1000 ;
		
		this._frameRate = 20 ;
		
		this._c = $.create(null,'div') ;
		
		this._c.css('position: absolute;width: 100%;height: 100%;top:0;right;0;z-index:1000;');
		
		this._c.style.zIndex = 100000;
		this._destroyed = false ;

		container.appendChild(this._c);

		$.expandOptionsToClass ( this , options ) ;
		
		this._delegation = $.delegate(this,'update') ;

		$.timer.registerEnterFrame(this._delegation) ;
		
		this._i = 1 ;
		
		this.update() ;
	};
	
	
	$.motion.ParticleSystem.prototype.update = function ()
	{
		if (this._destroyed)
		{
			return;
		}
		
		var p ,
			l = this._particles.length ,
			addP = this._n / this._lifetime,
			i = 0,
			ps = this , 
			timeDif = 1000 / this._frameRate ;
		
		this._i += this._n / this._lifetime * this._frameRate;
		
		if ( !this._pool )
		{
			this._pool = [];
		}

		for ( i = 0 ; i < l ; i++ )
		{
			p = this._particles[i] ;

			if ( p.update(timeDif, this._gravity, this._wind) == false )
			{
				if ( addP == 0 )
				{
					p.detach () ;
					this._particles.splice(this._particles.indexOf(p), 1) ;
					l-- ;
					this._pool.push(p);
				} else {
					addP-- ;
					p.attach(this._emitter) ;
				}
			}
		}
		
		if ( addP > 1 && this._particles.length == 0 )
		{
			addP = 1 ;
		}
		

		while ( this._i >=1 && this._particles.length < this._n)
		{
			if ( this._pool.length > 0 )
			{
				p = this._pool.shift(); 
			} else {
				p = this._createParticle() ;
			}
			p.attach(this._emitter) ;
			this._particles.push(p) ;
			addP--;
			this._i = 0 ;
		}
		
	};

	$.motion.ParticleSystem.prototype.destroy = function (timeDif)
	{

		$.timer.unregisterEnterFrame(this._delegation) ;
		
		this._destroyed = true ;
		
		this._destroyPool() ;

		for ( var k in this._particles )
		{
			this._particles[k].destroy () ;
		}
		this._particles = null ;
		
		
		this._c.destroy () ;
		
		this._c = null ;
		
	};
	
	$.motion.ParticleSystem.prototype._createParticle = function ()
	{
		var p = new $.motion.Particle(this._c , this._velocity, this._lifetime , this._image , this._s)
		
		p.attach(this._emitter) ;
		
		return p;
	} ;

	$.motion.ParticleSystem.prototype._destroyPool = function ()
	{

		for ( var k in this._pool )
		{
			this._pool[k].destroy () ;
		}
		this._pool = null ;
	} ;
	
	$.motion.ParticleSystem.prototype.setLifetime = function ( val )
	{
		this._lifetime = val ;
	};
	
	$.motion.ParticleSystem.prototype.getLifetime = function ()
	{
		return this._lifetime ;
	};
	
	$.motion.ParticleSystem.prototype.setZIndex = function ( val )
	{
		if ( this._c ) this._c.style.zIndex = val ;
	};
	
	$.motion.ParticleSystem.prototype.getZIndex = function ()
	{
		return ( this._c ? this._c.style.zIndex : 0 ) ;
	};
	
	$.motion.ParticleSystem.prototype.getSize = function ()
	{
		return this._s ;
	};

	$.motion.ParticleSystem.prototype.setSize = function ( val )
	{
		this._s = val ;
	};
	
	$.motion.ParticleSystem.prototype.getImage = function ()
	{
		return this._image ;
	};

	$.motion.ParticleSystem.prototype.setImage = function ( val )
	{
		this._image = val ;
		this._destroyPool () ;
	};

	$.motion.ParticleSystem.prototype.getNumber = function ()
	{
		return this._n ;
	};

	$.motion.ParticleSystem.prototype.setNumber = function ( val )
	{
		this._n = val ;
	};

	$.motion.ParticleSystem.prototype.getVelocity = function ()
	{
		return this._velocity ;
	};

	$.motion.ParticleSystem.prototype.setVelocity = function ( val )
	{
		this._velocity = val ;
		this._destroyPool () ;
	};
	
	$.motion.ParticleSystem.prototype.getGravity = function ()
	{
		return this._gravity ;
	};

	$.motion.ParticleSystem.prototype.setGravity = function ( val )
	{
		this._gravity = val ;
	};
	
	$.motion.ParticleSystem.prototype.getWind = function ()
	{
		return this._wind ;
	};

	$.motion.ParticleSystem.prototype.setWind = function ( val )
	{
		this._wind = val ;
	};
	
	$.motion.ParticleSystem.prototype.getEmitter = function ()
	{
		return this._emitter ;
	};

	$.motion.ParticleSystem.prototype.setEmitter = function ( val )
	{
		this._emitter = val ;
	};
	
	$.motion.Particle = function ( container , velocity , lifetime , img , size )
	{

		this._c = container ;
		this._image = img ;
		this._velocity = velocity ;
		
		this._e = $.create(null,'img') ;
		
		this._css = 'position:absolute;display:block;background:transparent;border:0;width:' + size.w() + ';height:' + size.h() + ' ;z-index:'+Math.rand(100)+';' ;
		
		//background: transparent url('+img+') no-repeat center center;
		this._e.css(this._css);
		this._e.src = img ;
		
		this._s = size ;

		this._e.setSize( 0,0 ) ;
		
		this._age = 0 ;
		this._e.setOpacity(1) ;
		
		this._isDead = false ;
		this._isBirth = false ;
		
		this._lifetime = lifetime ;
		
		this._a = 0 ;
		
		this._timeBirth = lifetime/3 ;
		this._timeDeath = lifetime/3 ;
		this._rotate = 0 ;
		
		this._opacity = 0.5 ;
	};

	$.motion.Particle.prototype.detach = function ()
	{
		this._c.removeChild(this._e) ;
	};

	$.motion.Particle.prototype.attach = function ( emitter )
	{
		if ( this._c && this._e && emitter )
		{
			if ( !this._e.offsetParent )
				this._c.appendChild(this._e) ;
			
			this._e.setLeft( emitter.x() ) ;
			this._e.setTop( emitter.y() ) ;
			this._e.setSize( 1,1 ) ;
			this._age = 0 ;
			this._isDead = false ;
			this._a = 0 ;

		}
	};
	
	$.motion.Particle.prototype.destroy = function ()
	{
		this.detach () ;
		this._c = null ;
		this._e.destroy () ;
		this._e = null ;
		
	};

	$.motion.Particle.prototype.update = function (timeDif, gravity, wind)
	{
		var vx = Math.rand(this._velocity.x()) + wind ,
			vy = Math.rand(this._velocity.y()) + gravity;
		
		this._rotate = this._rotate + 4 - Math.rand(8);
		
		this._e.rotate(this._rotate);

		if ( this._age >= this._lifetime )
		{
			return false ;
		}
		/*
		if ( this._age > this._lifetime - this._timeDeath )
		{
			this._a = this._a - this._opacity / (this._timeDeath / timeDif) ;
		} else if ( this._age <= this._timeBirth )
		{
			this._a = this._a + this._opacity / (this._timeBirth / timeDif) ;
		} else
		{
			this._a = this._opacity ;
		}
		*/
		if ( this._e.w() < this._s.w () )
		{
			this._e.setSize(this._e.w() + this._s.w() / (this._timeBirth / timeDif), this._e.h() + this._s.h() / (this._timeBirth / timeDif) ) ;
		} else {
			
		}

		this._e.setLeft( this._e.getLeft() + vx ) ;
		this._e.setTop( this._e.getTop () + vy ) ;
		

		this._age += timeDif ;

		return true ;
	};
	
	
})(); 

