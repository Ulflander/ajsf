
/**********************************
 * AJSF - Aenoa Javascript Framework
 * (c) Xavier Laumonier 2010-2011
 *
 * Since : 
 * Author : Xavier Laumonier
 *
 **********************************/



(function (){
	
$.l10n = {
	
	/*
		Variable: _dic
		
		Private
	*/
	_dic: [] ,
	
	/*
		Function: register
	
		Parameters:
			dictionary
	*/
	register: function ( dictionary )
	{
		for ( var k in dictionary )
		{
			this._dic[k] = dictionary[k] ;
		}
	},
	/*
		Function: get
	
		Returns:
	*/
	
	get: function ()
	{
		var term = arguments[0],
			l = arguments.length , i = 1 ,
			s = '' ;
		
		if ( this._dic[term] )
		{
			s = this._dic[term] ;
			
			if ( l > 1 )
			{
				for ( i ; i < l ; i++ )
				{
					s = s.split('%'+i).join(arguments[i]) ;
				}
			}
			
			return s ;
		}
		
		return term ;
	}
	
};


}() ); 