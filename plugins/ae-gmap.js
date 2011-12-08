

(function (){
	
    if ( !window.ajsf ) return ;
    if ( !window.google || !window.google.maps ) return ;
    if ( !ajsf.maps ) ajsf.maps = {} ;
    /*
	(function(namespace) {
	    var mask_paths = [[
	        new google.maps.LatLng( 90, -360),
	        new google.maps.LatLng( 90, 0),
	        new google.maps.LatLng(-90, 0),
	        new google.maps.LatLng(-90, -360)
	    ], [
	        new google.maps.LatLng( 90, -360),
	        new google.maps.LatLng( 90, 0),
	        new google.maps.LatLng(-90, 0),
	        new google.maps.LatLng(-90, -360)
	    ] ] ;
	
	    namespace.Mask = function(options) {
	    	
	        this.mask_ = new google.maps.Polygon();
	        this.polygon_ = new google.maps.Polygon();
	
	        this.fillColor = "#FFFFFF";
	        this.fillOpacity = 0.6;
	        this.map = null;
	        this.paths = [];
	        this.strokeColor = "#ff0000";
	        this.strokeOpacity = 0;
	        this.strokeWeight = 0;
	        this.zIndex = -100;
	        this.setOptions(options);
	    };
	
	    namespace.Mask.prototype =
	        new google.maps.MVCObject();
	
	    namespace.Mask.prototype.setMap = function(map) {
	        this.mask_.setMap(map);
	        this.polygon_.setMap(map);
	        this.map = map;
	    };
	
	    namespace.Mask.prototype.setPaths = function(paths) {
	        this.mask_.setPaths(mask_paths.concat(paths));
	        this.polygon_.setPaths(paths);
	        this.paths = paths;
	    };
	
	    namespace.Mask.prototype.setOptions = function(options) {
	        this.setValues(options);
	
	        this.mask_.setOptions({
	            fillColor: this.fillColor,
	            fillOpacity: this.fillOpacity,
	            strokeWeight: 1,
	            strokeOpacity: 0,
	            zIndex: this.zIndex,
	            map: this.map
	        });
	
	        this.polygon_.setOptions({
	            fillOpacity: 0,
	            strokeColor: this.strokeColor,
	            strokeOpacity: this.strokeOpacity,
	            strokeWeight: this.strokeWeight,
	            zIndex: this.zIndex,
	            map: this.map
	        });
	    };
	})(ajsf.maps);
    */
    ajsf.maps.Mask = ajsf.Class.extend( {
		
	maskPaths: [[
	    new google.maps.LatLng( 90, 360),
	    new google.maps.LatLng( 90, 0),
	    new google.maps.LatLng(-90, 0),
	    new google.maps.LatLng(-90, 360)
	], [
	    new google.maps.LatLng( 90, 360),
	    new google.maps.LatLng( 90, 0),
	    new google.maps.LatLng(-90, 0),
	    new google.maps.LatLng(-90, 360)
	]],
		           
	construct: function ( options ) {
	    this.mask_ = new google.maps.Polygon();
	    this.polygon_ = new google.maps.Polygon();
	
	    this.fillColor = "#000000";
	    this.fillOpacity = 0.6;
	    this.map = null;
	    this.paths = [];
	    this.strokeWeight = 0;
	    this.strokeOpacity = 0;
	    this.zIndex = 0;
	    this.setOptions(options);
	},
	setMap: function(map) {
	    this.mask_.setMap(map);
	    this.polygon_.setMap(map);
	    this.map = map;
	},

	setPaths: function(paths) {
	    this.mask_.setPaths(this.maskPaths.concat(paths));
	    this.polygon_.setPaths(paths);
	    this.paths = paths;
	},

	setOptions: function(options) {
	    this.setValues(options);

	    this.mask_.setOptions({
		strokeColor: this.strokeColor,
		strokeOpacity: 0,
		strokeWeight: 0,
		geodesic: this.geodesic_,
		fillColor: this.fillColor,
		zIndex: this.zIndex,
		map: this.map
	    });

	    this.polygon_.setOptions({
		geodesic: this.geodesic_,
		fillColor: this.fillColor,
		strokeOpacity: 0,
		strokeWeight: 0,
		fillOpacity: 0,
		zIndex: this.zIndex,
		map: this.map
	    });
	}
    }, google.maps.MVCObject );
    
}) () ;
