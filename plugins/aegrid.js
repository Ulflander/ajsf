
/**********************************
 * AJSF - Aenoa Javascript Framework
 * (c) Xavier Laumonier 2010-2011
 *
 * Since : 
 * Author : Xavier Laumonier
 *
 **********************************/



(function (){
	
ajsf.GridHelper = function ( container , w , margin , mode )
{
	this._ctn = container ;
	
	this._w = w ;
	
	this._m = margin || 0 ;
	
	this.turnToGrid = function ( w )
	{
		if ( w && w!= this._w )
		{
			this._w = w ;
		}
		
		var i = 0, nodes = this._ctn.childNodes ,
			l = nodes.length,
			n,
			x = 0,
			y = 0 , 
			h = 0 ;
		
		for ( i ; i< l ; i++ )
		{
			n = ajsf.i(nodes[i]) ;
			
			if ( n.h() > h )
				h = n.h () ;
			
			n.setLeft(x);
			n.setTop(y);
			
			x += n.w () + this._m ;
			
			if ( x >= this._w )
			{
				x = 0 ;
				y += h + this._m ;
				h = 0 ;
			}
		}
	};

	this.turnToCircle = function ( w )
	{
		if ( w && w!= this._w )
		{
			this._w = w ;
		}
		
		var i = -1, j = 0 , k, nodes = this._ctn.childNodes ,
			l = nodes.length,
			alpha = Math.PI * 2 / l, l2,
			theta,
			radius = this._w / 2 , r ,
			c ;
	    	
		if ( l < 60 )
		{
			while( ++i < l )
			{
				theta = alpha * i;
				ajsf.i(this._ctn.childNodes[i]).setPos ( Math.sin( theta ) * radius, Math.cos( theta ) * radius );
			}
		} else {
			c = Math.ceil ( l / 60 ) + 1 ;

			i = -1;
			l2 = 60 ;
			for ( j ; j < c ; j ++ )
			{
				if ( j < c-1 )
				{
					alpha = Math.PI * 2 / l2;
				} else {
					l2 = l - i ;
					alpha = Math.PI * 2 / (l - i );
				}
				k=-1;
				
				while( k++ < l2 && i++ < l )
				{
					theta = alpha * i;
					ajsf.i(this._ctn.childNodes[i]).setPos ( Math.sin( theta ) * radius, Math.cos( theta ) * radius );
				}
				l2 -= 5 ;
				radius -= 32 ;
			}
		}
	};
	
	this.tweenFromCenter = function ()
	{
		
		var i = 0, nodes = this._ctn.childNodes ,
			l = nodes.length ,
			from = this._w / 2 ,
			delay = 0 ;
			
		
		for ( i ; i< l ; i++ )
		{
			delay += 0.025 ;
			
			c = this._ctn.childNodes[i] ;
			c.tween({top:(from-8)+'px',left:(from-8)+'px',opacity:0},{top:(c.getTop(false) +from-8)+'px',left:(c.getLeft(false)+from-8)+'px',opacity:1},'regularEaseOut',0.5, {delay:delay});
		}
		
	};
	
	this.destroy  = function ()
	{
		this._ctn = null ;
	};
	

	switch ( mode )
	{
		case 'circle':
			this.turnToCircle () ;
			break;
		default:
			this.turnToGrid () ;
	};
	
};




}() ); 