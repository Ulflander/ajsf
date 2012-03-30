(function(){

	if ( !window.ajsf )
	{
		return;
	}

	ajsf.Focus = ajsf.AbstractEvtDispatcher.extend({
		construct: function ()
		{
			this.el = null ;

			if ( ajsf.isIE )
			{
				_(document).on('focusout', ajsf.delegate(this,function(){
					
					if ( this.el != document.activeElement )
					{
						this.el = document.activeElement;
					} else {
						ajsf.delegate(this, '_onFocusOut');
					}

				} ) ) ;
				_(document).on('focusin', ajsf.delegate(this, '_onFocusIn') ) ;
			} else {
				_(window).on('blur', ajsf.delegate(this, '_onFocusOut') ) ;
				_(window).on('focus', ajsf.delegate(this, '_onFocusIn') ) ;
			}

			this.has = true ;
		},

		hasFocus: function ()
		{
			return this.has ;
		},

		_onFocusIn: function ()
		{
			this.has = true ;

			this.dispatch('focusin') ;
		},

		_onFocusOut: function ()
		{
			this.has = false ;
			
			this.dispatch('focusout') ;
		}
	}) ;


})();

