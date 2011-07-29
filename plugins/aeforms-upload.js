
/**********************************
 * AJSF - Aenoa Javascript Framework
 * (c) Xavier Laumonier 2010-2011
 *
 * Since : 
 * Author : Xavier Laumonier
 *
 **********************************/



(function (){
	
	
	if ( !ajsf )
	{
		ajsf = {} ;
	};
	
	if ( !ajsf.forms )
	{
		ajsf.forms = {} ;
	};

	ajsf.forms.UploadForm =  ajsf.Class.extend({
		
		construct: function ( input )
		{
			this._input = input ;
			this._iframe = null ;
			this._popin = null;
			this._button = null ;
			
			this._create () ;
	
			input.on ('validation',ajsf.delegate(this,'_updateValid'));
			
			input.form.on('beforeSubmit', function(e){
				this._destroy () ;
			});
			
		},

		_updateValid: function ()
		{
			if ( this._preview && this._input )
			this._preview.setClass(this._input.getClass ());
		},
		_updatePreview: function ()
		{
			this._preview.setAt('src', this._input.getAt('data-base-url') + this._input.value) ;
			this._refresh () ; 
		},
		
		
		_create: function () {
			
			if ( !this._input.hasAts('data-base-url','data-upload-url','data-upload-message','data-close-upload-message') )
			{
				return;
			}
			
			
			this._preview = ajsf.create(null,'img') ;
			this._preview.setAt('style','border: 0;max-height: 50px;max-width: 100px;');
			this._preview.addListener('load',$.delegate(this,'_refresh'));
			
			this._button = ajsf.create(null,'input') ;
			this._button.setAt('type','button');
			this._button.setAt('value',this._input.getAt('data-upload-message'));
			this._button.addListener('click',$.delegate(this,'_show'));

			this._input.updatePreview = $.delegate(this,'_updatePreview');
			this._input.form.on('beforeSubmit',$.delegate(this,'_destroy'));

			this._input.getParent().appendChild(this._preview);
			this._input.getParent().appendChild(this._button);
			
			this._updatePreview () ;
			
		},
		
		_destroy: function () {
			if ( this._iframe ) this._iframe.destroy () ;
			this._iframe = null ;
			if ( this._button ) this._button.destroy () ;
			this._button = null ;
			if ( this._preview ) this._preview.destroy () ;
			this._preview = null ;
			this._input = null ;
		},
		
		_show: function ()
		{
			if ( !this._iframe )
			{

				this._iframe = ajsf.create(null,'iframe','hidden') ;
				
				this._iframe.setAt('data-behavior','as-input');
				this._iframe.setAt ('src', this._input.getAt('data-base-url') + this._input.getAt('data-upload-url') ) ;
				
				this._input.getParent().appendChild(this._iframe);
				
			}
			
			if ( !this._iframe.isVisible () )
			{
				this._button.value = this._input.getAt('data-close-upload-message') ;
				this._refresh () ;
				this._iframe.show () ;
			} else {
				this._button.value = this._input.getAt('data-upload-message') ;
				this._hide () ;
			}
		},
		
		_hide: function ()
		{
			this._button.value = this._input.getAt('data-upload-message') ;
			this._iframe.hide () ;
		},
		
		_refresh: function ()
		{
			var l = this._button.right(true,this._input.form) + 10 ;
			if (this._iframe)
			{
				this._iframe.setAt('style','margin:10px;padding:0;width:100%;min-height:30px;max-height: 200px; height: auto;');
			}
		}
			
			
		
			
	});
	
	
}() ); 