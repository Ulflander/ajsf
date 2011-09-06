


(function(){

if ( !window.ajsf || !ajsf.popup ) return ;

	// Dependency
	ajsf.load('ae-numeric-stepper') ;
	
	
	ajsf.Calendar = ajsf.popup.InnerPopup.extend({
		
		m: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
		
		n: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
		
		/*
			Constructor: construct
			
			Parameters:
				options - [object] A bunch of objects
		 */
		construct: function ( options )
		{
			this._useTime = false ;
			
			this._footer = null ;
			
			this._startYear = 1901 ;
	
			this._endYear = 2015 ;
			
			this._currentYear = 2011 ;
			
			this._currentMonth = 8 ;
			
			this._currentDay = 31 ;
			
			this._currentHour = 12 ;
			
			this._currentMinute = 0 ;
			
			this._input2 = null ;
			
			this._stepper1 = null ;
			
			this._stepper2 = null ;
			
			this._button = ajsf.create(null,'a')
							.setClass('icon16 calendar unlabeled')
							.setAt('href','#')
							.html('&nbsp;')
							.on('click',ajsf.delegate(this,function(e){
								ajsf.prevent(e);
								if ( this.getContainer().isVisible() )
								{
									this.hide () ;
								} else {
									this.show () ;
								}
							})) ;
			
			this._super(this._button);
			
			ajsf.expandOptionsToClass(this,options);
			
			this.hide () ;
		},
		
		destroy: function ()
		{
			this._input = null ;

			if ( this._footer )
			{
				this._footer.destroy () ;
			}
			
			this._footer = null ;

			if ( this._button )
			{
				this._button.destroy () ;
			}
			
			this._button = null ;
			
			if ( this._input2 )
			{
				this._input2.destroy () ;
			}
			this._input2 = null ;
			
			
			if ( this._stepper1 )
			{
				this._stepper1.destroy () ;
			}
			this._stepper1 = null ;
			
			
			if ( this._stepper2 )
			{
				this._stepper2.destroy () ;
			}
			this._stepper2 = null ;
			
			
			
			this._super () ;
		},
		
	
		/*
		 	Function: setInput
		 	
		 	Set the input element associated with the Calendar popup
		 	
		 	Parameters:
		 		input - [HTMLInputElement] the input element to fill with generated date
		 	
		 	Returns:
			Current instance for chained commands on this element
		 */
		setInput: function ( input )
		{
			if ( this._input != null )
			{
				this._input = null ;
				
				this._button.detach() ;
			}
			
			this._input = input ;
			
			this._table = null ;
			
			if ( !this._input )
			{
				return this;
			}
			
			var cal = this ,
				delCheck = ajsf.delegate(this,this._checkHide);
			
			this._input.getParent().insertBefore(this._button,this._input);
			
			this._input.on('change',ajsf.delegate(this,function(e){
				this._interpretInputValue();
				this._updateInputValue();
			}));
			
			this._interpretInputValue();
			
			return cal ;
		},
	
		/*
		 	Function: getInput
		 	
			Returns the input element associated with the string generator
		 	
		 	Returns:
			The input element associated with the string generator
		 */
		getInput: function ( )
		{
			return this._input ;
		},
	
		
		/*
			Function: setStartYear
			
			Set the starting year in calendar selection. Default is 1901.
			
			Parameters:
				startYear -�[int] The starting year in calendar selection (e.g. 1901, 1929, 2098)
			
			Returns:
			Current instance for chained commands on this element
		 */
		setStartYear: function ( startYear )
		{
			this._startYear = parseInt(startYear);
			
			return this;
		},
		
		/*
			Function: getStartYear
			
			Get the start year in calendar selection.
			
			Returns:
			Current instance for chained commands on this element
		 */
		getStartYear: function ()
		{
			return this._startYear ;
		},
	
		
		/*
			Function: setEndYear
			
			Set the ending year in calendar selection. Default is 2015.
			
			Parameters:
				startYear -�[int] The starting year in calendar selection (e.g. 1901, 1929, 2098)
			
			Returns:
			Current instance for chained commands on this element
		 */
		setEndYear: function ( endYear )
		{
			this._endYear = parseInt(endYear);
			
			return this;
		},
		
		/*
			Function: getEndYear
			
			Get the end year in calendar selection.
			
			Returns:
			Current instance for chained commands on this element
		 */
		getEndYear: function ()
		{
			return this._endYear ;
		},
	
		/*
			Function: setUseTime
			
			Get useTime parameter value
			
			Returns:
			True if calendar show hours and minutes, false otherwise
		 */
		setUseTime: function (useTime)
		{
			this._useTime = useTime ;
			
			return this ;
		},
	
		
		/*
			Function: getUseTime
			
			Get useTime parameter value
			
			Returns:
			True if calendar show hours and minutes, false otherwise
		 */
		getUseTime: function ()
		{
			return this._useTime ;
		},
		
		getRealYear: function (dateObj)
		{
			return (dateObj.getYear() % 100) + (((dateObj.getYear() % 100) < 39) ? 2000 : 1900);
		},
		
		update: function ( year, month, day, hour , minute )
		{
			if ( year )
			{
				this._currentYear = year ;
			}
			if ( this._currentYear < this._startYear )
			{
				this._currentYear = this._startYear ;
			} else if ( this._currentYear > this._endYear )
			{
				this._currentYear = this._endYear; 
			}
			if ( month )
			{
				this._currentMonth = month ;
			}
			if ( this._currentMonth > 12 )
			{
				this._currentMonth = 12 ;
			} else if ( this._currentMonth < 1 )
			{
				this._currentMonth = 1 ;
			}
			if ( day )
			{
				this._currentDay = day ;
			}
			if ( this._currentDay < 1 )
			{
				this._currentDay = 1 ;
			} else if ( this._currentDay > 31 )
			{
				this._currentDay = 31 ;
			}
			if ( hour )
			{
				this._currentHour = hour ; 
			}
			if ( minute )
			{
				this._currentMinute = minute ; 
			}
			
			
			var daysCount = this.daysInMonth(this._currentYear, this._currentMonth) ;
	
			if ( this._currentDay > daysCount )
			{
				this._currentDay = daysCount ;
			}
	
			this._updateInputValue() ;
			
			this.buildHeader();
	
			this.createTable();
			
			if (this._useTime)
			{
			    this.buildFooter();
			}
		},
		
		gotoPrevMonth: function ()
		{
			this._currentMonth -- ;
			
			if ( this._currentMonth == 0 )
			{
				this._currentMonth = 12 ;
				this._currentYear -- ;
			}
			
			this.update();
		},
	
		gotoNextMonth: function ()
		{
			this._currentMonth ++ ;
			
			if ( this._currentMonth == 13 )
			{
				this._currentMonth = 1 ;
				this._currentYear ++ ;
			}
			this.update();
		},
		
		buildHeader: function ()
		{
			if ( !this._table )
			{
				this._table = ajsf.create(null,'div','expanded cal-calendar') ;
				this.getContainer().append(this._table);
			}
			this._table.empty (); 
			
			var prevButton = this.getButton('&laquo;','cal-prev'),
				nextButton = this.getButton(' &raquo;','cal-next'),
				yearInput = this._getInput(this._currentYear,'year').w(40),
				monthInput = this._getInput(this._currentMonth,'month').w(20) ;
			
			prevButton.on('click',ajsf.delegate(this,function(e){
				ajsf.prevent(e);
				ajsf.ltr?this.gotoPrevMonth():this.gotoNextMonth() ;
			}));
	
			nextButton.on('click',ajsf.delegate(this,function(e){
				ajsf.prevent(e);
				ajsf.ltr?this.gotoNextMonth():this.gotoPrevMonth() ;
			}));

			monthInput.on('change', ajsf.delegate(this,function(e){
				var val = monthInput.getValue().replace(/([^0-9])/g,'').replace(/^0/g,'') ;
				monthInput.setValue( val ) ;
				this._currentMonth = parseInt(val) ;
				this.update() ;
			}));
			yearInput.on('change', ajsf.delegate(this,function(e){
				var val = yearInput.getValue().replace(/([^0-9])/g,'').replace(/^0/g,'') ;
				yearInput.setValue( val ) ;
				this._currentYear = parseInt(val);
				this.update() ;
			}));
			
			this._table.append(
				ajsf.create(null,'div','expanded cal-header').append(
					prevButton,
					monthInput,
					ajsf.create(null,'span','cal-sep').html(' / '),
					yearInput,
					nextButton
				)
			) ;
		},
		
		buildFooter: function ()
		{
			if ( !this._footer )
			{
				var stepper1Container = ajsf.create(null,'span','cal-hour'),
					stepper2Container = ajsf.create(null,'span','cal-minute'),
					stepper1 = new ajsf.AeNumericStepper ({
						container: stepper1Container,
						minVal: 0,
						maxVal: 23,
						leadingZero: 1,
						LTR: false
					}),
					stepper2 = new ajsf.AeNumericStepper ({
						container: stepper2Container,
						minVal: 0,
						maxVal: 59,
						leadingZero: 1
					});
				
				stepper1.setValue(this._currentHour);
				stepper2.setValue(this._currentMinute);
				
				stepper1.on('change', ajsf.delegate(this, function(e){
					this._currentHour = stepper1.getValue () ;
					this._updateInputValue() ;
				}));
	
				stepper2.on('change', ajsf.delegate(this, function(e){
					this._currentMinute = stepper2.getValue () ;
					this._updateInputValue() ;
				}));
				
				this._footer = ajsf.create(null,'div','cal-time').append(
							ajsf.create(null,'span','icon16 time unlabeled cal-icon').html('&nbsp;'),
							stepper1Container,
							stepper2Container
						) ;
						    
				
			    this._stepper1 = stepper1 ;
			    this._stepper2 = stepper2 ;
			} else if ( this._stepper1 )
			{   
			    this._currentHour = this._stepper1.setValue(this._currentHour).getValue () ;
			    this._currentMinute = this._stepper2.setValue(this._currentMinute).getValue() ;
			}
			
			this.getContainer().append(this._footer) ;
		},
		
		createTable: function ()
		{
			
			var daysCount = this.daysInMonth(this._currentYear, this._currentMonth),
				totCells = daysCount,
				cw = 12 ,
				ch = 12,
				table = ajsf.create(null,'table'),
				day = 1,
				skip = 0,
				tot = 1,
				instance = this,
				d = new Date(),
				cell,
				row ;
	
			d.setYear(this._currentYear);
			d.setMonth(this._currentMonth-1);
			d.setDate(0);
			skip = d.getDay () ;
			
			
			totCells += skip ;
			
			table.setAt("border", "0")
				.setAt("cellpadding", "0")
				.setAt("cellspacing", "0");
			
			while (tot <= totCells) {
				if (((tot-1)%7) == 0 || !row) {
					row=table.insertRow(table.rows.length);
				}
				for (var i=1; i<=7; i++) {

					tot++;
					cell=_(row.insertCell(row.cells.length));
					
					if (day > daysCount || skip > 0 )
					{
						if ( skip > 0 )
						{
							skip--;
						}
						cell.addClass('cal-blank');
						cell.html('&nbsp;');
						continue;
					}
					cell.addClass('cal-cell');
					
					cell.html( day+"" );
					if ( i == 7 )
					{
						cell.addClass('cal-sunday');
					}
					if (day == this._currentDay)
					{
						cell.addClass('cal-current');
					}
					cell.setAt('data-day',day);
					cell.on('click',function(e){
						ajsf.prevent(e);
						instance.update(null,null,parseInt(this.getAt('data-day')));
					});
					day++;
				}
			}
	
			this._table.append(table);
		},
		
		getButton: function ( label , classname )
		{
			return ajsf.create (null,'a','cal-button '+classname).setAt('title',label).setAt('href','#').html(label);
		},
		
		_getInput: function ( label , classname )
		{
			return ajsf.create (null,'input',classname).setAt('type','text').setAt('value',label);
		},
	
		daysInMonth: function (year, month) {
			var date=new Date(),
				result=0;
			
			date.setFullYear(year, month-1, 1);
			
			while ((date.getFullYear() <= year)&&(date.getMonth() <= (month-1))) {
				result++;
				if (result > 31) {
					return 0;
				}
				date.setFullYear(year, month-1, date.getDate()+1);
			}
			
			return result;
		},
		_interpretInputValue: function ()
		{
			if ( !this._input )
			{
				return;
			}
			
			var str = ''+this._input.getValue (),
				useTime = str.indexOf(' ') == 10,
				date = str.substring(0, 10).split('-'),
				time = useTime ? str.substring(11).split(':') : null ;
			
			this.setUseTime(useTime);
			if ( useTime )
			{
				this._currentHour = parseInt(this._trimLeadingZ(time[0]));
				this._currentMinute = parseInt(this._trimLeadingZ(time[1]));
			}
			this.update(parseInt(this._trimLeadingZ(date[0])), parseInt(this._trimLeadingZ(date[1])), parseInt(this._trimLeadingZ(date[2])) ) ;
		},
		
		_updateInputValue: function ()
		{
	
			if ( !this._input )
			{
				return;
			}
			var str = this._currentYear + '-' +(this._currentMonth<10?'0':'')+ this._currentMonth + '-'+(this._currentDay<10?'0':'') + this._currentDay ;
			if ( this.getUseTime() )
			{
				str += ' ' + (this._currentHour<10?'0':'') + this._currentHour + ':' + (this._currentMinute<10?'0':'') + this._currentMinute + ':00' ;
			}
			this._input.setValue (str) ;
		},
		
		_trimLeadingZ: function ( str )
		{
		    while( str.length>1 && str[0] == '0' )
		    {
			str = str.substr(1);
		    }
		    return str ;
		}
	});

}) ();