
/**********************************
 * AJSF - Aenoa Javascript Framework
 * (c) Xavier Laumonier 2010-2011
 *
 * Since : 
 * Author : Xavier Laumonier
 *
 **********************************/

(function(){

	if ( !ajsf || !ajsf.forms )
	{
		return;
	}
	
	if ( !ajsf.color )
	{
		// Inspired from http://blog.lotusnotes.be/domino/archive/2007-08-04-javascript-color-functions.html/$file/color-grades1.html
		ajsf.color = {
				
			rgb:function(a) {
				a = a.toLowerCase().split('#').join() ;
				return [parseInt(a.slice(0,2),16),parseInt(a.slice(2,4),16),parseInt(a.slice(4),16)] ;
			},
			
			shade:function(a,b){
				var v=[] , i ;
				
				for(i=0;i<3;i++)
				{
					v[i]=Math.round(a[i]/b);
					if(v[i]>255)v[i]=255;
					if(v[i]<0)v[i]=0;
				}
				return v ;
			},
					
			hex:function(a){
				var f= ajsf.color._hex;
				
				return f(a[0])+f(a[1])+f(a[2]) ;
			},
			
			_hex:function(a){
				return ('0'+a.toString(16)).slice(-2)
			}
		};
	}
			
	/**
	 * Creates a new color picker instance
	 * @param input HTMLFormFieldElement The text input field for the color
	 */
	ajsf.forms.ColorPicker = ajsf.Class.extend({
		
		color: '000000',
		
		pop: null,
		
		opened: false,
		
		input: null,
		
		fromInput: null,
		
		form: null,
		
		grid: null,
		
		example: null,
		
		construct: function ( input ) {
			
			this.input = input ;
			
			input.setAt('restrict', '#0-9A-Fa-f') ;
			input.setAt('maxlength', '#') ;
			
			input.on ('click',ajsf.delegate(this,'_onClick')) ;
			
			this.color = this.getColor(this.input.value) ;
			
			this.update () ;
			
		},
		
		getColor: function (color)
		{
			color = color.toLowerCase().replace(/([^0-9a-f])/g,"");
			
			if ( color == '' || ( color.length != 3 && color.length != 6 ) )
			{
				color = '000000' ;
			} else if ( color.length == 3 ) 
			{
				var col = color.split('');
				color = col[0]+col[0]+col[1]+col[1]+col[2]+col[2];
			}
			
			return color ;
		},
		
		_onClick: function (e) {
			if ( !this.opened )
			{
				this.opened = true ;
				this.pop = new ajsf.popup.InnerPopup ( this.input ) ;
				this.pop.getContainer().append(this.getHTML ());
			} else {
				this.opened = false ;
				this.pop.destroy () ;
				this.pop = null ;
				this.fromInput = null ;
				this.form = null ;
				this.grid = null ;
				this.example = null ;
				this._oldBaseGridColor = null ;
				
			}
		},
		
		getHTML: function ()
		{
			var form = ajsf.create ( null, 'form' ) ,
				colors = ajsf.create ( null, 'div', 'expanded' ) ,
				grad = ajsf.create ( null, 'div' , 'expanded color-picker-grad' ),
				input = ajsf.create ( null , 'input' , 'marged' ), 
				example = ajsf.create ( null , 'div' , 'right' ), 
				delUpdate = ajsf.delegate(this,'updateFromPicker') ;
			
			this.fromInput = input ;
			this.form = form ;
			this.grid = colors ;
			this.example = example ;
			
			this.grid.setSize(100,100);
			this.example.setSize(50,50);
			
			this.createGrid( (this.color == '000000' ? 'ffffff' : this.color ) );

			this._updateExample(this.color);
			
			form.on ('submit', delUpdate) ;
			input.on ('change', delUpdate) ;
			input.on ('keyup', delUpdate);
		
			input.value = this.input.value.split('#').join('');

			input.setAt('restrict', '0-9A-Fa-f');
			input.setAt('maxlength', '6');
			input.setAt('type', 'text');
			
			form.append(colors).append(example).append(grad).append(input);
				
			return form;
			
		},
		
		_oldBaseGridColor: null,
		
		createGrid: function ( baseColor )
		{
			
			if ( baseColor == this._oldBaseGridColor ) return ;
			
			this._oldBaseGridColor = baseColor ;

			this.grid.empty () ;
			
			var i = -50, e,
				f1 = ajsf.color.hex,
				f2 = ajsf.color.shade;
			
			rgbColor = ajsf.color.rgb(this.getColor(baseColor));
			for ( i ; i < 6 ; i ++ )
			{
				e = ajsf.create(null,'div','left') ;
				
				if ( i == -50 )
				{
					color = baseColor;
					e.setAt('style','width: 50px;height: 50px;background:#'+color+'');
				} else if ( i == 5 )
				{
					color = '000000';
					e.setAt('style','width: 10px;height: 10px;background:#'+color+'');
				} else {
					color = f1(f2(rgbColor,(55+i)/10)) ;
					e.setAt('style','width: 10px;height: 10px;background:#'+color+'');
				}

				e.setAt('data-color', color);
				e.delegator = this ;
				
				e.on ('mouseover', ajsf.delegate(this,'_onThumbOver'));
				e.on ('mouseout', ajsf.delegate(this,'_onThumbOut'));
				e.on ('click', ajsf.delegate(this,'_onThumbClick'));
				this.grid.append(e) ;
			}
		},
		
		_onThumbOver: function (e)
		{
			this._updateExample(this.__caller.getAt('data-color'));
		},

		_onThumbOut: function (e)
		{
			this._updateExample(this.color);
		},
		
		_onThumbClick: function (e)
		{
			this.fromInput.value = this.__caller.getAttribute('data-color') ;
			this.updateFromPicker() ;
		},
		
		destroy: function ()
		{
			if ( this.opened )
			{
				this._onClick () ;
			}

			this.pop = null ;
			this.fromInput = null ;
			this.form = null ;
			this.input = null ;
			this.grid = null ;
			this.example = null ;
		},
		
		updateFromPicker: function ()
		{
			if (!this.fromInput)
			{
				return ;
			}
			
			var color = this.fromInput.value.toLowerCase() ;
			
			if (/([^0-9a-f])/g.test(color) || !/([0-9a-f]{3})|([0-9a-f]{6})/g.test(color) )
			{
				this.fromInput.addClass('invalid').remClass('valid');
			} else {
				this.fromInput.remClass('invalid').addClass('valid');
			}
			
			if ( this.fromInput )
			{
				this.color = this.getColor(color) ;
				
			}
			
			this._updateExample(this.color);
			
			this.input.value = '#' + this.color ;
			
			this.update () ;

			this.createGrid( (this.color == '000000' ? 'ffffff' : this.color ) );

		},
		
		update: function ()
		{
			if ( this.input )
			{
				this.input.setAt('style','background-color:' +this.input.value+' !important;font-size:0;line-height; 0;');
			}
		},
		
		_updateExample: function (color)
		{
			if ( this.example )
			{
				this.example.setAt('style','width: 50px;height: 50px;background:#'+color);
			}
		}
		
		
	});
})() ;
