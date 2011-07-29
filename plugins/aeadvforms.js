

/**********************************
 * AJSF - Aenoa Javascript Framework
 * (c) Xavier Laumonier 2010-2011
 *
 * Since : 
 * Author : Xavier Laumonier
 *
 **********************************/

/**********************************
 * 
 **********************************/

(function (){

	
	
$.aeforms.advanced = {
		
		geocoder: new google.maps.Geocoder(),

		
		_map: null ,
		_curRequest: null,
		_formId: null,
		_input: null,
		_container: null,
		_search: null,
		_button: null,
		_checkLabel: null,
		_check: null,
		_comment: null,
		
		latlngBehavior: function ( input )
		{
			this._input = input ; 
	
			
			if ( this._map == null )
			{
				var latlng = new google.maps.LatLng(0, 0),
					opts = {
						zoom: 2,
						center: latlng,
						mapTypeControlOptions: {
				    		mapTypeIds: [google.maps.MapTypeId.SATELLITE]
				    	},
				    	backgroundColor: '#152654' ,
						mapTypeId: google.maps.MapTypeId.HYBRID,
						keyboardShortcuts: false,
						disableDefaultUI: true,
						streetViewControl: false
				    },
				    a = $.create ('latlng-behavior-container', 'div' ),
				    b = $.create ('latlng-behavior-search', 'input' ),
				    c = $.create ('latlng-behavior-button' , 'input' , 'search' ) ,
				    d = null, z = null, 
				    y = $.create ('latlng-behavior-container', 'div' ) ;
			    
			    this._formId = input.getAttribute('id').split('/')[0] ;
			    
				this._curRequest = _('#'+ this._formId+'/'+input.getAttribute('data-behavior-georequest-field')).value ;

				if ( input.hasAt('data-behavior-georequest-manual') )
				{
					d = $.create('latlng-behavior-manual-check','input');
					d.setAt('type','checkbox');
					d.addListener('click',$.delegate(this,'_onCheckHandler')) ;
					z = $.create(null,'label');
					z.setAt('for','latlng-behavior-manual-check') ;
					z.innerHTML = input.getAt('data-behavior-georequest-manual') ;
				}
				
				this._container = a ;
				this._search = b ;
				this._button = c ;
				this._check = d ;
				this._checkLabel = z ;
				this._comment = y ;
				
			    a.h(200);
			    a.w(200);
			    
				b.setAt('type','text');
				b.setAt('value',this._curRequest);
				c.setAt('type','button');
				c.setAt('value',input.getAt('data-behavior-search') );
				c.addListener('click',$.delegate(this,'_latlngBhrGeoRequest')) ;
				
				$.popup.detail.createFromScratch ( input , (input.hasAt('data-behavior-title') ? input.getAt('data-behavior-title') : null ) );
				
				_('#data-popup-content').appendChild(b) ;
				_('#data-popup-content').appendChild(c) ;
				_('#data-popup-content').appendChild(y) ;
				_('#data-popup-content').appendChild(a) ;

				if ( input.hasAt('data-behavior-georequest-manual') )
				{
					_('#data-popup-content').appendChild(d) ;
					_('#data-popup-content').appendChild(z) ;
				}
				
				this._map = new google.maps.Map(a, opts);
				
				this._marker = new google.maps.Marker({
					map: null, 
					position: new google.maps.LatLng(0,0)
				});

			    google.maps.event.addListener(this._map, 'bounds_changed', $.delegate(this,'_updateCoordinates'));
			} else {
				this._marker.setMap(null);

				$.popup.detail.createFromScratch ( input , (input.hasAt('data-behavior-title') ? input.getAt('data-behavior-title') : null ) );
				_('#data-popup-content').appendChild( this._search ) ;
				_('#data-popup-content').appendChild( this._button ) ;
				_('#data-popup-content').appendChild( this._comment ) ;
				_('#data-popup-content').appendChild( this._container ) ;

				if ( input.hasAt('data-behavior-georequest-manual') )
				{
					_('#data-popup-content').appendChild(this._check) ;
					_('#data-popup-content').appendChild(this._checkLabel) ;
				}
				
				_('#latlng-behavior-search').value = _('#'+ this._formId+'/'+input.getAt('data-behavior-georequest-field')).value ;
			    
			}
		    
			if ( input.value == '' || input.value == input.title)
			{
				this._latlngBhrGeoRequest();
			} else {
				
				input.value = input.value.trim () ;
				
				if ( input.autoValidation () ) {
					this._updateCoordinates( new google.maps.LatLng( input.value.split(',')[0].trim() , input.value.split(',')[1].trim()) ) ;
				}
			}
		    
		},
		_onCheckHandler: function (e)
		{
			if ( this._check )
			{
				if (this._check.checked )
				{
					if ( this._input.hasAt('data-behavior-georequest-manual-message') )
					{
						this._comment.innerHTML = this._input.getAt('data-behavior-georequest-manual-message') ;
					}
					
					this._authManually = true ;
				} else {
					this._comment.innerHTML = '' ;
					this._authManually = false ;
				}
			}
		},
		_authManually: false,
		_updateCoordinates: function ( latlng )
		{
			if ( this._authManually == true )
			{
				latlng = ( latlng ? latlng : this._map.getCenter () ) ;
				this._marker.setMap(this._map);
				this._marker.setPosition( latlng );
				this.setCoordinates( latlng ) ;
			}
		},
		setCoordinates: function ( latlng )
		{
			this._input.value = latlng.lat() + "," + latlng.lng() ;
			this._input.inputValidation () ;
		},
		_latlngBhrGeoRequest: function ()
		{
			this._curRequest = _('#latlng-behavior-search').value ;
			this.geocoder.geocode( { 'address': this._curRequest} , $.delegate(this,'_ongeoRequestRespond'));
			
		},
		_marker: null,
		_ongeoRequestRespond: function (results, status)
		{
			if (status == google.maps.GeocoderStatus.OK) {
				this._map.setCenter(results[0].geometry.location);
				this.setCoordinates(results[0].geometry.location);
				this._marker.setPosition(results[0].geometry.location);
				this._marker.setMap(this._map);
				if ( this._input.hasAt('data-behavior-georequest-country') && _('#'+this._input.getAt('data-behavior-georequest-country')).value == '' )
				{
					var country = results[0].address_components.pop().long_name ,
						input = _('#'+this._formId+'/'+this._input.getAt('data-behavior-georequest-country') + '/input') ;
					
					input.value = country ;
					input.focus () ;
					input.autoComplete () ;
					
				}

				this._comment.innerHTML = "";
			} else {
				this._comment.innerHTML = "Geocode was not successful for the following reason: " + status;
			}
			
		}
};

}() ); 
