 
/**********************************
 * AJSF - Aenoa Javascript Framework
 * (c) Xavier Laumonier 2010-2011
 *
 * Since : 
 * Author : Xavier Laumonier
 *
 **********************************/


(function (){
	
	if (!ajsf)
	{
		ajsf = {} ;
	}
	

	/*
		Package: ajsf.extended
	*/

	var extended = {

			
		/*
			Variable: _rdupdates
			
			Array of DOM elements to update date
			
			Private
		*/
		_rdupdates: [],
		
		/*
			Variable: _rdd
			
			Delegation method for _initRelDatUp
			
			
			Private
		*/
		_rdd: null,
		
		/*
			Variable: _rdi
			
			Is relative dates running or not (use to hasRelDateUpdate function instead of this variable)
			
			Private
		*/
		_rdi: false,
			
		/*
		 	Function: hasClipboard
		 	
		 	Save a text into the clipboard
		 	
		 	Parameters:
		 		text - [string] Text to copy into clipboard
		 	
		 	Returns:
		 	[boolean] True if clipboard copy is available, false otherwise
		*/
		hasClipboard: function (text)
		{
			if ( _w.clipboardData )
			{
				return true ;
			}
			
			try
			{
				// On test si la configuration permet l'accès au presse-papier.
				netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
				var gClipboardHelper =
					Components.classes["@mozilla.org/widget/clipboardhelper;1"]
					.getService(Components.interfaces.nsIClipboardHelper);
				return true ;
				
			}catch (e){}
			
			return false ;
		},
		
		
		/*
		 	Function: clipboard
		 	
		 	Save a text into the clipboard
		 	
		 	Parameters:
		 		text - [string] Text to copy into clipboard
		 	
		 	Returns:
		 	[boolean] True if clipboard copy is available, false otherwise
		*/
		clipboard: function (text)
		{
			if ( _w.clipboardData )
			{
				_w.clipboardData.setData('Text', text);
				return true ;
			} else {
				try
				{
					// On test si la configuration permet l'accès au presse-papier.
					netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
					var gClipboardHelper =
						Components.classes["@mozilla.org/widget/clipboardhelper;1"]
						.getService(Components.interfaces.nsIClipboardHelper);
					
						gClipboardHelper.copyString(sText);
						return true ;
				}
				catch (e){}
				
			}
			return false;
		},
			
			
			
		/*
			Function: relDat
			
			Parameters:
				time_value
				
			Returns:
		*/
		relDat: function (time_value) {
			return this.relTime ( Date.parse(time_value) / 1000 ) ;
		},
		/*
			Function: relTime
			
			Return a string containing relative date since time_value
			
			Parameters:
				time_value - [int] In seconds, NOT MILLISECONDS
				useOffset
				
			Returns:
		*/
		relTime: function (time_value, useOffset) {
			var rel_to = new Date(),
				delta = parseInt((rel_to.getTime() / 1000 - parseFloat(time_value)));
			
			if ( useOffset === true )
				delta = delta + (rel_to.getTimezoneOffset() * 60);

			if (delta < 60) {
				return 'less than a minute ago';
			} else if(delta < 120) {
				return 'about a minute ago';
			} else if(delta < (4*60)) {
				return 'a few minutes ago';
			} else if(delta < (60*60)) {
				return (parseInt(delta / 60)).toString() + ' minutes ago';
			} else if(delta < (120*60)) {
				return 'about an hour ago';
			} else if(delta < (36*60*60)) {
				return 'about ' + (parseInt(delta / 3600)).toString() + ' hours ago';
			} else if(delta < (48*60*60)) {
				var i =- Math.round((24*60*60-delta) / 3600) ;
				if ( i != 0 )
					return '1 day and ' + i + ' ' +(i==1?'hour':'hours')+ ' ago';
				else return '1 day ago' ;
			} else if(delta < (72*60*60)) {
				var i =- Math.round((48*60*60-delta) / 3600) ;
				if ( i != 0 )
					return '2 days and ' + i + ' ' +(i==1?'hour':'hours')+ ' ago';
				else return '2 days ago' ;
			} else {
				return (parseInt(delta / 86400)).toString() + ' days ago';
			}
		},
		
		/*
			Function: secTimeToDate
			
			Parameters:
				time
			
			Returns:
		*/
		secTimeToDate: function (time)
		{
			var d = new Date () ;
			d.setTime(time*1000);
			return ajsf.getLeadZero(d.getHours ()) + ':' + ajsf.getLeadZero(d.getMinutes ()) + ', ' + d.getFullYear() + '/' + ajsf.getLeadZero((d.getMonth ()+1)) + '/' + ajsf.getLeadZero(d.getDate ()) ; 
		},
			
			
		/*
			Function: registerRelDatUpdate
			
			Parameters:
				id
				element
				date
		*/
		registerRelDatUpdate: function ( id , element , date )
		{
			if ( id && element && date )
			{
				element._relDat = date ;
				this._rdupdates[id] = element ;
				element.html(this.relTime(element._relDat)) ;
				this._initRelDatUp () ;
			}
		},
			
		/*
			Function: unregisterRelDatUpdate
			
			Parameters:
				id
		*/
		unregisterRelDatUpdate: function ( id )
		{
			if ( id && this._rdupdates )
			{
				this._rdupdates[id] = null ;
				this._uninitRelDatUp () ;
			}
		},
		
		/*
			Function: _refreshRelDates
			
			Private
		*/
		_refreshRelDates: function ()
		{
			var e, k ;
			for ( k in this._rdupdates )
			{
				e = this._rdupdates[k] ;
				if (e && e._relDat )
				{
					e.html(this.relTime(e._relDat)) ;
				}
			}
		},
		
		/*
		 	Function: hasRelDateUpdate
		 	
		 	Returns:
		 	[boolean] True if one or more relative date is beeing updated, false otherwise
		 */
		hasRelDateUpdate: function ()
		{
			return this._rdi ;
		},
		
		/*
			Function: _initRelDatUp
			
			Private
		*/
		_initRelDatUp: function ()
		{
			if ( !this._rdi )
			{
				if ( this._rdd == null )
					this._rdd = this.delegate(this,"_refreshRelDates"),
				
				this.delayed(60000,this._rdd,-1);
				this._rdi = true ;
			}
		},
		
		/*
			Function: _uninitRelDatUp
			
			Private
		*/
		_uninitRelDatUp: function ()
		{
			if ( this._rdi )
			{
				this.undelayed(60000,this._rdd);
				this._rdi = false ;
			}
		},
	}, k ;
	
	
	for ( k in extended )
	{
		ajsf[k] = extended[k]; 
	}

	/*
		Package: Math.improvement
	*/

	/*
	 * 
	 	Function: Math.deg2rad
	 	
	 	Math improvement
	 	
	 	Parameters:
	 		deg
	 	
	 	Returns:
	*/
	Math.deg2rad = function (deg)
	{
		return(deg * (2.0 * Math.PI)/360.0);
	};
	/* 
	 	Function: Math.rad2deg
	 	
	 	Parameters:
	 		rad
	 	
	 	Returns:
	*/
	Math.rad2deg = function (rad)
	{
		return(rad * 360/(2.0 * Math.PI));
	};
	/* 
	Function: Math.log10
	
	Parameters:
		val
	
	Returns:
	*/
	Math.log10 = function (val)
	{
		return (Math.LOG10E * Math.log(val));
	};

	/*
		Package: Date.improvement
	*/
	
	/*
		Function: Date.prototype.getJulianDay
		
		Returns:
	*/
	Date.prototype.getJulianDay = function ()
	{
		var jd ,
			hr = this.getUTCHours() ,
			ggg = 1,
			mm = this.getUTCMonth() + 1 ,
			yy = this.getUTCFullYear() ,
			dd = this.getUTCDate(),
			s = 1 ,
			a ,
			j1 ;
		
		hr = hr + this.getUTCMinutes()/60 + this.getUTCSeconds() / 3600 ;
		if ( yy <= 1585 ) ggg = 0 ;
		jd = -1 * Math.floor(7 * (Math.floor((mm + 9) / 12) + yy) / 4);
		if ( mm - 9 < 0 ) s = -1 ;
		a = Math.abs(mm-9) ;
		j1 = Math.floor ( yy + s * Math.floor(a/7)) ;
		j1 = -1 * Math.floor((Math.floor(j1 / 100) + 1) * 3 / 4) ;
		jd = jd + Math.floor(275 * mm / 9) + dd + (ggg * j1);
		jd = jd + 1721027 + 2 * ggg + 367 * yy - 0.5;
		jd = jd + (hr/24) ;
		
		return jd ;
	};
	
	/*
		Function: Date.prototype.setJulianDay
		
		Parameters:
			jd
		
		Returns:
		Current instance for chained commands on this element
	*/
	Date.prototype.setJulianDay = function ( jd )
	{
		var	j1, j2, j3, j4, j5,			
			intgr   = Math.floor(jd),
			frac    = jd - intgr,
			gregjd  = 2299161,
			tmp,
			dayfrac,
			d, m, y, hr, mn, f, sc ;
			
		//Gregorian calendar correction
		if( intgr >= gregjd ) {
			tmp = Math.floor( ( (intgr - 1867216) - 0.25 ) / 36524.25 );
			j1 = intgr + 1 + tmp - Math.floor(0.25*tmp);
		} else
			j1 = intgr;

		//correction for half day offset
		var dayfrac = frac + 0.5;
		if( dayfrac >= 1.0 ) {
			dayfrac -= 1.0;
			++j1;
		}
		
		
		j2 = j1 + 1524;
		j3 = Math.floor( 6680.0 + ( (j2 - 2439870) - 122.1 )/365.25 );
		j4 = Math.floor(j3*365.25);
		j5 = Math.floor( (j2 - j4)/30.6001 );
		// Get day
		d = Math.floor(j2 - j4 - Math.floor(j5*30.6001));
		// Get month
		m = Math.floor(j5 - 1);
		
		if( m > 12 )	m -= 12;
		
		// Get year
		y = Math.floor(j3 - 4715);
		
		if( m > 2 )   --y;
		if( y <= 0 )  --y;

		// Get hour
		hr  = Math.floor(dayfrac * 24.0);
		// Get minute
		mn  = Math.floor((dayfrac*24.0 - hr)*60.0);
		// Get seconds
		f  = ((dayfrac*24.0 - hr)*60.0 - mn)*60.0;
		sc  = Math.floor(f);
		f -= sc;
			 
	    if( f > 0.5 )	++sc;

	    if( y < 0 )	y = -y;
	    
	    this.setUTCFullYear(y, m-1, d-1);
		this.setUTCHours(hr);
		this.setUTCMinutes(mn);
		this.setUTCSeconds(sc);
		
		return this;
	};
})() ;