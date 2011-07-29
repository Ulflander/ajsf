

(function (){

	/**
	 * Create a new dynamic table management system
	 * @param formObject ajsf.forms.Form Ajaxized form object
	 * @param table The table DOM element
	 * 
	 */
	ajsf.DynamicTable = ajsf.Class.extend({
		
		construct: function ( formObject, table ) {
		
			this._f = formObject ; 

			this._t = table ;

			this._refresh ( false ) ;

			var instance = this;
			
			this._t.getParent().on('ajaxUpdate', function(e){
				instance._refresh ( ) ;
			}) ; 
			
			this._del = ajsf.delegate(this,'submit');
			
		},
		
		_refresh: function ( isRefresh )
		{
			var el = this._t ;
			
			el.setAt('data-dyn-table','done');
			
			el = el.getParent () ;
			
			if ( el.toString() == '[object HTMLFormElement]' )
			{
				el = el.getParent () ;
			}
			
			if ( el.getParent().hasClass('ajsf-table-container') )
			{
				el = el.getParent () ;
			}
			
			
			if ( !el || el == _d)
			{
				return ;
			}
			
			
			this._f.setUpdateContainer(el) ;

			ajsf.extend(this._f.getInput(0)).on ('keyup', ajsf.delegate(this,'_onKeyup'));
			
			// Clickable headers
			var tabLayout = new ajsf.TabLayout ('current','') ;
			tabLayout.createAjaxTabs ( _u('.table-options',this._t.getParent(),false,false) ,el, true )
						.createAjaxTabs ( _u('thead',this._t,false,false) , el, true )
						.createAjaxTabs ( _u('ul',_u('tfoot',this._t)) ,el, true ) ;

			this._f.getInput(0).focus () ;
			
			return el ;
		},
		
		_onKeyup: function (e)
		{
			ajsf.undelayed(700,this._del);
			ajsf.delayed(700,this._del);
		},
		submit: function ()
		{
			this._f.submit () ;
		}
	});
}) () ;
