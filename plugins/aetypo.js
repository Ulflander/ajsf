
/**********************************
 * AJSF - Aenoa Javascript Framework
 * (c) Xavier Laumonier 2010-2011
 *
 * Since : 
 * Author : Xavier Laumonier
 *
 **********************************/

(function(){
	
	if (!ajsf) ajsf = {};
	if (!$) $ = ajsf;
	
	/**
	 * Methods
	 */
	ajsf.aetypo = {
		
		/**
		 * Returns first X words of the sentence, suffixed by suffix if necessary
		 * 
		 * @param sentence String The sentence to cut
		 * @param nb int Number of words to keep, default: 10
		 * @param suffix string Suffix to append to sentence once cut Default: '...'
		 * @return The original sentence if words number is less than nb, a new sentence of nb words suffixed by suffix otherwise
		 */
		getFirst: function (sentence,nb,suffix)
		{
			if ( !sentence ) return '' ;
			suffix = suffix || '...' ;
			nb = nb || 10 ;
			
			if( sentence.split(' ').length > nb )
			{
				sentence = sentence.split( ' ');
				sentence.splice(nb);
				sentence = sentence.join(' ') ;
			}
			return (sentence == '' ? '' : sentence + suffix );
		}
		
	};


	/**
	 * Classes
	 */
	

	/**
	 * Used by StringComparator class
	 */
	ajsf.aetypo.StringComparatorElement = function ( word, type ) {
		this.setWord(word);
		this.setType(type);
	};
	ajsf.aetypo.StringComparatorElement.prototype._word = '' ;
	ajsf.aetypo.StringComparatorElement.prototype._type = null ;
	ajsf.aetypo.StringComparatorElement.prototype.getWord = function ()
	{
		return this._word ;
	};
	ajsf.aetypo.StringComparatorElement.prototype.setWord = function ( word )
	{
		this._word = word ;
	};
	ajsf.aetypo.StringComparatorElement.prototype.getType = function ()
	{
		return this._type ;
	};
	ajsf.aetypo.StringComparatorElement.prototype.setType = function ( type )
	{
		this._type = type ;
	};

	/**
	 * Used by StringComparator class
	 */
	ajsf.aetypo.StringComparatorResponse = function ( query, result, term ) {
		this.query = query ;
		this.result = result ;
		this.term = term ;
	};
	ajsf.aetypo.StringComparatorResponse.prototype.query = null ;
	ajsf.aetypo.StringComparatorResponse.prototype.term = null ;
	ajsf.aetypo.StringComparatorResponse.prototype.result = null ;
	
	
	
	ajsf.aetypo.StringComparator = function ( wordBase ) {
		
		this.addToBase(wordBase);
		
	};
	
	ajsf.aetypo.StringComparator.prototype._base = [] ;

	/**
	 * Set the comparator base
	 * 
	 * @param wordBase (array) An array of word, an array of StringComparatorElement, or a mixed array
	 * @return
	 */
	ajsf.aetypo.StringComparator.prototype.setBase = function ( wordBase ) {
		this._base = [] ;
		this.addToBase(wordBase) ;
	};
	
	/**
	 * Add some words in the comparator base
	 * 
	 * @param wordBase (array) An array of word, an array of StringComparatorElement, or a mixed array
	 * @return
	 */
	ajsf.aetypo.StringComparator.prototype.addToBase = function ( wordBase ) {
		
		wordBase = wordBase || [] ;
		
		for ( var k in wordBase )
		{
			str2 = this._base[k] ;
			
			// Simple string, we create a StringComparatorElement
			if ( is(wordBase[k],'string') )
			{
				this._base.push(new ajsf.aetypo.StringComparatorElement(wordBase[k]) );
			// Yet a StringComparatorElement
			} else if ( is(wordBase[k],'object') && is(wordBase[k].getWord,'function') )
			{
				this._base.push(wordBase[k]);
			}
		}
	};


	/**
	 * Will search the most approximative (or the equal) string in the word base.
	 * 
	 * If a term is found, an object like this will be returned:
	 * obj.query => the original query string
	 * arr['result'] => a number between 100 and 1 (100 is not aproximative at all, 1 is equal)
	 * arr['term'] => the most approximative term as StringComparatorElement
	 *  
	 * @param object query A string to compare
	 * @return null if no approximative term found, an object containing info if a term has been found
	 */
	ajsf.aetypo.StringComparator.prototype.compare = function ( query ) {
		
		
		var k, 
			sce, // StringComparatorElement
			result = null, res = 100, best = 100 ;
		
		for ( k in this._base )
		{
			sce = this._base[k] ;
			res = this._compare(query , sce.getWord());
			
			if ( best > res )
			{
				result = new StringComparatorResponse ( query , res, sce ) ;
			}
		}
		
		if ( best == 100 )
		{
			return null ;
		}
		
		return result ;
	};
	ajsf.aetypo.StringComparator.prototype._compare = function ( str1 , str2 ) {
		
		str1 = str1.toLowerCase () ;
		str2 = str2.toLowerCase () ;
		
		// If strings equals, result = 1
		if ( str1 == str2 )
		{
			return 1 ;
		}
		
		// Prepare comparison
		var l1 = str1.length , // Length of first string
			l2 = str2.length , // Length of second string
			l , // Max length
			lx , // Length difference
			c = 0 , // Same letters position counter
			b = 0 , // Before letters position counter
			a = 0 , // After letters position counter
			i = 0, 
			r = 100, // Default return
			letter; // Current letter
		
		// No comparison on very little strings
		if ( l1 < 3 || l2 < 3 )
		{
			return r ;
		}
		
		// Set lengths
		l = (l1 > l2 ? l1 : l2 ) ;
		lx = (l1 > l2 ? l1 - l2 : l2 - l1 ) ;
		
		// Loop on letters
		for ( i = 0 ; i < l ; i ++ )
		{
			if ( i < l1 )
			{
				letter = str1[i] ;

			// Max length reached
			} else {
				break;
			}
			
			// Same position
			if ( i < l2 && letter == str2[i] ) 
			{
				c += 1 ;
			// Position + 1
			} else if ( l2 > i + 1 && letter == str2[i+1] )
			{
				b += 0.75 ;
			// Position - 1
			} else if ( i > 0 && i <= l2 && letter == str2[i-1] )
			{
				a += 0.75 ;
			// Position + 2
			} else if ( l2 > i + 2 && letter == str2[i+2] )
			{
				b += 0.50 ;
			// Position - 2
			} else if ( i > 1 && i <= l2 && letter == str2[i-2] )
			{
				a += 0.40 ;
			// Position + 3
			} else if ( l2 > i + 3 && letter == str2[i+3] )
			{
				b += 0.30 ;
			// Position - 3
			} else if ( i > 2 && i <= l2 && letter == str2[i-3] )
			{
				a += 0.15 ;
			}
		}
		
		c = (c+a+b) - lx / 2 ;
		
		if ( c < 1 )
		{
			return r;
		} else {
			
			i = l1 / c ;
			
			return i ;
		}
	};
	
	
	
	
	
	
}) () ;
