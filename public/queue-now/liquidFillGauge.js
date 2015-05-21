
function loadLiquidFillGauge(elementId, value) {
    var width            = 400,
        height           = 400,
        radius           = Math.min(width, height)/2,
        locationX        = parseInt(width)/2 - radius,
        locationY        = height/2 - radius,
        fillPercent      = Math.max(0, Math.min(100, value))/100,
        waveHeightScale  = d3.scale.linear().range([0,0.05,0]).domain([0,50,100]),
        fillCircleRadius = radius - 5,
        waveHeight       = fillCircleRadius*waveHeightScale(fillPercent*100),
        waveLength       = fillCircleRadius*2,
        waveClipWidth    = waveLength*2,
        data             = _.range(80).map(function (value, key) {return {x: key/80, y: key/40};});

    // Scales for drawing the outer circle.
    var gaugeCircleX = d3.scale.linear().range([0,2*Math.PI]).domain([0,1]);
    var gaugeCircleY = d3.scale.linear().range([0,radius]).domain([0,radius]);

    // Scales for controlling the size of the clipping path.
    var waveScaleX = d3.scale.linear().range([0,waveClipWidth]).domain([0,1]);
    var waveScaleY = d3.scale.linear().range([0,waveHeight]).domain([0,1]);

    // Scales for controlling the position of the clipping path.
    var waveRiseScale = d3.scale.linear()
        .range([(fillCircleRadius*2+waveHeight) ,waveHeight])
        .domain([0,1]);
    var waveAnimateScale = d3.scale.linear()
        .range([0, waveClipWidth-fillCircleRadius*2]) // Push the clip area one full wave then snap back.
        .domain([0,1]);
    // Draw the outer circle.
    var arc = d3.svg.arc()
        .startAngle(0)
        .endAngle(gaugeCircleX(1))
        .outerRadius(gaugeCircleY(radius))
        .innerRadius(gaugeCircleY(radius-5));

    var svg = d3.select(elementId)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", '0 0 '+width+' '+height);

    // Center the gauge within the parent SVG.
    var g = svg.append("g")
        .attr('transform','translate('+locationX+','+locationY+')');


    // draw the fucking circle
    g.append("path")
        .attr("d", arc)
        .style("fill", "#178BCA")
        .attr('transform','translate('+radius+','+radius+')');

    var waveGroup = g.append("defs")
        .append("clipPath")
        .attr("id", "clipWave" + elementId);

    var wave = waveGroup.append("path")
        .datum(data)
        .attr("d",
        d3.svg.area()
        .x(function(d) { return waveScaleX(d.x); } )
        .y0(function(d) { return waveScaleY(Math.sin(-1 + d.y*2*Math.PI));} )
        .y1(function(d) { return (fillCircleRadius*2 + waveHeight); } ));

    var fillCircleGroup = g.append("g")
        .attr("clip-path", "url(#clipWave" + elementId + ")");

    fillCircleGroup.append("circle")
        .attr("cx", radius)
        .attr("cy", radius)
        .attr("r", fillCircleRadius)
        .style("fill", "#178BCA");

    var waveGroupXPosition = fillCircleRadius*2-waveClipWidth;
        waveGroup.attr('transform','translate('+waveGroupXPosition+','+waveRiseScale(0)+')')
            .transition()
            .duration(1000)
            .attr('transform','translate('+waveGroupXPosition+','+waveRiseScale(fillPercent)+')')
            .each("start", function(){ wave.attr('transform','translate(1,0)'); });

    animateWave();

    function animateWave() {
        wave.transition()
            .duration(1000)
            .ease("linear")
            .attr('transform','translate('+waveAnimateScale(1)+',0)')
            .each("end", function(){
                wave.attr('transform','translate('+waveAnimateScale(0)+',0)');
                animateWave(1000);
            });
    }
}