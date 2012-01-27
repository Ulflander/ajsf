
/**********************************
 * AJSF - Aenoa Javascript Framework
 * (c) Xavier Laumonier 2010-2011
 *
 * Since : 
 * Author : Xavier Laumonier
 *
 **********************************/

(function(){
	
	/*
		Class: ajsf.Sound
	*/
	 
	ajsf.Sound = ajsf.Class.extend({
		
		/*
			Constructor: construct
		
			Creates a new sound instance
		
			Parameters:
				param url - [string] The URL of the sound
				autoplay - [boolean] Should the sound be played now (default true)
				loop
		*/
		construct: function ( url, autoplay, loop ) {
			this._url = url ;
			this._container = ajsf.create(null,'div')
								.stylize('position','absolute')
								.setLeft(-1000);
			
			this._sound = ajsf.create(null,'embed')
						.setAt('type',this._getMimeType())
						.setAt('loop',(loop === true));
			
			_d.body.appendChild( this._container );
			if ( autoplay !== false )
			{
				this.replay () ;
			}
		},

		/*
			Function: setURL
		
			Set the sound URL
		
			Parameters:
				url
		
			Returns:
			Current instance for chained commands on this element
		*/
		setURL: function ( url )
		{
			this._url = url ;
			return this;
		},
		
		/*
			Function: getURL
		
			Get the current sound URL
		
			Returns:
			string The current URL of the sound
		*/
		getURL: function ()
		{
			return this._url ;
		},
		/*
			Function: replay
		
			Replay the sound
		
			Returns:
			Current instance for chained commands on this element
		*/
		replay: function ()
		{
			this._container.empty();
			this._container.appendChild(this._sound.setAt('src',this._url).setAt('autostart',true));
			return this;
		},
		/*
			Function: destroy
		
			Destroy the sound
		
			Returns:
		*/
		destroy: function ()
		{
			this._container.destroy();
			this._sound.destroy () ;
		},

		/*
			Function: _getMimeType
			
			Returns:
		
			Private
		*/
		_getMimeType: function ()
		{
			var mimeType = "application/x-mplayer2";
			
			if (navigator.mimeTypes 
						&& ua.toLowerCase().indexOf("windows")==-1 
						&& navigator.mimeTypes["audio/mpeg"]
						&& navigator.mimeTypes["audio/mpeg"].enabledPlugin)
			{
				mimeType="audio/mpeg"
			}
			
			return mimeType ;
		}
		
	});
})() ;
