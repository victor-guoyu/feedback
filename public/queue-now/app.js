var colors = {
    'pink': '#E1499A',
    'yellow': '#f0ff08',
    'green': '#47e495'
    },
    color         = colors.green,
    radius        = 100,
    border        = 5,
    padding       = 30,
    startPercent  = 0,
    progress      = startPercent,
    endPercent    = 0.85,
    twoPi         = Math.PI * 2,
    offset        = Math.PI / 4 + 0.43,
    formatPercent = d3.format('.0%'),
    boxSize       = (radius + padding) * 2,
    count         = Math.abs((endPercent - startPercent) / 0.01),

    container = d3.select('#queue'),

    arc = d3.svg.arc()
    .startAngle(-0.43)
    .innerRadius(radius)
    .outerRadius(radius - border),


    svg = container.append('svg')
    .attr('width',  boxSize)
    .attr('height', boxSize),

    g = svg.append('g')
    .attr('transform', 'translate(' + boxSize / 2 + ',' + boxSize / 2 + ')'),

    meter = g.append('g')
    .attr('class', 'progress-meter'),

    foreground = meter.append('path')
    .attr('class', 'foreground')
    .attr('fill', color)
    .attr('fill-opacity', 1)
    .attr('stroke', color)
    .attr('stroke-width', 5)
    .attr('stroke-opacity', 1)
    .attr('filter', 'url(#blur)'),

    front = meter.append('path')
    .attr('class', 'foreground')
    .attr('fill', color)
    .attr('fill-opacity', 1),

    numberText = meter.append('text')
    .attr('fill', '#fff')
    .attr('text-anchor', 'middle')
    .attr('dy', '.35em');

//Add blur filter
svg.append('defs')
    .append('filter')
    .attr('id', 'blur')
    .append('feGaussianBlur')
    .attr('in', 'SourceGraphic')
    .attr('stdDeviation', '7');

meter.append('path')
    .attr('class', 'background')
    .attr('fill', '#ccc')
    .attr('fill-opacity', 0.1)
    .attr('d', arc.endAngle(twoPi));

meter.append('circle')
    .attr("cx", -66)
    .attr("cy", -60)
    .attr("r", 38)
    .attr('fill', colors.pink)
        .append("text")
        .attr('fill', '#000000')
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "8px")
        .text("90%");


function updateProgress(progress) {
    foreground.attr('d', arc.endAngle((twoPi - offset) * progress));
    front.attr('d', arc.endAngle((twoPi - offset) * progress));
    numberText.text(formatPercent(progress));
}

(function loops() {
    updateProgress(progress);

    if (count > 0) {
        var step = endPercent < startPercent ? -0.01 : 0.01;
        count--;
        progress += step;
        setTimeout(loops, 10);
    }
})();