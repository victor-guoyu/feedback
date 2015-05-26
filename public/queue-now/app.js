
/*******Global Config*******/
var twoPi = Math.PI * 2,
    color                    = '#47e495',
    currentServiceLevel      = 0.15,
    abandonedPrecentage      = 0.23,
    serviceLevelGoal         = 0.8,
    numberOfWaiting          = 20,
    averageWaitTime          = 10,
    longestWaiting           = 60,
    containerId              = '#queue',
    formatPercent            = d3.format('.0%'),
    gauge                    = {},
    serviceLevelCount        = Math.abs((currentServiceLevel - 0) / 0.01),
    abandonedPrecentageCount = Math.abs(abandonedPrecentage/0.01),
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

gauge.filter = gauge.svg.append('defs')
    .append('filter')
    .attr('id', 'blur')
    .append('feGaussianBlur')
    .attr('in', 'SourceGraphic')
    .attr('stdDeviation', '3');

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

gauge.dropPrecentage.on('mousemove', function() {
        gauge.dropPrecentage.attr('fill', '#FB7374');
        window.x = d3.event.pageX;
        window.y = d3.event.pageY;
        gauge.tooltip.style("left", d3.event.pageX+10+"px");
        gauge.tooltip.style("top", d3.event.pageY-25+"px");
        gauge.tooltip.style("display", "inline-block");
        gauge.tooltip.select("span").text(formatPercent(abandonedPrecentage)+' abandoned');
    })
    .on('mouseout', function() {
        gauge.dropPrecentage.attr('fill', '#FFB8B8');
        gauge.tooltip.style("display","none");
    });


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

gauge.numberOfWaiting = gauge.g.append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', '0em')
    .attr('font-size', '76px')
    .attr('font-family','sans-serif')
    .attr('fill','#676161')
    .attr('class', 'hover-text')
    .text(numberOfWaiting)
    .on("mousemove", function() {
          window.x = d3.event.pageX;
          window.y = d3.event.pageY;
          gauge.tooltip.style("left", d3.event.pageX+10+"px");
          gauge.tooltip.style("top", d3.event.pageY-25+"px");
          gauge.tooltip.style("display", "inline-block");
          gauge.tooltip.select("span").text('Number of Waiting: '+ numberOfWaiting);
        })
        .on("mouseout", function() {
          gauge.tooltip.style("display","none");
        });

gauge.averageWaitTime = gauge.g.append('text')
    .attr('text-anchor', 'middle')
    .attr('dx', '-1.3em')
    .attr('dy', '1.8em')
    .attr('font-size','30px')
    .attr('font-family', 'sans-serif')
    .text(averageWaitTime)
        .attr('class', 'hover-text')
        .on("mousemove", function() {
          window.x = d3.event.pageX;
          window.y = d3.event.pageY;
          gauge.tooltip.style("left", d3.event.pageX+10+"px");
          gauge.tooltip.style("top", d3.event.pageY-25+"px");
          gauge.tooltip.style("display", "inline-block");
          gauge.tooltip.select("span").text('Average Waiting Time: '+ averageWaitTime+' min');
        })
        .on("mouseout", function() {
          gauge.tooltip.style("display","none");
        });

gauge.longestWaiting = gauge.g.append('text')
    .attr('text-anchor', 'middle')
    .attr('dx', '1em')
    .attr('dy', '1.8em')
    .attr('font-size','30px')
    .attr('font-family', 'sans-serif')
    .text(longestWaiting)
        .attr('class', 'hover-text')
        .on('mousemove', function() {
          window.x = d3.event.pageX;
          window.y = d3.event.pageY;
          gauge.tooltip.style("left", d3.event.pageX+10+"px");
          gauge.tooltip.style("top", d3.event.pageY-25+"px");
          gauge.tooltip.style("display", "inline-block");
          gauge.tooltip.select("span").text('Longest Waiting Time: '+longestWaiting+' min');
        })
        .on("mouseout", function() {
          gauge.tooltip.style("display","none");
        });

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

gauge.updateServiceLevelProgress = function(progress) {
    gauge.front
    .attr('d', gauge.arc.endAngle(twoPi * progress))
    .on("mousemove", function() {
      window.x = d3.event.pageX;
      window.y = d3.event.pageY;
      gauge.tooltip.style("left", d3.event.pageX+15+"px");
      gauge.tooltip.style("top", d3.event.pageY+"px");
      gauge.tooltip.style("display", "inline-block");
      gauge.tooltip.select("span").text('Current Service Level: '+formatPercent(progress));
    })
    .on("mouseout", function() {
      gauge.tooltip.style("display","none");
    });
};

gauge.updateAbadonedPercentage = function(progress) {
    d3.select('#g-clip-rect').attr('height', 2*gauge.mainRadius*(1 - progress));
};

// gauge.updateServiceLevel = function(progress) {
//     gauge.renderServiceLevelProgress(gauge.serviceLevelProgress);

//     if (serviceLevelCount > 0) {
//         var step = 0.01;
//         serviceLevelCount--;
//         gauge.serviceLevelProgress += step;
//         setTimeout(gauge.updateServiceLevel, 10);
//     }
// };

// gauge.updateAbandonedPrecentage = function(percentage) {
//     gauge.renderAbadonedPercentage(gauge.abadonedPercentageProgress);

//     if (abandonedPrecentageCount > 0) {
//         var step =  0.01;
//         abandonedPrecentageCount--;
//         gauge.abadonedPercentageProgress += step;
//         setTimeout(gauge.updateAbandonedPrecentage, 15);
//     }
// };


// Randomly generate fake data
var data = {
    serviceLevel: 0.15,
    numberOfWaiting: 20,
    abandonedPrecentage: 0.23,
    averageWaitTime: 10,
    longestWaiting: 60
};

