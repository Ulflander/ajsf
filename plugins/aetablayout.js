
/**********************************
 * AJSF - Aenoa Javascript Framework
 * (c) Xavier Laumonier 2010-2011
 *
 * Since : 
 * Author : Xavier Laumonier
 *
 **********************************/

/*
	Package: ajsf.aetablayout
*/
(function(){
	
	/*
	 	Class: ajsf.TabLayout
	 	
	 	This class provides methods to quicly create tabs, ajax navigation menu...
	 	
	 	Extends: ajsf.AbstractEvtDispatcher
	*/
	ajsf.TabLayout = ajsf.AbstractEvtDispatcher.extend({
		
		/*
			Constructor: construct
		
			Creates a new tab layout object
		
			Parameters:
				openedClass - [string] 
				closedClass - [string] 
		
		 */
		construct: function ( openedClass, closedClass ) {
		
			this.openedClass = openedClass ;
			
			this.closedClass = closedClass ;
			
			this._tabs = [] ;
			
			this._ID = ajsf.TabLayout.getUniqueID () ;
			
			this._l = 0 ;
	
			this._current = null ;
			
			this._ajaxContainer = null ;
			
			this._curIndex = -1 ;
			
			this._hideIndex = -1 ;
			
			this._nextURL = null ;
			
			this._nextTab = -1 ;
		},
		
		/*
			Function: getNextURL
			
			Returns:
			The URL to be dispatched next
		 */
		getNextURL: function ()
		{
			return this._nextURL ;
		},

		/*
			Function: getNextURL
			
			Returns:
			The URL to be dispatched next
		 */
		getNextTab: function ()
		{
			return this._nextTab ;
		},
		/*
			Function: setAjaxContainer
		
			Parameters:
				container
		
			Returns:
			Current instance for chained commands on this element
		*/
		setAjaxContainer: function (container)
		{
			this._ajaxContainer = container ;

			return this;
		},
		/*
			Function: getLength
		
			Returns:
			Number of tabs in this tab layout
		*/
		getLength: function ()
		{
			return this._l ;
		},
		/*
			Function: getCurrentIndex
		
			Returns:
			Current selected index
		*/
		getCurrentIndex: function ()
		{
			return this._curIndex;
		},
		/*
			Function: getCurrentHiddenIndex
		
			Returns:
			Last selected index
		*/
		getCurrentHiddenIndex: function ()
		{
			return this._hideIndex;
		},

		/*
			Function: createAjaxTabs
		 	
			Parameters:
				listContainer - Container for the menu list 
				updateContainer - Container that should be updated
				avoidUpdate - Do not update with first tab automatically
				element - String tag name to get to retrieve urls
		
			Returns:
			Current instance for chained commands on this element
		*/
		createAjaxTabs: function ( listContainer , updateContainer , avoidUpdate , element )
		{
			if ( !listContainer )
			{
				return this ;
			}
			
			if ( updateContainer )
			{
				this._ajaxContainer = updateContainer ;
			}

			var elems = _('li,td,th', listContainer, false, true ),
				i = 0 ;
				
			if ( elems.length == 0 )
			{
			    elems = _('a', listContainer, false, true ) ;
			    
			    for ( i in elems )
			    {
				    var link = elems[i],
					    t;

				    if ( link )
				    {
					    t = new ajsf.AjaxTabElement ( this, elems[i] , link, this._l ) ;
					    this._onAdd(t,true,avoidUpdate);
				    }
			    }
			
			    return this;
			}
			
			for ( i in elems )
			{
				var link = _(element || 'a',elems[i],false,false),
					t;
					
				if ( link )
				{
					t = new ajsf.AjaxTabElement ( this, elems[i] , link, this._l ) ;
					this._onAdd(t,true,avoidUpdate);
				}
			}
			
			return this;
		},
		
		getAjaxContainer: function ()
		{
			return this._ajaxContainer ;
		},
			
		/*
			Function: addTab
		
			Parameters:
				button - Undocumented
				container - Undocumented
		
			Returns:
			Current instance for chained commands on this element
		*/
		addTab: function ( button, container )
		{
			if ( !this.getContainer ( button ) )
			{
				var t = new ajsf.TabElement ( this, button , container, this._l ) ;

				this._onAdd(t,true);
				
			}
			return this;
		},
		/*
			Function: addAjaxTab
		
			Parameters:
				button
				avoidUpdate
		
			Returns:
			Current instance for chained commands on this element
		*/
		addAjaxTab: function ( button , avoidUpdate )
		{
			if ( !this.getContainer ( button ) )
			{
				var  link = button, t ;
				
				if ( link.hasAt('href') == false )
				{
					link = _('a',button,false,false);
					if ( link.hasAt('href') == false )
					{
						return;
					}
				}
				t = new ajsf.AjaxTabElement ( this, button , link, this._l ) ;
				
				this._onAdd(t,true,avoidUpdate);
				
				
			}
			return this;
			
		},
		/*
			Function: _onAdd
		
			Parameters:
				t
				unselect
				avoidUpdate
			 
			Private
		*/
		_onAdd: function ( t , unselect , avoidUpdate)
		{

			this._tabs.push( t ) ;

			if ( avoidUpdate !== true )
			{
				if ( this._l == 0 )
				{
					this.selectTab(0); 
				} else if (unselect === true )
				{
					this.unselectTab(this._l) ;
				}
			}
			this._l ++ ;

		},
		
		/*
			Function: remTab
		
			Parameters:
				buttonOrContainer
		
			Returns:
		*/
		remTab: function ( buttonOrContainer )
		{
			var t = this.getTabElement(container) ;
			
			if ( t )
			{
				t.button.remClass(this.openedClass);
				t.button.remClass(this.closedClass);
				t.container.show () ;
				this._tabs.splice( t.index, 1 ) ;

				this._l -- ;
				
				return false;
			}
			
			return true ;
		},
		
		/*
			Function: selectTabByUrl
		
			Parameters:
				url
		
			Returns:
			Current instance for chained commands on this element
		*/
		selectTabByUrl: function ( url )
		{
			var i ;
			this._tabs.forEach ( function (el) {
				if ( el.url && (el.url.indexOf(url) === 0 || url.indexOf(el.url) === 0 ) )
				{
					i = el.index ;
				}
			}) ;
			if ( i )
			{
				this.selectTab(i);
			}

			return this;
		},
		/*
			Function: selectTab
		
			Parameters:
				tabIndex - [int] Index of the tab to select
				dispatchGlobal - [boolean] Do dispatch document event beforeAjaxTabUpdate (default: true)
			 
			Returns:
			Current instance for chained commands on this element
		*/
		selectTab: function ( tabIndex , dispatchGlobal )
		{
			var i = ( tabIndex >= 0 && tabIndex < this._tabs.length ? tabIndex : 0 ),
				t = this._tabs[i] ;
			
			if ( !t || this._curIndex == i ) return this;
			
			this._nextURL = t.url ;
			this._nextTab = i ;

			ajsf.TabLayout.current = this ;
			
			if ( (this._nextURL && dispatchGlobal !== false && !_d.dispatch('beforeAjaxTabUpdate') ) || !this.dispatch('beforeChange') )
			{
				return this;
			}
			

			if ( t.url && t.url != _(this._ajaxContainer).getLastUpdateURL() )
			{
				if ( !_(this._ajaxContainer).update ( t.url , {}, false, false, false, dispatchGlobal ) )
				{
					return this ;
				}
			}
			
			if ( !this.unselectCurrent() || !t.button.dispatch ('tabselected') ) return this;
			
			if ( t.button.dispatch ('tabshow') && this.dispatch('change') )
			{
				t.button.addClass(this.openedClass);
				t.button.remClass(this.closedClass);

				this._curIndex = tabIndex ;
				
				if ( t.url )
				{
					this._ajaxContainer.show () ;
				} else if(t.container)
				{
					t.container.show () ;
				}
				
				this._current = t ;
				
				this._tabs.forEach ( function (tabElement) {
					tabElement.button.dispatch('tabchange');
				}) ;
			}
			

			this.dispatch('changed');

			return this;
		},
		/*
		 	Function: selectFirst
		 	
		 	Select the first visible tab in the tabList (only for non-ajax tabs)
		 	
		 	Parameters:
		 		
		 	
		 	Returns:
		 	Current instance for chained command on this element
		 */
		selectFirst: function ( startIndex )
		{
			var i = startIndex || 0 , l = this._tabs.length, tab ;
			
			for ( i; i < l ; i ++ )
			{
				var tab = this._tabs[i] ;
				if ( !tab.isAjax && tab.button.isVisible () )
				{
					this.selectTab(i);
					break;
				}
			}
			
			return this;
		},
		/*
		 	Function: getCurrentContainer
		 	
		 	Returns the current show container
		 	
		 */
		getCurrentContainer: function ()
		{
			return this._current.container ;
		},
		/*
			Function: selectLastTab
		
			Returns:
		*/
		selectLastTab: function ()
		{
			return this.selectTab(this._tabs.length-1);
			
		},
		
		/*
			Function: reselectCurrent
		*/
		reselectCurrent: function ()
		{
			if ( this._lastCurrent )
			{
				this._current = this._lastCurrent ;
				var t = this._tabs[this._current.index] ;
				t.button.addClass(this.openedClass);
				t.button.remClass(this.closedClass);
			}
		},
		
		/*
			Function: unselectCurrent
		
		
			Returns:
		*/
		unselectCurrent: function (  )
		{
			if ( this._current )
			{
				this._lastCurrent = this._current;
				if ( !this.unselectTab(this._current.index) ) return false ;
				this._current = null ;
			}
			return true ;
		},
		
		/*
			Function: unselectTab
		
			Parameters:
				tabIndex - [int] The tab index
				
			Returns:
			True if tab is hidden, false otherwise
		*/
		unselectTab: function ( tabIndex  )
		{
			var i = ( tabIndex >= 0 && tabIndex < this._tabs.length ? tabIndex : 0 ),
			t = this._tabs[i] ;
		
			if ( t && t.button.dispatch ('tabunselected') )
			{
				
				this._hideIndex = tabIndex ;
				
				if ( t.button.dispatch ('tabhide') )
				{
					if ( t.url && this._ajaxContainer )
					{
						this._ajaxContainer.hide () ;
					} else if ( t.container )
					{
						t.container.hide () ;
					}
					t.button.remClass(this.openedClass) ;
					t.button.addClass(this.closedClass) ;

					
					return true ;
				}
			}
			
			return false;
		},
		
		/*
			Function: getContainer
		
			Parameters:
				button
			
			Returns:
		*/
		getContainer: function ( button )
		{
			var e = this.getTabElement(button) ;
			if ( e )
				return e.container ;
		},

		/*
			Function: getButton
		
			Parameters:
				container
		
			Returns:
		*/
		getButton: function ( container )
		{
			var e = this.getTabElement(container) ;
			if ( e )
				return e.button ;
		},
		
		/*
			Function: getTabElement
		
			Parameters:
				buttonOrContainer
		
			Returns:
		*/
		getTabElement: function (buttonOrContainer)
		{
			var t ;
			this._tabs.forEach ( function (tabElement) {
				if ( tabElement.button == buttonOrContainer || tabElement.container == buttonOrContainer)
				{
					t = tabElement;
				}
			}) ;
			return t ;
		},
		
		/*
			Function: getTab
		
			Parameters
				tabIndex
			 
			Returns:
		*/
		getTab: function ( tabIndex )
		{
			return ( tabIndex >= 0 && tabIndex < this._tabs.length ? this._tabs[tabIndex] : null );
		},
		
		/*
			Function: destroy
		*/
		destroy: function ()
		{
			while ( this._tabs.length > 0 )
			{
				this.remTab(this._tabs[0].button);
			}
			this._tabs = null ;
			
			this._current = null ;
		}
	}) ;

	
	ajsf.TabLayout.current = null ;
	ajsf.TabLayout.unik___ = -1 ;
	ajsf.TabLayout.getCurrent = function ()
	{
		return ajsf.TabLayout.current ;
	};
	ajsf.TabLayout.getUniqueID = function ()
	{
		ajsf.TabLayout.unik___ ++ ;
		return ajsf.TabLayout.unik___ ;
	};

	/*
	 	Class: ajsf.TabElement
	*/
	ajsf.TabElement = ajsf.Class.extend({
		
		/*
			Constructor: construct
		
			Parameters:
				tabLayout
				button
				container
				index
		*/
		construct: function ( tabLayout, button, container, index ) {
			
			this._layout = tabLayout ;
			this.button = button ;
			this.container = container ;
			this.index = index ;
	
			button.on ( 'click', ajsf.delegate(this,'show') ) ;
		},
		/*
			Function: show
		
			Parameters:
				e
		*/
		show: function (e)
		{
			this._layout.selectTab(this.index);
			ajsf.prevent(e);
		},
		
		/*
			Function: getButton
		
			Returns:
		*/
		getButton: function ()
		{
			return this.button ;
		},
		
		/*
			Function: hide
		*/
		hide: function ()
		{
			this._layout.unselectTab(this.index);
		},
		
		/*
			Function: setTitle
		
			Parameters:
				title
		*/
		setTitle: function ( title )
		{
			this.button.html ( title ) ;
		},
		
		/*
		Function: destroy
		*/
		destroy: function ()
		{
			this._layout = null ;
			this.button = null ;
			this.container = null ;
		}
	});
		

	/*
	 	Class: ajsf.AjaxTabElement
	*/
	ajsf.AjaxTabElement = ajsf.TabElement.extend({
		
		/*
			Constructor: construct
		
			Parameters:
				tabLayout
				button
				a
				index
		*/
		construct: function ( tabLayout, button, a, index ) {
			
			this._layout = tabLayout ;
			this.button = button ;
			this.url = a.hasAt('data-href') ? a.getAt('data-href') : a.href ;
			this._a = a ;
			this.index = index ;
			
			var evt = 'click' ;
			if ( this._a.hasAt('data-href') )
			{
				evt = 'change' ;
			}
			
			this._a.on ( evt, ajsf.delegate(this,'show') ) ;
			
		},

		/*
			Function: getLinkEl
		
			Returns:
		*/
		getLinkEl: function ()
		{
			return this._a ;
		},
		
		/*
			Function: show
		
			Parameters:
				e
		*/
		show: function (e)
		{
			if ( this._a.hasAt('data-href') )
			{
				if ( this._a.value )
				{
					this._layout.selectTab(this.index);
				}
			} else {
				this._super(e) ;
			}
			
		},
		
		/*
			Function: isAjax
			
			Returns
			[boolean] True
		 */
		isAjax: function ()
		{
			return true ;
		}
	
	});

	

	
})() ;
