/* © http://qaru.site/questions/45461/how-to-calculate-the-svg-path-for-an-arc-of-a-circle*/
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function describeArc(x, y, radius, startAngle, endAngle){
    const 
		start = polarToCartesian(x, y, radius, endAngle),
		end = polarToCartesian(x, y, radius, startAngle),
		largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"
	;

    return [
        "M", start.x, start.y, 
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");   
}


