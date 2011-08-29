

(function(){
	
	/**
	 * This plugin let's you create internal or external popups
	 * It's requires ACF (Aenoa CSS Framework for internal popup styles).
	 * But, if you don't want to USE ACF, you can just redefine the popClass variable.
	 */
	$.popup = {
		
		/**
		 * 
		 */
		_ipopc: "<p><a href='javascript:void(0);' title='Close popup' onclick='$.POP.dipop()'>Close</a></p><iframe id='popup_content'></iframe>" ,
		
		_popup: null,
		
		popStyle: {
			"position":"absolute",
			"width":"90%",
			"height":"80%",
			"padding": "1%",
			"top": "-100%",
			"left": "4%",
			"z-index":"2999"
		},
		
		popClass: "r-10 black-block shadowed",
		
		frameStyle: {
			"width":"100%",
			"height":"92%",
			"background":"#fff",
		},
		
		_dipop: function ()
		{
			_d.body.removeChild ( this.__popup ) ;
			this.__popup = null ;
		},
		
		_ipopUrl: null,
		
		dipop: function ()
		{
			_('#popup').tweenTo({top: -104}, "regularEaseOut", 1);
			_('#popup').addListener("motionEnd", $.delegate(this,this._dipop) ) ;
		},
		
		ipop: function ( url )
		{
			if ( this.__popup != null )
			{
				return;
			}
			
			this._ipopUrl = url ;
			
			$.delayed(50,$.delegate(this,"_ipop"))
		},
		
		_ipop: function ( )
		{
			var p = ajsf.create('popup','div');
			p.innerHTML = this._ipopc;
			_d.body.appendChild(p) ;
			_('#popup').stylize(this.popStyle) ;
			_('#popup').tweenTo({top: 0}, "regularEaseOut", 1);
			$.delayed ( 800, $.delegate(this, "_loadsrc" ) )
			return $;
		},
		
		_loadsrc: function ()
		{
			_('#popup_content').stylize(this.frameStyle) ;
			_("#popup_content").setAttribute ( "src" , this._ipopUrl );
		},
		
		epop: function ( url , popID , w , h )
		{
			w = w ? w : 300 ;
			h = h ? h : 500 ;
			var win=window.open(url,popID,'height='+w+',width='+h);
			if (window.focus) {win.focus()};
			return $;
		},
		
		destroyAll: function ()
		{
			this.detail.destroy () ;
		},
		
		/**
		 * The popup module let's you create popups with html content, associated to an element in the DOM.
		 * 
		 */
		detail: {
			
			createFromScratch: function ( element, title , htmlContent )
			{
				var popup = new ajsf.popup.InnerPopup (element) ;
				popup.getContainer().html(( title ? "<h3>" + title + "</h3>" : '' ) +  '<div id="data-popup-content">' + ( htmlContent ? htmlContent : '' ) + '</div><input type="button" onclick="javascript:$.popup.detail.destroy();" class="right" value="'+$.l10n.get('Close')+'" title="'+$.l10n.get('Close')+'" />' );
				this.current = popup ;
				return popup ;
			},
			
			onLoadDetails: function ( success , data )
			{
				var popup = new ajsf.popup.InnerPopup (this.element) ;
				this.current = popup ;
				popup.getContainer().html( this.title, $.aejax.detailToHTMLList ( data['results'] , ": " , "<strong>" , "</strong>") ) ;
				popup.refresh () ;
				return popup ;
			},
			beforeLoadDetails: function ( title , element )
			{
				this.element = element ;
				this.title = title ;
			},
			destroy: function ()
			{
				if ( this.current )
				{
					this.current.destroy () ;
					this.current = null ;
				}
			},
			current: null,
			title: null,
			element: null
		}
	};
	
	
	
	
	
	
	
	/**
	 * This is the base class of all popups.
	 */
	ajsf.popup.Dialog = ajsf.AbstractEvtDispatcher.extend({
		_title: null,
		_text: null ,
		_container: null,
		_wrapper: null,
		_button: null,
		_close: null,
		/**
		 * Constructor
		 * 
		 * @param title [string] Popup title
		 * @param text [string] Popup text or HTML content
		 * @param closeText [string] Text of the close button
		 */
		construct: function ( title , text , closeText )
		{
			ajsf.stylesheets.inject('.ajsf-dialog-wrapper{'+ajsf.stylesheets.stringify(ajsf.popup.Dialog.styles.wrapper)+'}') ;
			ajsf.stylesheets.inject('.ajsf-dialog-container{'+ajsf.stylesheets.stringify(ajsf.popup.Dialog.styles.dialog)+'}') ;
			
			this._wrapper = ajsf.create(null,'div');
			this._close = ajsf.create(null,'a','top right block icon16 close unlabeled ajsf-dialog-close') ;
			
			var container =ajsf.create(null,'div'),
				elements = ajsf.createAll([
			                            [null,'span'],
			                            [null,'div','marged p'],
			                            [null,'input','right icon16 close']],container),
			    instances = ajsf.popup.Dialog.instances,
			    del = ajsf.delegate(this,'cancel') ;
			
			this._title = elements[0];
			this._text = elements[1];
			this._button = elements[2];
			this._button.setAt('type','button');
			this._container = container ;

			this._container.appendChild(this._close);
			
			this._close.setAt('title',closeText) ;
			
			this._close.on ('click',del);
			this._button.on ('click',del);
			this._wrapper.on ('click', function ()
					{
						container.fadeIn () ;
					});
			
			
			
			this._wrapper.setAt('class','ajsf-dialog-wrapper');
			this._wrapper.setOpacity(0.4);

			this._container.setAt('class','r-5 shadowed ajsf-dialog-container');
			
			if ( instances.length < 2 )
			{
				ajsf.popup.Dialog.instances.push(this);
				ajsf.extend(_d.body).append(this._wrapper, this._container);
			} else {
				this.dispatch('unappended');
			}

			this.setCloseText ( closeText ) ;
			this.setTitle(title) ;
			this.setText(text) ;

			this.dispatch('inited');
		},
		getContainer: function ()
		{
			return this._container ;
		},
		setTitle: function ( text )
		{
			this._title.innerHTML = text ;
			return this ;
		},
		getTitle: function ()
		{
			return this._title.innerHTML ;
		},
		getTitleEl: function ()
		{
			return this._title ;
		},
		setText: function ( text )
		{
			this._text.innerHTML = text ;
			return this ;
		},
		appendToText: function ( text )
		{
			this._text.html(this._text.getHtml() + text ) ;
			return this ;
		},
		getText: function ()
		{
			return this._text.innerHTML ;
		},
		getTextEl: function ()
		{
			return this._text ;
		},
		setCloseText: function ( text )
		{
			this._button.value = text ;
			this._close.innerHTML = text ;
			return this ;
		},
		getCloseText: function ()
		{
			return this._button.innerHTML ;
		},
		getCloseBtnEl: function ()
		{
			return this._button ;
		},
		getCloseLinkEl: function ()
		{
			return this._close ;
		},
		setTextClass: function ( classname )
		{
			this._text.setClass ( classname ) ;
			return this ;
		},
		getTextClass: function ( )
		{
			return this._text.getClass ( ) ;
		},
		cancel: function ()
		{
			this.dispatch('cancel');
			this.destroy () ;
		},
		destroy: function ()
		{
			ajsf.popup.Dialog.instances = [] ;
			
			this.dispatch('destroy');
			
			this._wrapper.destroy () ;
			this._container.destroy () ;
			this._wrapper = null ;
			this._container = null ;
			this._title = null ;
			this._text = null ;
			this._close = null ;
			this._button = null ;

			if ( this._destroy )
			{
				this._destroy () ;
			}
		},
		hide: function ()
		{
			this._wrapper.hide ();
			this._container.hide ();
		},
		show: function ()
		{
			this._wrapper.show ();
			this._container.show ();
		},
		toString: function ()
		{
			return "[AJSFDialogElement]" ;
		}
		
	});


	ajsf.popup.Dialog.styles = {
		wrapper: {
			"position":"fixed",
			"top":"0",
			"bottom":"0",
			"left":"0",
			"right":"0",
			"height":"100%",
			"zIndex":"9999",
			"background":"#000000"
		},	
		dialog: {
			"position":"fixed",
			"width":"500px",
			"left":"50%",
			"marginLeft":"-250px",
			"top":"50%",
			"marginTop":"-100px",
			"zIndex":"10010",
			"border":"1px solid #aaa",
			"color":"#000",
			"overflow": "hidden",
			"background":"#eeeeee"
		},	
		innerPopup: {
			"zIndex":"10030",
		}
	};
	ajsf.popup.Dialog.instances = [] ;

	ajsf.popup.Dialog.getLength = function ()
	{
		return ajsf.popup.Dialog.instances.length ;
	}
	
	
	ajsf.popup.ConfirmDialog = ajsf.popup.Dialog.extend({
		_okBtn: null,

		construct: function ( title , text , okText , cancelText ) {
			this._super( title , text , cancelText ) ;
			this._build () ;
			this.setOKText ( okText ) ;
			return this;
		},
		setOKText: function ( okText ) {
			this._okBtn.value = okText ;
			return this;
		},
		getOKText: function ( ) {
			return this._okBtn.value ;
		},
		getOKEl: function ( ) {
			return this._okBtn ;
		},
		_build: function ()
		{
			this._okBtn = ajsf.create (null,'input','right icon16 yes') ;
			this._okBtn.setAt('type','button');
			this._okBtn.on ('click', ajsf.delegate(this,'validate')) ;
			this._container.removeChild(this._button);
			this._container.append(this._okBtn);
			this._container.append(this._button);
		},
		validate: function (e)
		{
			this.dispatch('validate');
			this.destroy () ;
		},
		_destroy: function ()
		{
			this._okBtn = null;
		},
		toString: function ()
		{
			return "[AJSFConfirmDialogElement]" ;
		}
	});
	

	ajsf.popup.Window = ajsf.popup.Dialog.extend({
		construct: function ( title , text , closeText )
		{
			this._super( title , text , closeText ) ;
			ajsf.stylesheets.inject('.ajsf-dialog-window{'+ajsf.stylesheets.stringify(ajsf.popup.Window.styles.window)+'}') ;
			this._build () ;
		},
		_build: function ()
		{
			this._container.addClass('ajsf-dialog-window');
			this._text.stylize(ajsf.popup.Window.styles.windowContent);
			this._button.hide () ;
		},
		isWindow: function ()
		{
			return true ;
		}
	});
	
	ajsf.popup.Window.styles = {
		window: {
			width: "98%",
			height: "96%",
			margin: 0,
			top: "2%",
			left: "1%",
			"zIndex":"10002",
		},
		windowContent: {
			"marginTop": "8%",
			"maxHeight": "90%",
			overflow: "auto",
			"background":"#eeeeee"
		}
	};
	
	
	ajsf.popup.instance = null ;
	
	
	ajsf.popup.InnerPopup = ajsf.Class.extend({

		
		construct: function(element)
		{

			if ( !ajsf.popup.instance )
			{
				ajsf.popup.instance = this ;
			}
			
			this.element = element ;
			this._create () ;
			this.refresh () ;
		},
		
		/**
		 * 
		 * @private
		 */
		_create: function ()
		{
			if ( this._container )
				return this._container ;

			var p = this._container = $.create(null,null,'data-popup no-list-style');
			p.setAttribute ( "style" , ajsf.popup.Dialog.styles.dialog ) ;
			
			this._arrow = $.create(null,'div','data-popup-arrow');
			
			_d.body.appendChild(this._container) ;
			_d.body.appendChild(this._arrow) ;
			
			ajsf.addScrollCB('detail', $.delegate(this,'refresh') );
			_(window).on ('resize', $.delegate(this,'refresh')) ;
			
			return this._container ;
		},
		
		getContainer: function ()
		{
			return this._container ;
		},
		
		hide: function ()
		{
			this._container.hide () ;
			this._arrow.hide () ;
		},
		
		show: function ()
		{
			if ( ajsf.popup.instance )
			{
				ajsf.popup.instance.hide () ;
				ajsf.popup.instance = this ;
			}
			this._arrow.show () ;
			this._container.show () ;
			this.refresh () ;
		},
		
		destroy: function ()
		{
			ajsf.remScrollCB( 'detail' ) ;
			
			if(this._container)
				this._container.destroy () ;
			
			if ( this._arrow )
				this._arrow.destroy () ;
			
			this._container = null ;
			this._arrow = null ;
			this.title = null ;
			this.element = null ;
			this._destroying = false ;
			this._appearing = true ;
		},
		
		refresh: function ()
		{
			var c = this._container ,
				a = this._arrow ,
				e = _(this.element) ,
				l = 0,
				al = 0,
				t = 0 ,
				oL = e.getLeft(true),
				oT = e.getTop(true),
				oW = e.w () ,
				at = 0;
			
			
			if ( !e.getLeft ){
				return;
			}
			
			
			al = oL + oW ;
			at = oT ;
			
			l = oL + oW + a.w () ;
			t = oT-50 ;
			
			c.setLeft(l);
			c.setTop(t);
			a.setLeft(al).remClass('arr-right').addClass('arr-left');
			a.setTop(at);
			if ( this._appearing == true )
			{
				this._appearing = false ;
			}
		},
		
		
		_arrow: null,
		_container: null,
		_destroying: false,
		_appearing: true
	});
})() ;
