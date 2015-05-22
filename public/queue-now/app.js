
/*******Global Config*******/
var twoPi          = Math.PI * 2,
    color          = '#47e495',
    mainGaugeValue = 0.55,
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

gauge.fillClip = gauge.g.append('clipPath')
    .attr('id', 'g-clip')
    .append('rect')
        .attr('id', 'g-clip-rect')
        .attr('y', '-125')
        .attr('x', '-130')
        .attr('width', gauge.mainRadius * 2);

gauge.g.append('circle')
    .attr('r', gauge.mainRadius - gauge.mainBorder)
    .attr('fill', '#178BCA');


gauge.fillCircle = gauge.g.append('circle')
    .attr('clip-path', 'url(#g-clip)')
    .attr('r', gauge.mainRadius)
    .attr('fill', '#4F4F4F');

gauge.g.append('path')
    .attr('class', 'background')
    .attr('fill', '#ccc')
    .attr('fill-opacity', 0.1)
    .attr('d', gauge.arc.endAngle(twoPi - gauge.offset));

gauge.front = gauge.g.append('path')
    .attr('fill', color)
    .attr('fill-opacity', 1);

gauge.g.append('circle')
    .attr('cx', -85)
    .attr('cy', -86)
    .attr('r', gauge.subRadius)
    .attr('stroke', '#ccc')
    .attr('stroke-width', 2)
    .attr('fill', '#4F4F4F');
    // .attr('fill-opacity', 0);

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


gauge.updateProgress = function(progress) {
    gauge.front.attr('d', gauge.arc.endAngle((twoPi - gauge.offset) * gauge.progress));
    d3.select('#g-clip-rect').attr('height', 2*gauge.mainRadius*(1 - progress));
    gauge.numberText.text(formatPercent(progress));
};

(function loops() {
    gauge.updateProgress(gauge.progress);

    if (count > 0) {
        var step = mainGaugeValue < gauge.startPercent ? -0.01 : 0.01;
        count--;
        gauge.progress += step;
        setTimeout(loops, 10);
    }
})();