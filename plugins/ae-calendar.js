


(function(){

if ( !window.ajsf || !ajsf.popup ) return ;



ajsf.Calendar = ajsf.popup.InnerPopup.extend({
	
	m: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
	
	n: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
	
	construct: function ( options )
	{
		
		this._super(options.input);
		
		this.setInput(options.input) ;
		
		this.getContainer ().hide () ;
		
		this._startYear = 1901 ;

		this._endYear = 2015 ;
		
		this._currentYear = 2011 ;
		
		this._currentMonth = 8 ;
		
		this._currentDay = 31 ;
		
		var now = new Date () ;
		
		this.update ( now.getFullYear (), now.getMonth()+1, now.getDate() ) ;
		
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
			
			this._button = null ;
		}
		
		this._input = input ;
		
		if ( !this._input )
		{
			return this;
		}
		
		var cal = this ,
			delCheck = ajsf.delegate(this,this._checkHide);
		
		this._input.on('focus',function(e){
			cal.getContainer().show () ;
		});

		this._input.on('blur',function(e){
	//		cal.getContainer().hide () ;
		});
		
		return cal ;
	},
	
	_checkHide: function ()
	{
		if ( this._input && this.getContainer() )
		{
			
		}
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
			startYear - [int] The starting year in calendar selection (e.g. 1901, 1929, 2098)
		
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
		
		Returns:
		Current instance for chained commands on this element
	 */
	getStartYear: function ()
	{
		return this._startYear ;
	},
	
	
	getRealYear: function (dateObj)
	{
		return (dateObj.getYear() % 100) + (((dateObj.getYear() % 100) < 39) ? 2000 : 1900);
	},
	
	update: function ( year, month, day )
	{
		this.getContainer().empty() ;
		
		this.buildHeader(year, month);

		this.createTable(year, month);
	},
	
	gotoPrevMonth: function ()
	{
		this._currentMonth -- ;
		
		if ( this._currentMonth == 0 )
		{
			this._currentMonth = 12 ;
			this._currentYear -- ;
		}
		this.update(this._currentYear, this._currentMonth, this._currentDay);
	},

	gotoNextMonth: function ()
	{
		this._currentMonth ++ ;
		
		if ( this._currentMonth == 13 )
		{
			this._currentMonth = 1 ;
			this._currentYear ++ ;
		}
		this.update(this._currentYear, this._currentMonth, this._currentDay);
	},
	
	buildHeader: function ( year , month )
	{
		var prevButton = this.getButton('<<'),
			nextButton = this.getButton('>>'),
			yearSpan = this.getSpan(year,'year'),
			monthSpan = this.getSpan(month,'month'),
			cal = this ;
		
		prevButton.on('click',ajsf.delegate(this,function(e){
			ajsf.prevent(e);
			ajsf.ltr?this.gotoPrevMonth():this.gotoNextMonth() ;
		}));

		nextButton.on('click',ajsf.delegate(this,function(e){
			ajsf.prevent(e);
			ajsf.ltr?this.gotoNextMonth():this.gotoPrevMonth() ;
		}));
		
		this.getContainer().append(
			ajsf.create(null,'div','expanded cal-header').append(
				prevButton,
				monthSpan,
				yearSpan,
				nextButton
			)
		) ;
	},
	
	createTable: function ( year, month )
	{
		var daysCount = this.daysInMonth(year, month),
			totCells = daysCount,
			cw = 30 ,
			ch = 30,
			table = ajsf.create(null,'table'),
			day = 1,
			skip = 0,
			tot = 1,
			d = new Date(),
			cell,
			row ;
		
		if ( this._currentDay > daysCount )
		{
			this._currentDay = daysCount ;
		}

		d.setYear(year);
		d.setMonth(month-1);
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
				if (day > daysCount)
					break;
					
				tot++;
				cell=row.insertCell(row.cells.length);
				if ( skip > 0 )
				{
					cell.innerHTML = '&nbsp;';
					skip--;
					continue;
				}
				cell.setAttribute("width", cw+"");
				cell.setAttribute("height", ch+"");
				cell.style.border = "1px solid black";
				cell.style.textAlign = "center";
				cell.style.cursor = "pointer";
				cell.innerHTML = day+"";
				if (day == this._currentDay)
				{
					cell.style.background="#fff";
				}
				day++;
			}
		}

		this.getContainer().append(table);
	},
	
	getButton: function ( label , classname )
	{
		return ajsf.create (null,'a',classname).setAt('title',label).html(label);
	},
	
	getSpan: function ( label , classname )
	{
		return ajsf.create (null,'span',classname).html(''+label);
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
	}
});
/*
ajsf.forms.Calendar.styles.Box ;

var _panelID="CalendarPanel";
var _currentYear=0;
var _currentMonth=-1;
function OpenCalendar(defYear, defMonth, defDay) {
	var now=new Date();
	if ((typeof defYear == "undefined")||(isNaN(defYear)))
		defYear = now.getFullYear();
	if ((typeof defMonth == "undefined")||(isNaN(defMonth)))
		defMonth = now.getMonth();
	else
		defMonth--;
	if ((typeof defDay == "undefined")||(isNaN(defDay)))
		defDay = now.getDate();
	FillCalendar(defYear, defMonth+1, defDay);
	
	var objPanel = document.getElementById(_panelID);
	objPanel.style.display = "block";
	var panelWidth = GetElementWidth(objPanel);
	var panelHeight = GetElementHeight(objPanel);
	var bodyWidth = document.body.clientWidth;
	var bodyHeight = document.body.clientHeight;
	var panelLeft = parseInt((bodyWidth/2)-(panelWidth/2));
	var panelTop = parseInt((bodyHeight/2)-(panelHeight/2));
	objPanel.style.left = panelLeft+"px";
	objPanel.style.top = panelTop+"px";
}

function FillCalendar(year, month, day) {
	//var date=new Date();
	//date.setFullYear(year+1, month, day);
	//alert(date);
	
	_currentYear = year;
	_currentMonth = month-1;
	
	var daysCount=DaysInMonth(year, month);
	var objPanel = document.getElementById(_panelID);
	if (!objPanel) {
		objPanel = document.createElement("div");
		objPanel.id = _panelID;
		objPanel.style.position = "absolute";
		objPanel.style.display = "none";
		objPanel.style.border = _calenderBorderSize+"px solid "+_calenderBorderColor;
		objPanel.style.backgroundColor = _calendarBackground;
		objPanel.onclick = new Function("HideCalendar()");
		document.body.appendChild(objPanel);
	}
	
	while (objPanel.childNodes.length > 0)
		objPanel.removeChild(objPanel.childNodes[0]);

	BuildCalendarDetails(objPanel, _currentMonth, _currentYear);
	
	var cellWidth=50;
	var cellHeight=50;
	var currentDay=1;
	var objTable=document.createElement("table");
	objTable.setAttribute("border", "0");
	objTable.setAttribute("cellpadding", "0");
	objTable.setAttribute("cellspacing", "0");
	var objRow=0;
	while (currentDay <= daysCount) {
		if (((currentDay-1)%7) == 0) {
			objRow=objTable.insertRow(objTable.rows.length);
		}
		for (var i=1; i<=7; i++) {
			if (currentDay > daysCount)
				break;
			var objCell=objRow.insertCell(objRow.cells.length);
			objCell.setAttribute("width", cellWidth+"");
			objCell.setAttribute("height", cellHeight+"");
			objCell.style.border = "1px solid black";
			objCell.style.textAlign = "center";
			objCell.style.backgroundColor = _calenderCellColor;
			objCell.style.fontFamily = _calenderCellFontName;
			objCell.style.fontSize = _calenderCellFontSize;
			objCell.style.cursor = "pointer";
			objCell.onmouseover = new Function("PutMoreLight(this)");
			objCell.onmouseout = new Function("RestoreColor(this)");
			objCell.onclick = new Function("CalenderCellClick(this);");
			objCell.innerHTML = currentDay+"";
			currentDay++;
		}
	}
	objPanel.appendChild(objTable);
	//window.resizeTo(objTable.clientWidth, objPanel.offsetHeight);
}

function BuildCalendarDetails(objContainer, month, year) {
	var btnPreviousMonth=BuildCalendarButton((_rightToLeft  )?">>":"<<");
	btnPreviousMonth.onclick = PreviousMonthClick;
	
	var btnNextMonth=BuildCalendarButton((_rightToLeft)?"<<":">>");
	btnNextMonth.onclick = NextMonthClick;
	
	var objMonthSpan=BuildCalendarSpan(_monthNames[month]);
	var objYearSpan=BuildCalendarSpan(year+"");
	
	var objSpan=document.createElement("div");
	objSpan.id = _panelID+"_details";
	objSpan.style.textAlign = "center";
	objSpan.appendChild(BuildCalendarSpan("&nbsp;"));
	if (_rightToLeft) {
		objSpan.appendChild(btnNextMonth);
		objSpan.appendChild(BuildCalendarSpan("&nbsp;"));
		objSpan.appendChild(objMonthSpan);
		objSpan.appendChild(BuildCalendarSpan("&nbsp;&nbsp;&nbsp;"));
		objSpan.appendChild(objYearSpan);
		objSpan.appendChild(BuildCalendarSpan("&nbsp;"));
		objSpan.appendChild(btnPreviousMonth);
	}
	else {
		objSpan.appendChild(btnPreviousMonth);
		objSpan.appendChild(BuildCalendarSpan("&nbsp;"));
		objSpan.appendChild(objYearSpan);
		objSpan.appendChild(BuildCalendarSpan("&nbsp;&nbsp;&nbsp;"));
		objSpan.appendChild(objMonthSpan);
		objSpan.appendChild(BuildCalendarSpan("&nbsp;"));
		objSpan.appendChild(btnNextMonth);
	}
	objSpan.appendChild(BuildCalendarSpan("&nbsp;"));
	//objSpan.appendChild(BuildCalendarSpan("<br />"));
	objContainer.appendChild(objSpan);
}

function BuildCalendarButton(strText) {
	var result=document.createElement("button");
	result.setAttribute("type", "button");
	result.style.fontSize = "18px";
	result.innerHTML = strText;
	return result;
}

function BuildCalendarSpan(strText) {
	var result=document.createElement("span");
	result.style.fontFamily = _calenderTextFontName;
	result.style.fontSize = _calenderTextFontSize;
	result.style.color = _calenderTextColor;
	result.innerHTML = strText;
	return result;
}

function CalenderCellClick(objCell) {
	//hide:
	HideCalendar();
	
	//set date:
	var date=new Date();
	date.setFullYear(_currentYear, _currentMonth, parseInt(objCell.innerHTML));
	
	//activate callback function:
	eval(_calendarCallbackFunction+"('"+date+"')");
}

function HideCalendar() {
	var objPanel = document.getElementById(_panelID);
	objPanel.style.display = "none";
}

function PreviousMonthClick() {
	_currentMonth--;
	if (_currentMonth < 0) {
		_currentMonth = 11;
		_currentYear--;
	}
	FillCalendar(_currentYear, _currentMonth+1, 1);
}

function NextMonthClick() {
	_currentMonth++;
	if (_currentMonth > 11) {
		_currentMonth = 0;
		_currentYear++;
	}
	FillCalendar(_currentYear, _currentMonth+1, 1);
}

function DaysInMonth(year, month) {
	var date=new Date();
	var result=0;
	date.setFullYear(year, month-1, 1);
	while ((date.getFullYear() <= year)&&(date.getMonth() <= (month-1))) {
		result++;
		if (result > 31) {
			alert("error getting days in month!\nyear: "+year+", month: "+month);
			return 0;
		}
		date.setFullYear(year, month-1, date.getDate()+1);
	}
	return result;
}

function GetElementWidth(element) {
	return element.clientWidth;
}

function GetElementHeight(element) {
	return element.clientHeight;
}

var arrColoredControls=new Array();
function PutMoreLight(objControl, color, lightAmount) {
	var cancelAddLight=objControl.getAttribute("cancel_add_light");
	if (cancelAddLight == "1")
		return true;
	
	if (typeof color == "undefined")
		color = _calenderCellColor;
	
	if (typeof lightAmount == "undefined")
		lightAmount = _calendarAddLight;
	
	arrColoredControls[objControl] = color;
	
	var R=HexToInt(color.substring(1, 3));
	var G=HexToInt(color.substring(3, 5));
	var B=HexToInt(color.substring(5, 7));
	
	R = SafeAdd(R, lightAmount, 0, 255);
	G = SafeAdd(G, lightAmount, 0, 255);
	B = SafeAdd(B, lightAmount, 0, 255);
	
	var lightedColor=BuildColor(R, G, B);
	objControl.style.backgroundColor = lightedColor;
}

function RestoreColor(objControl) {
	var cancelAddLight=objControl.getAttribute("cancel_add_light");
	if (cancelAddLight == "1")
		return true;
	objControl.style.backgroundColor = arrColoredControls[objControl];
}

function IntToHex(num) {
	if (num < 10)
		return (num+"");
	
	switch (num) {
		case 10: return "a";
		case 11: return "b";
		case 12: return "c";
		case 13: return "d";
		case 14: return "e";
		case 15: return "f";
	}
	
	return IntToHex(parseInt(num/16))+IntToHex(parseInt(num%16));
}

function HexToInt(strHex) {
	return parseInt(strHex, 16);
}

function SafeAdd(num, addition, min, max) {
	num += addition;
	if (num > max)
		num = max;
	if (num < min)
		num = min;
	return num;
}

function BuildColor(r, g, b) {
	var R=IntToHex(r);
	var G=IntToHex(g);
	var B=IntToHex(b);
	R=(R.length == 1)?("0"+R):R;
	G=(G.length == 1)?("0"+G):G;
	B=(B.length == 1)?("0"+B):B;
	return "#"+R+G+B;
}



*/
}) ();