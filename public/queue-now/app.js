// base00:    #657b83;
// base01:    #586e75;
// base02:    #073642;
// base03:    #002b36;
// base0:     #839496;
// base1:     #93a1a1;
// base2:     #eee8d5;
// base3:     #fdf6e3;
// yellow:    #b58900;
// orange:    #cb4b16;
// red:       #dc322f;
// magenta:   #d33682;
// violet:    #6c71c4;
// blue:      #268bd2;
// cyan:      #2aa198;
// green:     #859900;

/*-------Dependency: underscore.js-------*/

var colors = {
    'pink': '#E1499A',
    'yellow': '#f0ff08',
    'green': '#47e495',
    'blue': '#268bd2'
    },

    twoPi          = Math.PI * 2,
    color          = colors.green,
    mainGaugeValue = 0.85,
    containerId    = '#queue',


    /*******Main gauge params*******/
    mainRadius    = 100,
    mainBorder    = 5,
    mainPadding   = 30,
    startPercent  = 0,
    progress      = startPercent,
    offset        = Math.PI / 4 + 0.43,
    formatPercent = d3.format('.0%'),
    boxSize       = (mainRadius + mainPadding) * 2,
    count         = Math.abs((mainGaugeValue - startPercent) / 0.01),


    /*******Top left gauge params*******/
    subRadius      = 38,
    subStrokeColor = '#fff',

    /*******Gauge Components*******/
    container = d3.select(containerId),

    arc = d3.svg.arc()
        .startAngle(-0.43)
        .innerRadius(mainRadius)
        .outerRadius(mainRadius - mainBorder),

    svg = container.append('svg')
        .attr('width',  boxSize)
        .attr('height', boxSize)
        .attr('viewBox', '0 0 '+boxSize+' '+boxSize),

    g = svg.append('g')
        .attr('transform', 'translate(' + boxSize / 2 + ',' + boxSize / 2 + ')'),

    front = g.append('path')
        .attr('fill', color)
        .attr('fill-opacity', 1),

    numberText = g.append('text')
        .attr('fill', '#fff')
        .attr('text-anchor', 'middle')
        .attr('dy', '.35em'),

    subText = g.append('text')
        .attr('fill', '#fff')
        .attr('text-anchor', 'middle')
        .attr('dy', '-3.3em')
        .attr('dx', '-4.1em');

    /*******Liquid fill config*******/
    fillPercent     = (Math.max(0, Math.min(100, mainGaugeValue))/100),
    waveHeightScale = d3.scale.linear()
                        .range([0,0.05,0])
                        .domain([0,50,100]),
    fillCircleRadius = mainRadius,
    waveColor        = '#178BCA',
    waveCount        = 1,
    waveOffset       = 0,
    waveHeight       = fillCircleRadius * waveHeightScale(fillPercent*100),
    waveLength       = fillCircleRadius * 2 / waveCount,
    waveClipCount    = waveCount + 1,
    waveClipWidth    = waveLength * waveClipCount,
    waveRiseTime     = 1000,

    // Scales for controlling the size of the clipping path.
    waveScaleX    = d3.scale.linear().range([0,waveClipWidth]).domain([0,2]),
    waveScaleY    = d3.scale.linear().range([0,waveHeight]).domain([0,1]),
    waveRiseScale = d3.scale.linear()
    .range([fillCircleRadius*2+waveHeight, waveHeight]).domain([0, 1]),

    waveAnimateScale = d3.scale.linear()
        .range([0, waveClipWidth-fillCircleRadius*2])
        .domain([0,1]),

    clipArea = d3.svg.area()
    .x(function(d) {
        return waveScaleX(d.x);
    })
    .y0(function(d) {
        return waveScaleY(
            Math.sin(
                twoPi*waveOffset*-1 + twoPi*(1-waveCount) + d.y*twoPi
        ));
    })
    .y1(function(d) {
        return (fillCircleRadius*2 + waveHeight);
    }),

    waveData =  _.range(40*waveClipCount)
                    .map(function (value, key) {
                        return {
                            x: key/(40*waveClipCount),
                            y: key/40
                        };
                    }),

    waveGroup = g.append('defs')
        .append('clipPath')
        .attr('id', 'clipWave' + containerId),

    wave = waveGroup.append('path')
        .datum(waveData)
        .attr('d', clipArea),

    //The inner circle with the clipping wave attached
    fillCircleGroup = g.append('g')
        .attr('clip-path', 'url(#clipWave' + containerId + ')'),

    fillCircleGroup.append('circle')
        .attr('cx', fillCircleRadius - mainRadius)
        .attr('cy', fillCircleRadius - mainRadius)
        .attr('r', fillCircleRadius)
        .style('fill', waveColor),

    waveGroupXPosition = (fillCircleRadius*2 - waveClipWidth);



/*******Rendering Chart *******/
g.append('path')
    .attr('class', 'background')
    .attr('fill', '#ccc')
    .attr('fill-opacity', 0.1)
    .attr('d', arc.endAngle(twoPi - offset));

g.append('circle')
    .attr('cx', -66)
    .attr('cy', -60)
    .attr('r', subRadius)
    .attr('stroke', '#ccc')
    .attr('stroke-width', 2)
    .attr('fill-opacity', 0);

subText.text(formatPercent(0.9));


waveGroup
    .attr('transform', 'translate('+waveGroupXPosition+','+waveRiseScale(0)+')')
    .transition()
    .duration(waveRiseTime)
    .attr('transform', 'translate('+waveGroupXPosition+','+waveRiseScale(fillPercent)+')')
    .each('start', function() {
        wave.attr('transform', 'translate(1,0)');
    });

function updateProgress(progress) {
    front.attr('d', arc.endAngle((twoPi - offset) * progress));
    numberText.text(formatPercent(progress));
}

function animateWave() {
    wave.transition()
        .duration(1000)
        .ease('linear')
        .attr('transform', 'translate('+waveAnimateScale(1)+',0)')
        .each('end', function(){
            wave.attr('transform', 'translate('+waveAnimateScale(0)+',0)');
            animateWave(1000);
        });
}

(function loops() {
    updateProgress(progress);

    if (count > 0) {
        var step = mainGaugeValue < startPercent ? -0.01 : 0.01;
        count--;
        progress += step;
        setTimeout(loops, 10);
    }
})();

animateWave();