var twoPi          = Math.PI * 2,
    color          = '#47e495',
    mainGaugeValue = 0.85,
    subGaugeValue  = 0.9,
    containerId    = '#queue',
    formatPercent  = d3.format('.0%'),
    gauge          = {},
    count          = Math.abs((mainGaugeValue - 0) / 0.01),
    width          = 260,
    height         = 260;


/*******Main gauge params*******/
gauge.mainRadius = Math.min(width, height)/2;
gauge.mainBorder = 5;
gauge.progress   = 0;
gauge.offset     = Math.PI / 4 + 0.35;
gauge.locationX  = width/ 2 ;
gauge.locationY  = height / 2;


/*******Top left gauge params*******/
gauge.subRadius      = 43;
gauge.subStrokeColor = '#fff';


/*******Gauge Components*******/
gauge.arc = d3.svg.arc()
    .startAngle(-0.43)
    .innerRadius(gauge.mainRadius - gauge.mainBorder)
    .outerRadius(gauge.mainRadius);

gauge.svg = d3.select(containerId)
    .append('svg')
    .attr('width',  width)
    .attr('height', height)
    .attr('viewBox', '0 0 '+width+' '+height);

gauge.g = gauge.svg.append('g')
    .attr('transform', 'translate('+gauge.locationX+','+gauge.locationY+')');

gauge.front = gauge.g.append('path')
    .attr('fill', color)
    .attr('fill-opacity', 1);

gauge.g.append('path')
    .attr('class', 'background')
    .attr('fill', '#ccc')
    .attr('fill-opacity', 0.1)
    .attr('d', gauge.arc.endAngle(twoPi - gauge.offset));

gauge.g.append('circle')
    .attr('cx', -85)
    .attr('cy', -86)
    .attr('r', gauge.subRadius)
    .attr('stroke', '#ccc')
    .attr('stroke-width', 2)
    .attr('fill-opacity', 0);

gauge.numberText = gauge.g.append('text')
    .attr('fill', '#fff')
    .attr('text-anchor', 'middle')
    .attr('dy', '.35em');

gauge.subText = gauge.g.append('text')
    .attr('fill', '#fff')
    .attr('text-anchor', 'middle')
    .attr('dy', '-4.8em')
    .attr('dx', '-5.1em');

gauge.subText.text(formatPercent(subGaugeValue));

/*******Liquid fill config*******/
gauge.fillPercent      = (Math.max(0, Math.min(100, mainGaugeValue))/100);
gauge.waveHeightScale  = d3.scale.linear().range([0,0.05,0]).domain([0,50,100]);
gauge.fillCircleRadius = gauge.mainRadius - gauge.mainBorder;
gauge.waveColor        = '#178BCA';
gauge.waveOffset       = 0;
gauge.waveHeight       = gauge.fillCircleRadius * gauge.waveHeightScale(gauge.fillPercent*100)*30;
gauge.waveLength       = gauge.fillCircleRadius * 2;
gauge.waveClipWidth    = gauge.waveLength * 2;

// Scales for controlling the size of the clipping path.
gauge.waveScaleX = d3.scale.linear()
    .range([0,gauge.waveClipWidth]).domain([0,1]);
gauge.waveScaleY = d3.scale.linear()
    .range([0,gauge.waveHeight]).domain([0,1]);
gauge.waveRiseScale = d3.scale.linear()
    .range([gauge.fillCircleRadius - 90, gauge.waveHeight]).domain([0, 1]);

gauge.waveAnimateScale = d3.scale.linear()
    .range([0, gauge.waveClipWidth-gauge.fillCircleRadius*2])
    .domain([0,1]);

gauge.waveData =  _.range(80)
                .map(function (value, key) {
                    return {
                        x: key/80,
                        y: key/40
                    };
                });

gauge.waveGroup = gauge.g.append('defs')
        .append('clipPath')
        .attr('id', 'clipWave' + containerId);

gauge.wave = gauge.waveGroup.append('path')
    .datum(gauge.waveData)
    .attr('d',
        d3.svg.area()
        .x(function(d) {
            return gauge.waveScaleX(d.x);
        })
        .y0(function(d) {
            return gauge.waveScaleY(Math.sin(Math.sin(-1 + d.y*twoPi)));
        })
        .y1(function(d) {
            return (gauge.fillCircleRadius*2 + gauge.waveHeight);
        })
    );

//The inner circle with the clipping wave attached
gauge.fillCircleGroup = gauge.g.append('g')
        .attr("clip-path", "url(#clipWave" + containerId + ")");

gauge.fillCircleGroup.append('circle')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', gauge.fillCircleRadius)
    .style('fill', gauge.waveColor);

gauge.waveGroupXPosition = gauge.fillCircleRadius - gauge.waveClipWidth ;

gauge.waveGroup
.attr('transform', 'translate('+gauge.waveGroupXPosition+','+gauge.waveRiseScale(3)+')')
.transition()
.duration(1000)
.attr('transform', 'translate('+gauge.waveGroupXPosition+','+gauge.waveRiseScale(gauge.fillPercent)+')')
.each('start', function() {
    gauge.wave.attr('transform', 'translate(1,0)');
});

gauge.updateProgress = function(progress) {
    gauge.front.attr('d', gauge.arc.endAngle((twoPi - gauge.offset) * gauge.progress));
    gauge.numberText.text(formatPercent(progress));
};

gauge.animateWave = function() {
    gauge.wave.transition()
        .duration(1000)
        .ease('linear')
        .attr('transform', 'translate('+gauge.waveAnimateScale(1)+',0)')
        .each('end', function(){
            gauge.wave.attr('transform', 'translate('+gauge.waveAnimateScale(0)+',0)');
            gauge.animateWave(1000);
        });
};

gauge.animateWave();
(function loops() {
    gauge.updateProgress(gauge.progress);

    if (count > 0) {
        var step = mainGaugeValue < gauge.startPercent ? -0.01 : 0.01;
        count--;
        gauge.progress += step;
        setTimeout(loops, 10);
    }
})();
