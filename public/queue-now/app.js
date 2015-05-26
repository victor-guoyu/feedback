/*******Global Config*******/
var twoPi = Math.PI * 2,
    color                    = '#47e495',
    containerId              = '#queue',
    formatPercent            = d3.format('.0%'),
    gauge                    = {},
    width                    = 220,
    height                   = 220;


/*******Main gauge params*******/
gauge.mainRadius                 = Math.min(width, height)/2 - 10;
gauge.mainBorder                 = 10;
gauge.serviceLevelProgress       = 0;
gauge.abadonedPercentageProgress = 0;
gauge.locationX                  = width/ 2 ;
gauge.locationY                  = height / 2;


/*******Gauge Components*******/
gauge.arc = d3.svg.arc()
    .startAngle(0)
    .innerRadius(gauge.mainRadius - gauge.mainBorder)
    .outerRadius(gauge.mainRadius);

gauge.tooltip = d3.select(".tooltip");

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
        .attr('x', -gauge.mainRadius)
        .attr('width', gauge.mainRadius * 2);

gauge.dropPrecentage = gauge.g.append('circle')
    .attr('r', gauge.mainRadius - gauge.mainBorder)
    .attr('fill', '#FFB8B8');

gauge.fillCircle = gauge.g.append('circle')
    .attr('clip-path', 'url(#g-clip)')
    .attr('r', gauge.mainRadius)
    .attr('fill', '#FFFFFF');

gauge.g.append('path')
    .attr('class', 'background')
    .attr('fill', '#ccc')
    .attr('fill-opacity', 0.5)
    .attr('d', gauge.arc.endAngle(twoPi));

gauge.front = gauge.g.append('path')
    .attr('fill', color)
    .attr('fill-opacity', 1);

gauge.g.append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', '4.3em')
    .attr('dx', '-1em')
    .attr('font-size', '12px')
    .attr('font-family', 'sans-serif')
    .text('min');

gauge.g.append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', '4.3em')
    .attr('dx', '4.7em')
    .attr('font-size', '12px')
    .attr('font-family', 'sans-serif')
    .text('min');

gauge.updateServiceLevel = function(level) {
    gauge.front
    .attr('d', gauge.arc.endAngle(twoPi * level))
    .on("mousemove", function() {
      gauge.tooltip.style("left", d3.event.pageX+15+"px");
      gauge.tooltip.style("top", d3.event.pageY+"px");
      gauge.tooltip.style("display", "inline-block");
      gauge.tooltip.select("span")
      .text('Current Service Level: '+formatPercent(level));
    })
    .on("mouseout", function() {
      gauge.tooltip.style("display","none");
    });
};

gauge.updateAbadonedPercentage = function(percentage) {
    d3.select('#g-clip-rect').attr('height', 2*gauge.mainRadius*(1 - percentage));
    gauge.dropPrecentage.on('mousemove', function() {
        gauge.dropPrecentage.attr('fill', '#FB7374');
        gauge.tooltip.style("left", d3.event.pageX+10+"px");
        gauge.tooltip.style("top", d3.event.pageY-25+"px");
        gauge.tooltip.style("display", "inline-block");
        gauge.tooltip.select("span")
        .text(formatPercent(percentage)+' abandoned');
    })
    .on('mouseout', function() {
        gauge.dropPrecentage.attr('fill', '#FFB8B8');
        gauge.tooltip.style("display","none");
    });
};

gauge.updateNumberOfWaiting = function(number) {
    d3.select('#number-waiting').remove();
    gauge.g.append('text')
    .attr('id', 'number-waiting')
    .attr('text-anchor', 'middle')
    .attr('dy', '0em')
    .attr('font-size', '76px')
    .attr('font-family','sans-serif')
    .attr('fill','#676161')
    .attr('class', 'hover-text')
    .text(number)
    .on("mousemove", function() {
          gauge.tooltip.style("left", d3.event.pageX+10+"px");
          gauge.tooltip.style("top", d3.event.pageY-25+"px");
          gauge.tooltip.style("display", "inline-block");
          gauge.tooltip.select("span")
          .text('Number of Waiting: '+ number);
        })
        .on("mouseout", function() {
          gauge.tooltip.style("display","none");
        });
};

gauge.updateAverageWaitingTime = function(time) {
    d3.select('#average-wait').remove();
    gauge.g.append('text')
    .attr('id', 'average-wait')
    .attr('text-anchor', 'middle')
    .attr('dx', '-1.3em')
    .attr('dy', '1.8em')
    .attr('font-size','30px')
    .attr('font-family', 'sans-serif')
    .text(time)
        .attr('class', 'hover-text')
        .on("mousemove", function() {
          gauge.tooltip.style("left", d3.event.pageX+10+"px");
          gauge.tooltip.style("top", d3.event.pageY-25+"px");
          gauge.tooltip.style("display", "inline-block");
          gauge.tooltip.select("span")
          .text('Average Waiting Time: '+ time +' min');
        })
        .on("mouseout", function() {
          gauge.tooltip.style("display","none");
        });
};

gauge.updateLongestWaitingTime = function(time) {
    d3.select('#longest-waiting').remove();
    gauge.g.append('text')
    .attr('id', 'longest-waiting')
    .attr('text-anchor', 'middle')
    .attr('dx', '1em')
    .attr('dy', '1.8em')
    .attr('font-size','30px')
    .attr('font-family', 'sans-serif')
    .text(time)
        .attr('class', 'hover-text')
        .on('mousemove', function() {
          gauge.tooltip.style("left", d3.event.pageX+10+"px");
          gauge.tooltip.style("top", d3.event.pageY-25+"px");
          gauge.tooltip.style("display", "inline-block");
          gauge.tooltip.select("span")
          .text('Longest Waiting Time: '+ time +' min');
        })
        .on("mouseout", function() {
          gauge.tooltip.style("display","none");
        });
};

/*************Testing*************/

// Randomly generate fake data template
var data = {
    serviceLevel: 0.15,
    serviceLevelGoal: 0.8,
    numberOfWaiting: 20,
    abandonedPrecentage: 0.23,
    averageWaitTime: 10,
    longestWaiting: 60
};

var generate = function () {
    data.serviceLevel        = (Math.random()*0.65 + 0.15).toFixed(2);
    data.numberOfWaiting     = Math.floor(Math.random()*25 + 5);
    data.abandonedPrecentage = (Math.random()*0.2 + 0.2).toFixed(2);
    data.averageWaitTime     = Math.floor(Math.random()*20 +10);
    data.longestWaiting      = Math.floor(Math.random()*50 + 10);
    return data;
};

function run () {
    data = generate();
    gauge.updateServiceLevel(data.serviceLevel);
    gauge.updateAbadonedPercentage(data.abandonedPrecentage);
    gauge.updateNumberOfWaiting(data.numberOfWaiting);
    gauge.updateAverageWaitingTime(data.averageWaitTime);
    gauge.updateLongestWaitingTime(data.longestWaiting)
}
run();

setInterval(run, 2000);