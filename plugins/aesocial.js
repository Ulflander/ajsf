


(function () {
	
	ajsf.social = {
			
		browserBookmark: function (title, url) {
			if ( browser.IE ) {
				window.external.AddFavorite(url, title);
			} else if ( browser.FF ) {
				window.sidebar.addPanel(title, url, "");
			} else if ( browser.Opera ) {
				var b =	_d.createElement('a');
				b.setAttribute('href', url);
				b.setAttribute('title', title);
				b.setAttribute('rel', 'sidebar');
				b.click();
			}
		},
		
		print: function() {
			window.print () ;
		}
	
	};
	
})();