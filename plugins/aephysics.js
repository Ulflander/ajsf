/**
 * This class is under GPL licence.
 * 
 * Some modifications has been done to be integrated into AEJS 
 * 
 * @author Luke Wallin / http://www.lukewallin.co.uk
 */


(function (){
	
ajsf.physics = {} ;





ajsf.physics.inpoly = function(x, y, polyX, polyY, polyRs, polyAs, polyangle){
	//test to see if a single point is inside a certain polygon.
	var crosslines = 0;
	var x2 = x + 1000;
	for (var p = 0; p < polyRs.length; p++) 
	{
		var p2 = (p + 1) % polyRs.length;
		if (ajsf.physics._linesIntersect(x, y, x2, y, polyX + polyRs[p] * Math.cos(polyAs[p] + polyangle), polyY + polyRs[p] * Math.sin(polyAs[p] + polyangle), polyX + polyRs[p2] * Math.cos(polyAs[p2] + polyangle), polyY + polyRs[p2] * Math.sin(polyAs[p2] + polyangle)).overlap)
		{
			crosslines++;
		}
	}
	if (crosslines % 2 == 0) 
	{
		//even :. outside poly.
		return false;
	}
	else 
	{
		//odd :. inside poly
		return true;
	}
}


//store functions in 2d array to avoid messy lookups
ajsf.physics._collidingFunctions = new Array(5);
for (var i = 0; i < 5; i++) 
{
	ajsf.physics._collidingFunctions[i] = new Array(5);
}

ajsf.physics._checkCircleAndCircle = function(p1, d1, h1, a1, s1, p2, d2, h2, a2, s2){
	//if the distance between the two circles is less than or equal to the sum of their two radii then they'll collide
	var distance=Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2);
	
	if (distance < Math.pow(d1 + d2, 2)) 
	{
		var bigH=h2;
		if(d1 > d2)
			bigH=h1;
		
		if(bigH && distance < Math.pow(d1-d2,2))
		{
			//if the larger circle is hollow and the two are close enough not to collide
			return {
				"overlap": false
				};
		}
		
		//angle from b to a
		var contactAngle = Math.atan2(p1[1] - p2[1], p1[0] - p2[0]);
		
		//contact point on surface of shape b, that way collisions of one circle inside another work too
		var contactPoint=[Math.cos(contactAngle)*d2 , Math.sin(contactAngle)*d2];
		//average of the two centres
		//var contactPoint = [(p2[0] - p1[0]) / 2, (p2[1] - p1[1]) / 2];
		
		
		var contactNormal = [Math.cos(contactAngle), Math.sin(contactAngle)];
		return {
			"overlap": true,
			"contactPoint": contactPoint,
			"contactNormal": contactNormal
		};
	}
	
	return {
		"overlap": false
	};
};

ajsf.physics._checkCircleAndBorder = function(p1, d1, h1, a1, s1, p2, d2, h2, a2, s2){
	//if circlePos + radius <leftmost, >rightmost, etc
	if (p1[0] + d1 > p2[0] + d2[0] / 2 || p1[0] - d1 < p2[0] - d2[0] / 2 || p1[1] - d1 < p2[1] - d2[1] / 2 || p1[1] + d1 > p2[1] + d2[1] / 2) 
	{
		switch (true)
		{
			case (p1[0] + d1 > p2[0] + d2[0] / 2):
				//right hand side of border
				var contactPoint = [d1, 0];
				var contactNormal = [-1, 0];
				break;
			case (p1[0] - d1 < p2[0] - d2[0] / 2):
				//left hand side of border
				var contactPoint = [-d1, 0];
				var contactNormal = [1, 0];
				break;
			case (p1[1] - d1 < p2[1] - d2[1] / 2):
				//top of border
				var contactPoint = [0, -d1];
				var contactNormal = [0, -1];
				break;
			case (p1[1] + d1 > p2[1] + d2[1] / 2):
				//bottom of border
				var contactPoint = [0, d1];
				var contactNormal = [0, 1];
				break;
		}
		return {
			"overlap": true,
			"contactPoint": contactPoint,
			"contactNormal": contactNormal
		};
	}
	
	return {
		"overlap": false
	};
};

ajsf.physics._checkBorderAndCircle = function(p1, d1, h1, a1, s1, p2, d2, h2, a2, s2){
	return thisObject._checkCircleAndBorder(p2, d2, h2, a2, s2, p1, d1, h1, a1, s1)
};

ajsf.physics._checkPolyAndBorder = function(p1, d1, h1, a1, s1, p2, d2, h2, a2, s2){
	for (var i = 0; i < d1.modulii.length; i++) 
	{
		//coords of a point
		var x = d1.modulii[i] * Math.cos(d1.angles[i] + a1);
		var y = d1.modulii[i] * Math.sin(d1.angles[i] + a1);
	
		//point is outside border
		switch (true)
		{
			case (p1[0] + x > p2[0] + d2[0] / 2):
				//right hand side of border
				return {
					"overlap": true,
					"contactPoint": [x, y],
					"contactNormal": [-1, 0]
					};
				break;
			case (p1[0] + x < p2[0] - d2[0] / 2):
				//left hand side of border
				return {
					"overlap": true,
					"contactPoint": [x, y],
					"contactNormal": [1, 0]
					};
				break;
			case (p1[1] + y < p2[1] - d2[1] / 2):
				//top of border
				return {
					"overlap": true,
					"contactPoint": [x, y],
					"contactNormal": [0, -1]
					};
				break;
			case (p1[1] + y > p2[1] + d2[1] / 2):
				//bottom of border
				return {
					"overlap": true,
					"contactPoint": [x, y],
					"contactNormal": [0, 1]
					};
				break;
		}
	}
	
	
	return {
		"overlap": false
	};
};

ajsf.physics._checkPolyAndCircle = function(p1, d1, h1, a1, s1, p2, d2, h2, a2, s2){
	
	if(Math.dsqrd(p1[0],p1[1],p2[0],p2[1]) > Math.pow(d1.boundingR + d2,2))
	{
		//treating as circles - too far away to collide.
		return {
		"overlap": false
		}
	}
	
	if (!h2) {
		//check points on poly to see if they are inside circle, only if circle is not hollow!
		var polyPoints = thisObject._checkPointsInsideCircle(p1, a1, d1.modulii, d1.angles, p2, d2);
		
		if (polyPoints.overlap) {
			return {
				"overlap": true,
				"contactPoint": polyPoints.polyPoint,
				"contactNormal": polyPoints.polyNormal
			}
		}
	}
	
	if(!h1)
	{
		//if polygon is filled
		if(thisObject._inpoly(p2[0], p2[1], p1[0], p1[1], d1.modulii, d1.angles, a1))
		{
			//centre of circle is inside polygon
			var info=thisObject._findPolyLineNormal(p2[0], p2[1], p1[0], p1[1], d1.modulii, d1.angles, a1);
			return {
				"overlap": true,
				//I think this should be the right side of the circle as normal is taken on the outside of the polygon
				"contactPoint": [Math.cos(info.angle)*d2 , Math.sin(info.angle)*d2],
				"contactNormal": info.normal
			}
		}
	}
	
	var polyLines = thisObject._checkPolyLinesAndCircle(p1, a1, d1.modulii, d1.angles, p2, d2);
	
	if (polyLines.overlap) 
	{
		return {
			"overlap": true,
			"contactPoint": polyLines.polyPoint,
			"contactNormal": polyLines.polyNormal
		}
	}
	
	return {
		"overlap": false
	};
}

ajsf.physics._checkCircleAndPoly = function(p1, d1, h1, a1, s1, p2, d2, h2, a2, s2){
	//check points on poly to see if they are inside circle
	
	if(Math.dsqrd(p1[0],p1[1],p2[0],p2[1]) > Math.pow(d1 + d2.boundingR,2))
	{
		//treating as circles - too far away to collide.
		return {
		"overlap": false
		}
	}
	if (!h1) {
		//circle not hollow, check points of poly to see if poly is inside!
		var polyPoints = thisObject._checkPointsInsideCircle(p2, a2, d2.modulii, d2.angles, p1, d1);
		
		if (polyPoints.overlap) {
			return {
				"overlap": true,
				"contactPoint": polyPoints.circlePoint,
				"contactNormal": polyPoints.circleNormal
			}
		}
	}
	
	if(!h2)
	{
		//if polygon is filled
		if(thisObject._inpoly(p1[0], p1[1], p2[0], p2[1], d2.modulii, d2.angles, a2))
		{
			//centre of circle is inside polygon
			var info=thisObject._findPolyLineNormal(p1[0], p1[1], p2[0], p2[1], d2.modulii, d2.angles, a2);
			return {
				"overlap": true,
				//I think this should be the right side of the circle as normal is taken on the outside of the polygon
				"contactPoint": [Math.cos(info.angle)*d1 , Math.sin(info.angle)*d1],
				"contactNormal": info.normal
			}
		}
	}
	
	var polyLines = thisObject._checkPolyLinesAndCircle(p2, a2, d2.modulii, d2.angles, p1, d1);
	if (polyLines.overlap)
	{
		return {
			"overlap": true,
			"contactPoint": polyLines.circlePoint,
			"contactNormal": polyLines.circleNormal
		}
	}
	
	return {
		"overlap": false
	};
}

ajsf.physics._checkPolyAndPoly = function(p1, d1, h1, a1, s1, p2, d2, h2, a2, s2)
{
	
	if(Math.dsqrd(p1[0],p1[1],p2[0],p2[1]) > Math.pow(d1.boundingR + d2.boundingR,2))
	{
		//treating as circles - too far away to collide.
		return {
		"overlap": false
		}
	}
	
	var poly1InsidePoly2=false;
	var poly2InsidePoly1=false;
	/*
	if(thisObject._inpoly(p1[0], p1[1], p2[0], p2[1], d2.modulii, d2.angles, a2))
	{
		//centre of poly1 is inside poly2
		if (!h2) 
		{
			//poly 2 is filled
			return {
				"overlap": true,
				"contactPoint": [0, 0],
				"contactNormal": thisObject._findPolyLineNormal(p1[0], p1[1], p2[0], p2[1], d2.modulii, d2.angles, a2)
			}
		}
		poly1InsidePoly2=true;
	}
	
	if(thisObject._inpoly(p2[0], p2[1], p1[0], p1[1], d1.modulii, d1.angles, a1))
	{
		//centre of poly2 is inside poly1
		if (!h1) 
		{
			//poly 1 is filled
			return {
				"overlap": true,
				"contactPoint": [p2[0]-p1[0], p2[1]-p1[1]],
				"contactNormal": thisObject._findPolyLineNormal(p2[0], p2[1], p1[0], p1[1], d1.modulii, d1.angles, a1)
			}
		}
		poly2InsidePoly1=true;
	}
	*/
	for (var i = 0; i < d1.modulii.length; i++) 
	{
		//loop through each line of the polygon
		i2 = (i + 1) % d1.modulii.length;
		
		var polyA_x1 = p1[0] + d1.modulii[i] * Math.cos(d1.angles[i] + a1);
		var polyA_y1 = p1[1] + d1.modulii[i] * Math.sin(d1.angles[i] + a1);
		var polyA_x2 = p1[0] + d1.modulii[i2] * Math.cos(d1.angles[i2] + a1);
		var polyA_y2 = p1[1] + d1.modulii[i2] * Math.sin(d1.angles[i2] + a1);
		
		for (var j = 0; j < d2.modulii.length; j++) 
		{
			//loop through each line of the polygon
			j2 = (j + 1) % d2.modulii.length;
			
			var polyB_x1 = p2[0] + d2.modulii[j] * Math.cos(d2.angles[j] + a2);
			var polyB_y1 = p2[1] + d2.modulii[j] * Math.sin(d2.angles[j] + a2);
			var polyB_x2 = p2[0] + d2.modulii[j2] * Math.cos(d2.angles[j2] + a2);
			var polyB_y2 = p2[1] + d2.modulii[j2] * Math.sin(d2.angles[j2] + a2);
			
			var polyPoint=thisObject._linesIntersect(polyA_x1, polyA_y1, polyA_x2, polyA_y2, polyB_x1, polyB_y1, polyB_x2, polyB_y2)
			
			if(polyPoint.overlap)
			{
				//angle of the line on the polygon that the poly has collided with
				var polyLineAngle = Math.atan2(polyB_y2 - polyB_y1, polyB_x2 - polyB_x1);
				
				//adjust this angle so it is the normal to the line pointing outwards
				if (d2.angles[j2] > d2.angles[j]) 
				{
					polyLineAngle -= Math.PI / 2;
				}
				else 
				{
					polyLineAngle += Math.PI / 2;
				}
				
				if(poly1InsidePoly2)
				{
					polyLineAngle+=Math.PI;
				}
				
				return {
					"overlap": true,
					"contactPoint": [polyPoint.point[0]-p1[0] , polyPoint.point[1]-p1[1]],
					"contactNormal": [Math.cos(polyLineAngle) , Math.sin(polyLineAngle)]
					}
			}
		}
	}
	
	// NEED TO CHECK LINES TOO!  otherwise two tall thin shapes can intersect with no points inside each other!
	return {
		"overlap": false
	};
	
	
	//check to see if any points of the first polygon are inside the second polygon
	for(var i=0;i<d1.modulii.length;i++)
	{
		var x = d1.modulii[i] * Math.cos(d1.angles[i] + a1);
		var y = d1.modulii[i] * Math.sin(d1.angles[i] + a1);
		
		if (thisObject._inpoly(p1[0] + x, p1[1] + y, p2[0], p2[1], d2.modulii, d2.angles, a2)) 
		{
			return {
				"overlap": true,
				"contactPoint": [x,y],
				"contactNormal": thisObject._findPolyLineNormal(p1[0] + x, p1[1] + y, p2[0], p2[1], d2.modulii, d2.angles, a2).normal
			};
		}

	}
	
	
	//check to see if any points of the second polygon are inside the first polygon
	for(var i=0;i<d2.modulii.length;i++)
	{
		var x = p2[0] + d2.modulii[i] * Math.cos(d2.angles[i] + a2);
		var y = p2[1] + d2.modulii[i] * Math.sin(d2.angles[i] + a2);
		
		if (thisObject._inpoly(x, y, p1[0], p1[1], d1.modulii, d1.angles, a1)) 
		{
			return {
				"overlap": true,
				"contactPoint": [x-p1[0],y-p1[1]],
				"contactNormal": thisObject._findPolyLineNormal(x, y, p1[0], p1[1], d1.modulii, d1.angles, a1).normal
			};
		}

	}
	
	
	
	//two ways of doing this - check points of poly A are in poly B and vice versa, OR check if any lines intersect.
	
	//ajsf.physics._linesIntersect = function(sx1, sy1, sx2, sy2, px1, py1, px2, py2)
	/*
	
	*/
};

ajsf.physics._checkRodAndBorder = function(p1, d1, h1, a1, s1, p2, d2, h2, a2, s2){
	
	var points=[[Math.cos(a1)*d1 , Math.sin(a1)*d1],[Math.cos(a1+Math.PI)*d1 , Math.sin(a1+Math.PI)*d1]];
	
	for (var i = 0; i < points.length; i++) 
	{
		switch (true)
		{
			case (p1[0]+points[i][0] > p2[0] + d2[0] / 2):
				//right hand side of border
				return {
					"overlap": true,
					"contactPoint": points[i],
					"contactNormal": [-1, 0]
				};
				break;
			case (p1[0]+points[i][0] < p2[0] - d2[0] / 2):
				//left hand side of border
				return {
					"overlap": true,
					"contactPoint": points[i],
					"contactNormal": [1, 0]
				};
				break;
			case (p1[1]+points[i][1] < p2[1] - d2[1] / 2):
				//top of border
				return {
					"overlap": true,
					"contactPoint": points[i],
					"contactNormal": [0, -1]
				};
				break;
			case (p1[1]+points[i][1] > p2[1] + d2[1] / 2):
				//bottom of border
				return {
					"overlap": true,
					"contactPoint": points[i],
					"contactNormal": [0, 1]
				};
				break;
		}
		
	}
	return {
		"overlap": false
	};
};

ajsf.physics._checkRodAndCircle = function(p1, d1, h1, a1, s1, p2, d2, h2, a2, s2){
	
	var x1=p1[0] + Math.cos(a1) * d1;
	var y1=p1[1] + Math.sin(a1) * d1;
	var x2=p1[0] + Math.cos(a1 + Math.PI) * d1;
	var y2=p1[1] + Math.sin(a1 + Math.PI) * d1;
	
	var circleCollide = thisObject._checkCircleAndLineCollide(x1, x2, y1, y2, p2[0], p2[1], d2);
	
	if(circleCollide.overlap)
	{
		var circleAngle = Math.atan2(circleCollide.point[1] - p2[1] , circleCollide.point[0] - p2[0]);
		
		return {
			"overlap": true,
			"contactPoint": [circleCollide.point[0] - p1[0] , circleCollide.point[1] - p1[1]],
			"contactNormal": [Math.cos(circleAngle), Math.sin(circleAngle)]
		};
	}
	if (!h2) 
	{
		var points = [[x1, y1], [x2, y2]];
		
		for (var i = 0; i < points.length; i++) 
		{
			var dSqrd = Math.pow(points[i][0] - p2[0], 2) + Math.pow(points[i][1] - p2[1],2);
			if (dSqrd < d2 * d2) 
			{
				
				var circleAngle = Math.atan2(points[i][1] - p2[1], points[i][0] - p2[0]);
				//point is inside circle
				return {
					"overlap": true,
					"contactPoint": [points[i][0] - p1[0], points[i][1] - p1[1]],
					"contactNormal": [Math.cos(circleAngle), Math.sin(circleAngle)]
				};
			}
		}
	}
		return {
		"overlap": false
	};
	
}

ajsf.physics._checkCircleAndRod = function(p1, d1, h1, a1, s1, p2, d2, h2, a2, s2){
	
	var x1=p2[0] + Math.cos(a2) * d2;
	var y1=p2[1] + Math.sin(a2) * d2;
	var x2=p2[0] + Math.cos(a2 + Math.PI) * d2;
	var y2=p2[1] + Math.sin(a2 + Math.PI) * d2;
	
	var circleCollide = thisObject._checkCircleAndLineCollide(x1, x2, y1, y2, p1[0], p1[1], d1);
	
	if(circleCollide.overlap)
	{
		return {
			"overlap": true,
			"contactPoint": [circleCollide.point[0] - p2[0] , circleCollide.point[1] - p2[1]],
			"contactNormal": [Math.cos(a2+Math.PI/2), Math.sin(a2+Math.PI/2)]
		};
	}
	if (!h1) 
	{
		var points = [[x1, y1], [x2, y2]];
		
		for (var i = 0; i < points.length; i++) 
		{
			var dSqrd = Math.pow(points[i][0] - p1[0], 2) + Math.pow(points[i][1] - p1[1],2);
			
			if (dSqrd < d1 * d1) 
			{
				var circleAngle = Math.atan2(points[i][1] - p1[1], points[i][0] - p1[0]);
				//point is inside circle
				return {
					"overlap": true,
					"contactPoint": [points[i][0] - p2[0], points[i][1] - p2[1]],
					"contactNormal": [Math.cos(a2 + Math.PI / 2), Math.sin(a2 + Math.PI / 2)]
				};
			}
		}
	}
	return {
		"overlap": false
		};
	
}

ajsf.physics._checkRodAndPoly=function(p1, d1, h1, a1, s1, p2, d2, h2, a2, s2) {
	var x1=p1[0] + Math.cos(a1) * d1;
	var y1=p1[1] + Math.sin(a1) * d1;
	var x2=p1[0] + Math.cos(a1 + Math.PI) * d1;
	var y2=p1[1] + Math.sin(a1 + Math.PI) * d1;
	
	for (var i = 0; i < d2.modulii.length; i++) {
		//loop through each line of the polygon
		i2 = (i + 1) % d2.modulii.length;
		
		var poly_x1 = p2[0] + d2.modulii[i] * Math.cos(d2.angles[i] + a2);
		var poly_y1 = p2[1] + d2.modulii[i] * Math.sin(d2.angles[i] + a2);
		var poly_x2 = p2[0] + d2.modulii[i2] * Math.cos(d2.angles[i2] + a2);
		var poly_y2 = p2[1] + d2.modulii[i2] * Math.sin(d2.angles[i2] + a2);
		
		var lineStuff=thisObject._linesIntersect(x1, y1, x2, y2, poly_x1, poly_y1, poly_x2, poly_y2);
		
		if(lineStuff.overlap)
		{
			var polyLineAngle = Math.atan2(poly_y2 - poly_y1, poly_x2 - poly_x1);
				
			//adjust this angle so it is the normal to the line pointing outwards
			if (d2.angles[i2] > d2.angles[i]) 
			{
				polyLineAngle -= Math.PI / 2;
			}
			else 
			{
				polyLineAngle += Math.PI / 2;
			}
			
			return {
				"overlap": true,
				"contactPoint": [lineStuff.point[0]-p1[0], lineStuff.point[1]-p1[1]],
				"contactNormal": [Math.cos(polyLineAngle) , Math.sin(polyLineAngle)]
			}
		}
		
	}
	
	if(!h2){
		//polygon not hollow
		//only checking one point, because if only one point is inside polygon, then a line intersect will be found above
		if(thisObject._inpoly(p1[0], p1[1], p2[0], p2[1], d2.modulii, d2.angles, p2[2])){
			
			var polyLine1=thisObject._findPolyLineNormal(x1, y1, p2[0], p2[1], d2.modulii, d2.angles, p2[2]);
			var polyLine2=thisObject._findPolyLineNormal(x2, y2, p2[0], p2[1], d2.modulii, d2.angles, p2[2]);
			
			//trying both ends of rod, to see which is closer to the polygon
			
			var normal=polyLine1.normal;
			if(polyLine1.distance>polyLine2.distance)
				normal=polyLine2.normal;
			
			return {
				"overlap": true,
				"contactPoint": [x1,y1],
				"contactNormal": normal
			}
		}
		
	}
	
	return {
		"overlap": false
		};
}

ajsf.physics._checkPolyAndRod=function(p1, d1, h1, a1, s1, p2, d2, h2, a2, s2) {
	var x1=p2[0] + Math.cos(a2) * d2;
	var y1=p2[1] + Math.sin(a2) * d2;
	var x2=p2[0] + Math.cos(a2 + Math.PI) * d2;
	var y2=p2[1] + Math.sin(a2 + Math.PI) * d2;
	
	for (var i = 0; i < d1.modulii.length; i++) {
		//loop through each line of the polygon
		i2 = (i + 1) % d1.modulii.length;
		
		var poly_x1 = p1[0] + d1.modulii[i] * Math.cos(d1.angles[i] + a1);
		var poly_y1 = p1[1] + d1.modulii[i] * Math.sin(d1.angles[i] + a1);
		var poly_x2 = p1[0] + d1.modulii[i2] * Math.cos(d1.angles[i2] + a1);
		var poly_y2 = p1[1] + d1.modulii[i2] * Math.sin(d1.angles[i2] + a1);
		
		var lineStuff=thisObject._linesIntersect(x1, y1, x2, y2, poly_x1, poly_y1, poly_x2, poly_y2);
		
		if(lineStuff.overlap)
		{
			
			return {
				"overlap": true,
				"contactPoint": [lineStuff.point[0]-p1[0], lineStuff.point[1]-p1[1]],
				"contactNormal": [Math.cos(a2+Math.PI/2) , Math.sin(a2+Math.PI/2)]
			}
		}
		
	}
	
	if(!h1){
		//polygon not hollow
		//only checking one point, because if only one point is inside polygon, then a line intersect will be found above
		if(thisObject._inpoly(p2[0], p2[1], p1[0], p1[1], d1.modulii, d1.angles, p1[2])){
			
			var polyLine1=thisObject._findPolyLineNormal(x1, y1, p2[0], p2[1], d1.modulii, d1.angles, p1[2]);
			var polyLine2=thisObject._findPolyLineNormal(x2, y2, p2[0], p2[1], d1.modulii, d1.angles, p1[2]);
			
			//trying both ends of rod, to see which is closer to the polygon
			
			var normal=polyLine1.normal;
			if(polyLine1.distance>polyLine2.distance)
				normal=polyLine2.normal;
			
			return {
				"overlap": true,
				"contactPoint": [x1,y1],
				"contactNormal": normal
			}
		}
		
	}
	
	return {
		"overlap": false
		};
}



ajsf.physics._checkRodAndRod=function(p1, d1, h1, a1, s1, p2, d2, h2, a2, s2) {
	
	var Ax1=p1[0] + Math.cos(a1) * d1;
	var Ay1=p1[1] + Math.sin(a1) * d1;
	var Ax2=p1[0] + Math.cos(a1 + Math.PI) * d1;
	var Ay2=p1[1] + Math.sin(a1 + Math.PI) * d1;
	
	var Bx1=p2[0] + Math.cos(a2) * d2;
	var By1=p2[1] + Math.sin(a2) * d2;
	var Bx2=p2[0] + Math.cos(a2 + Math.PI) * d2;
	var By2=p2[1] + Math.sin(a2 + Math.PI) * d2;
	
	var lineStuff=thisObject._linesIntersect(Ax1, Ay1, Ax2, Ay2, Bx1, By1, Bx2, By2);
		
	if(lineStuff.overlap)
	{
		return {
			"overlap": true,
			"contactPoint": [lineStuff.point[0]-p1[0], lineStuff.point[1]-p1[1]],
			"contactNormal": [Math.cos(a2+Math.PI/2) , Math.sin(a2+Math.PI/2)]
		}
	}
	
	return {
		"overlap": false
		};
}

ajsf.physics._collidingFunctions[0][0] = ajsf.physics._checkCircleAndCircle;
ajsf.physics._collidingFunctions[0][2] = ajsf.physics._checkCircleAndBorder;
ajsf.physics._collidingFunctions[0][3] = ajsf.physics._checkCircleAndPoly;
ajsf.physics._collidingFunctions[0][4] = ajsf.physics._checkCircleAndRod;

ajsf.physics._collidingFunctions[3][0] = ajsf.physics._checkPolyAndCircle;
ajsf.physics._collidingFunctions[3][2] = ajsf.physics._checkPolyAndBorder;
ajsf.physics._collidingFunctions[3][3] = ajsf.physics._checkPolyAndPoly;
ajsf.physics._collidingFunctions[3][4] = ajsf.physics._checkPolyAndRod;

ajsf.physics._collidingFunctions[4][0] = ajsf.physics._checkRodAndCircle;
ajsf.physics._collidingFunctions[4][2] = ajsf.physics._checkRodAndBorder;
ajsf.physics._collidingFunctions[4][3] = ajsf.physics._checkRodAndPoly;
ajsf.physics._collidingFunctions[4][4] = ajsf.physics._checkRodAndRod;

// p=pos=[x,y], d=dimensions,s=shape, a=angle, f=filled
// shapes+dimensions:
// Circle: shape=0, d=radius
// rectangle: shape=1, d=[ width , height ]
// border: shape=2, d=[ width , height ]
// polygon: shape=3, d={.modulii, .angles, .boundingR}
// line: shape = 4, d= length/2

ajsf.physics.checkForCollision = function(p1, d1, h1, a1, s1, p2, d2, h2, a2, s2){
	return ajsf.physics._collidingFunctions[s1][s2](p1, d1, h1, a1, s1, p2, d2, h2, a2, s2);
}


//used by poly and circle checks
ajsf.physics._checkPointsInsideCircle = function(polyPos, polyangle, polyRs, polyAs, circlePos, circleR){
	for (var k = 0; k < polyRs.length; k++) 
	{
		var polyX = polyRs[k] * Math.cos(polyAs[k] + polyangle);
		var polyY = polyRs[k] * Math.sin(polyAs[k] + polyangle);
		if (Math.pow(polyPos[0] + polyX - circlePos[0], 2) + Math.pow(polyPos[1] + polyY - circlePos[1], 2) < circleR * circleR) 
		{
			//angle from circle to point
			var angle = Math.atan2(polyPos[1] + polyY - circlePos[1], polyPos[0] + polyX - circlePos[0]);
			
			var polyAngle = polyAs[k] + polyangle;
			
			return {
				"overlap": true,
				"polyPoint": [polyX, polyY],
				"circlePoint": [Math.cos(angle) * circleR, Math.sin(angle) * circleR],
				"circleNormal": [Math.cos(angle), Math.sin(angle)],//normal on the circle surface
				"polyNormal": [Math.cos(polyAngle), Math.sin(polyAngle)]//normal on surface of poly
			};
		}
	}
	
	return {
		"overlap": false
	}
}

///used by poly and circle checks
ajsf.physics._checkPolyLinesAndCircle = function(polyPos, polyangle, polyRs, polyAs, circlePos, circleR){
	var polyX = polyPos[0];
	var polyY = polyPos[1];
	
	for (var k = 0; k < polyRs.length; k++) 
	{
		//loop through each line of the polygon
		k2 = (k + 1) % polyRs.length;
		
		var polyx1 = polyX + polyRs[k] * Math.cos(polyAs[k] + polyangle);
		var polyy1 = polyY + polyRs[k] * Math.sin(polyAs[k] + polyangle);
		var polyx2 = polyX + polyRs[k2] * Math.cos(polyAs[k2] + polyangle);
		var polyy2 = polyY + polyRs[k2] * Math.sin(polyAs[k2] + polyangle);
		
		var polyCircle = ajsf.physics._checkCircleAndLineCollide(polyx1, polyx2, polyy1, polyy2, circlePos[0], circlePos[1], circleR);
		
		if (polyCircle.overlap) 
		{
			var circleAngle = Math.atan2(polyCircle.point[1] - circlePos[1], polyCircle.point[0] - circlePos[0]);
			
			//angle of the line on the polygon that the circle has collided with
			var polyLineAngle = Math.atan2(polyy2 - polyy1, polyx2 - polyx1);
			
			//adjust this angle so it is the normal to the line pointing outwards
			if (polyAs[k2] > polyAs[k]) 
			{
				polyLineAngle -= Math.PI / 2;
			}
			else 
			{
				polyLineAngle += Math.PI / 2;
			}
			
			return {
				"overlap": true,
				"polyPoint": [polyCircle.point[0] - polyX, polyCircle.point[1] - polyY],
				"circlePoint": [Math.cos(circleAngle) * circleR, Math.sin(circleAngle) * circleR],
				"circleNormal": [Math.cos(circleAngle), Math.sin(circleAngle)],//normal on the circle surface
				"polyNormal": [Math.cos(polyLineAngle), Math.sin(polyLineAngle)]//normal on surface of poly
			};
		}
		
	}
	return {
		"overlap": false
	}
}


//find normal of line on a polygon a point is closest to

ajsf.physics._findPolyLineNormal = function(x, y, polyX, polyY, polyRs, polyAs, polyangle){
	var polyx1 = polyX + polyRs[0] * Math.cos(polyAs[0] + polyangle);
	var polyy1 = polyY + polyRs[0] * Math.sin(polyAs[0] + polyangle);
	var polyx2 = polyX + polyRs[1] * Math.cos(polyAs[1] + polyangle);
	var polyy2 = polyY + polyRs[1] * Math.sin(polyAs[1] + polyangle);
	
	var shortest = Math.dsqrd(polyx1, polyy1, x, y) + Math.dsqrd(polyx2, polyy2, x, y) - Math.dsqrd(polyx2, polyy2, polyx1, polyy1)
	var temppolyline = 0;
	
	for (var k = 1; k < polyRs.length; k++) 
	{
		k2 = (k + 1) % polyRs.length;
		polyx1 = polyX + polyRs[k] * Math.cos(polyAs[k] + polyangle);
		polyy1 = polyY + polyRs[k] * Math.sin(polyAs[k] + polyangle);
		polyx2 = polyX + polyRs[k2] * Math.cos(polyAs[k2] + polyangle);
		polyy2 = polyY + polyRs[k2] * Math.sin(polyAs[k2] + polyangle);
		var testshort = Math.dsqrd(polyx1, polyy1, x, y) + Math.dsqrd(polyx2, polyy2, x, y) - Math.dsqrd(polyx2, polyy2, polyx1, polyy1)
		if (testshort < shortest) 
		{
			shortest = testshort;
			temppolyline = k;
		}
	}
	
	var k=temppolyline;
	var k2=(temppolyline+1)%polyRs.length;
	
	polyx1 = polyRs[k] * Math.cos(polyAs[k] + polyangle);
	polyy1 = polyRs[k] * Math.sin(polyAs[k] + polyangle);
	polyx2 = polyRs[k2] * Math.cos(polyAs[k2] + polyangle);
	polyy2 = polyRs[k2] * Math.sin(polyAs[k2] + polyangle);
	//angle of the line on the polygon that the circle has collided with
	var polyLineAngle = Math.atan2(polyy2 - polyy1, polyx2 - polyx1);
	
	//adjust this angle so it is the normal to the line pointing outwards
	if (polyAs[k2] > polyAs[k]) 
	{
		polyLineAngle -= Math.PI / 2;
	}
	else 
	{
		polyLineAngle += Math.PI / 2;
	}
	
	return {
		"normal": [Math.cos(polyLineAngle) , Math.sin(polyLineAngle)],
		"angle": polyLineAngle,
		"distance": shortest
	}
	
	return [Math.cos(polyLineAngle) , Math.sin(polyLineAngle)];
}

//checks for intersection
ajsf.physics._linesIntersect = function(sx1, sy1, sx2, sy2, px1, py1, px2, py2){
	if (sx1 < sx2) 
	{
		var sx1test = sx1;
		var sx2test = sx2
	}
	else 
	{
		var sx1test = sx2;
		var sx2test = sx1;
	}
	if (sy1 < sy2) 
	{
		var sy1test = sy1;
		var sy2test = sy2
	}
	else 
	{
		var sy1test = sy2;
		var sy2test = sy1;
	}
	if (px1 < px2) 
	{
		var px1test = px1;
		var px2test = px2
	}
	else 
	{
		var px1test = px2;
		var px2test = px1;
	}
	if (py1 < py2) 
	{
		var py1test = py1;
		var py2test = py2
	}
	else 
	{
		var py1test = py2;
		var py2test = py1;
	}
	
	//if(sx2 > px1 && sx1 < px2 && sy1 < py2 && sy2 > py1){
	var sm = (sy2 - sy1) / (sx2 - sx1)
	var pm = (py2 - py1) / (px2 - px1)
	
	//gradients not equal :. not parallel and will intersect in 2D
	if (sm !== pm && sm !== Infinity && pm !== Infinity && sm !== 0 && pm !== 0) 
	{
		//co-ords of intersection
		var x = (sx1 * sm - px1 * pm + py1 - sy1) / (sm - pm)
		var y = pm * (x - px1) + py1
		
	}
	else 
	{
		//an infinite gradient means a vertical line
		if (sm == -Infinity) 
		{
			sm = Infinity;
		}
		if (pm == -Infinity) 
		{
			pm = Infinity;
		}
		//a gradient of zero means a horizontal line
		
		//two vertical lines ontop of each other
		if (sm == Infinity && pm == Infinity) 
		{
			if (sy2test >= py1test && sy1test <= py2test && sx1 == px1) 
			{
				return {
					"overlap": true,
					"point": [sx1 , (sy1test + sy2test + py1test+py2test)/4]
				}
			}
		}//two horizontal lines ontop of each other
		else if (sm == 0 && pm == 0) 
		{
			if (sx2test >= px1test && sx1test <= px2test && py1 == sy1) 
			{
				return {
					"overlap": true,
					"point": [(sx1test + sx2test + px1test+px2test)/4, py1]
				}
			}
		}
		else if (sm == Infinity && pm == 0) 
		{
			var x = sx1;
			var y = py1;
		}
		else if (sm == 0 && pm == Infinity) 
		{
			var y = sy1;
			var x = px1;
		}
		else if (sm == Infinity) 
		{
			var x = sx1;
			var y = pm * (x - px1) + py1
		}
		else if (pm == Infinity) 
		{
			var x = px1;
			var y = sm * (x - sx1) + sy1
		}
		else if (sm == 0) 
		{
			var y = sy1;
			var x = (y - py1) / pm + px1
		}
		else if (pm == 0) 
		{
			var y = py1;
			var x = (y - sy1) / sm + sx1
		}
		
	}
	if (sx1test <= x && x <= sx2test && px1test <= x && x <= px2test && sy1test <= y && y <= sy2test && py1test <= y && y <= py2test) 
	{
		return {
				"overlap": true,
				"point": [x,y]
			}
	}
	
	//end of optimisation
	//}
	
	return {
			"overlap": false,
			"point": [x,y]
		}
}


//does a circle intersect a line?
//returns point where circle intersects.  if two points, returns average
ajsf.physics._checkCircleAndLineCollide = function(x1, x2, y1, y2, a, b, r){
	//r=radius
	//a=circle centre x
	//b=circle centre y
	//(x1,y1), (x2,y2) points line travels between
	
	if (x1 < x2) 
	{
		var testx1 = x1;
		var testx2 = x2;
	}
	else 
	{
		var testx1 = x2;
		var testx2 = x1;
	}
	if (y1 < y2) 
	{
		var testy1 = y1;
		var testy2 = y2;
	}
	else 
	{
		var testy1 = y2;
		var testy2 = y1;
	}
	
	//treat both as squares first, if they collide, look in more detail
	//if(testx2 > (a-r) && testx1 < (a+r) && testy1 < (b+r) && testy2 > (b-r))
	//{
	var dy = y2 - y1;
	var dx = x2 - x1;
	//gradient of line
	var m = dy / dx
	//fixes odd problem with not detecting collision point correctly on a nearly vertical line - needs looking into?
	if (m > 1000000) 
	{
		m = Infinity;
	}
	switch (m)
	{
		case Infinity:
		case -Infinity:
			//vertical line - we know x, but have potentially two possible Ys
			var x = x1
			//b^2 - 4ac
			var discrim = Math.pow((-2 * b), 2) - 4 * (b * b + (x - a) * (x - a) - r * r)
			if (discrim >= 0) 
			{
				var overlap=false;
				var thisY=false;
				//minus
				var y = (-(-2 * b) - Math.sqrt(discrim)) / 2
				if (testx1 <= x && x <= testx2 && testy1 <= y && y <= testy2) 
				{
					overlap=true;
					thisY=y;
				}
				//plus
				var y = (-(-2 * b) + Math.sqrt(discrim)) / 2
				if (testx1 <= x && x <= testx2 && testy1 <= y && y <= testy2) 
				{
					if(overlap)
					{
						//take average of two colliding coords
						thisY+=y;
						thisY/=2;
					}
					else
					{
						overlap=true;
						thisY=y;
					}
				}
				if (overlap) 
				{
					return {
						"overlap": true,
						"point": [x, thisY]
					};
				}
			}
			break;
		case 0:
			//horizontal line, two potential Xs
			var y = y1
			var discrim = Math.pow((-2 * a), 2) - 4 * (a * a + (y - b) * (y - b) - r * r)
			if (discrim >= 0) 
			{
				var overlap=false;
				var thisX=false;
				//minus
				var x = (-(-2 * a) - Math.sqrt(discrim)) / 2
				if (testx1 <= x && x <= testx2 && testy1 <= y && y <= testy2) 
				{
					overlap=true;
					thisX=x;
				}
				//plus
				var x = (-(-2 * a) + Math.sqrt(discrim)) / 2
				if (testx1 <= x && x <= testx2 && testy1 <= y && y <= testy2) 
				{
					if(overlap)
					{
						//take average of two colliding coords
						thisX+=x;
						thisX/=2;
					}
					else
					{
						overlap=true;
						thisX=x;
					}
				}
				if (overlap) 
				{
					return {
						"overlap": true,
						"point": [thisX, y]
					};
				}
			}
			break;
		default:
			//re-arrangement of the equation of a circle and the equation of a straight line to find the x co-ordinate of an intersection
			var discrim = Math.pow((-2 * a - 2 * m * m * x1 + 2 * y1 * m - 2 * b * m), 2) - 4 * (1 + m * m) * (-2 * m * x1 * y1 + 2 * m * x1 * b + m * m * x1 * x1 - r * r + a * a + (y1 - b) * (y1 - b))
			//if discriminant is less than zero then there are no real roots and :. no interesction
			if (discrim >= 0) 
			{
				var overlap=false;
				var point=false;
				//circle intersects line, but where?
				//minus first
				var x = (-(-2 * a - 2 * m * m * x1 + 2 * y1 * m - 2 * b * m) - Math.sqrt(discrim)) / (2 * (1 + m * m))
				var y = m * (x - x1) + y1
				if (testx1 <= x && x <= testx2 && testy1 <= y && y <= testy2) 
				{
					overlap=true;
					point=[x,y];
				}
				//then plus
				x = (-(-2 * a - 2 * m * m * x1 + 2 * y1 * m - 2 * b * m) + Math.sqrt(discrim)) / (2 * (1 + m * m))
				y = m * (x - x1) + y1
				
				if (testx1 <= x && x <= testx2 && testy1 <= y && y <= testy2) 
				{
					if(overlap)
					{
						point=[(point[0]+x)/2,(point[1]+y)/2];
					}
					else
					{
						overlap=true;
						point=[x,y];
					}
				}
				
				if (overlap) 
				{
					return {
						"overlap": true,
						"point": point
					};
				}
			//end of discrim if
			}
			break;
		//end of m switch
	}
	return {
		"overlap": false
	};
}


/**
 * @author Luke Wallin / http://www.lukewallin.co.uk
 */
Math.dotProduct = function(vector1, vector2)
{
	var dot=0;
	for(var i=0;i<vector1.length;i++)
	{
		dot+=vector1[i]*vector2[i];
	}
	return dot;
};

/**
 * @author Luke Wallin / http://www.lukewallin.co.uk
 */
Math.crossProduct = function(a, b)
{
	if(a.length<3)
	{
		a.push(0);
	}
	
	if(b.length<3)
	{
		b.push(0);
	}
	
	return [a[1]*b[2] - a[2]*b[1] , a[2]*b[1] - a[0]*b[2] , a[0]*b[1] - a[1]*b[0]];
};

/**
 * @author Luke Wallin / http://www.lukewallin.co.uk
 */
Math.modulus=function(vector)
{
	var sqrd=0;
	for(var i=0;i<vector.length;i++)
	{
		sqrd+=vector[i]*vector[i];
	}
	return Math.sqrt(sqrd);
};

/**
 * @author Luke Wallin / http://www.lukewallin.co.uk
 */
Math.dsqrd=function(xA, yA, xB, yB)
{
	return (xA-xB)*(xA-xB) + (yA-yB)*(yA-yB);
};


/**
 * @author Luke Wallin / http://www.lukewallin.co.uk
 */
Math.dsqrd2=function(pos1, pos2)
{
	return (pos1[0]-pos2[0])*(pos1[0]-pos2[0]) + (pos1[1]-pos2[1])*(pos1[1]-pos2[1]);
};


/**
 * @author Luke Wallin / http://www.lukewallin.co.uk
 */
//given [x,y], returns [dist,angle]
Math.cartToPolar=function(cartesianVector){
	
	var dist=Math.sqrt(Math.pow(cartesianVector[0],2) + Math.pow(cartesianVector[1],2));
	var angle=Math.atan2(cartesianVector[1],cartesianVector[0]);
	
	return [dist,angle];
};



}() ); 