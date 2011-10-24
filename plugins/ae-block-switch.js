(function(){

	/*
		Class: ajsf.AeBlockSwitch

		Let's create a block switch, given the button, the container, the opened class nameand the closed class name.

	*/

	ajsf.AeBlockSwitch = ajsf.AbstractEvtDispatcher.extend({


		construct: function ( options )
		{
			this._button = null ;
			this._el = null ;

			// True: open, false: closed
			this._state = false ;

			this._openedClass = '' ;
			this._closedClass = '' ;

			this._del = ajsf.delegate(this, 'update') ;

			ajsf.expandOptionsToClass(this, options) ;

			this._state = !this._state ;
			this.update () ;
		},

		open: function ()
		{
			this._state = false ;
			this.update () ;
		},

		close: function ()
		{
			this._state = true ;
			this.update () ;
		},

		update: function (e)
		{
			if ( !this._el )
			{
				return;
			}

			ajsf.prevent(e);

			if ( this._state )
			{
				this._state = false ;
				this._el.hide() ;
			} else {
				this._state = true ;
				this._el.show() ;
			}

			this._setClass () ;
		},

		_setClass: function ()
		{
			if ( !this._button )
			{
				return;
			}

			this._button.setClass( this._state ? this._openedClass : this._closedClass ) ;
		},


		destroy: function ()
		{
			this.setButton(null);
			this.setElement(null);
		},


		setButton: function ( button )
		{
			if ( this._button )
			{
				this._button.remListener('click',this._del) ;
			}

			this._button = button ;

			this._button.on('click',this._del) ;


			return this ;
		},

		getButton: function ()
		{
			return this._button ;
		},



		setElement: function ( element )
		{
			this._el = element ;

			if ( this._el )
			{
				this._state = this._el.isVisible () ;

				
				this._setClass () ;
			}

			return this ;
		},

		getElement: function ()
		{
			return this._el ;
		},



		setOpenedClass: function ( classname )
		{
			this._openedClass = classname ;

			return this ;
		},

		getOpenedClass: function ()
		{
			return this._openedClass ;
		},



		setClosedClass: function ( classname )
		{
			this._closedClass = classname ;

			return this ;
		},

		getClosedClass: function ()
		{
			return this._closedClass ;
		}


	}) ;


})();