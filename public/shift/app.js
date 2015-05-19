// a.acdDurationToday = args.acdDurationToday;
// a.doNotDisturbDurationToday = args.doNotDisturbDurationToday;
// a.holdAcdDurationToday = args.holdAcdDurationToday;
// a.holdNonAcdDurationToday = args.holdNonAcdDurationToday;
// a.holdOutboundDurationToday = args.holdOutboundDurationToday;
// a.makeBusyDurationToday = args.makeBusyDurationToday;
// a.nonAcdDurationToday = args.nonAcdDurationToday;
// a.outboundDurationToday = args.outboundDurationToday;
// a.workTimerDurationToday = args.workTimerDurationToday;
// a.averageAnsweredDurationToday = args.averageAnsweredDurationToday;
// a.loggedInDurationToday = args.loggedInDurationToday;
// a.lastLoginTime = args.lastLoginTime;
// a.lastLogoffTime = args.lastLogoffTime;
// a.loggedInNotPresentDurationToday = args.loggedInNotPresentDurationToday;
// a.externalAnswerDurationToday = args.externalAnswerDurationToday;

var data =  [
  {
    label: "Do not Disturb",
    value: 40,
    color: "red"
  },
  {
    label:  "Non ACD",
    value: 60,
    color: "green"
  },
  {
    label: "Outbound",
    value: 20,
    color: "yellow"
  },
  {
    label: "Work time",
    value: 10,
    color: "blue"
  },
  {
    label: "External Answer Duration",
    value: 30,
    color: "black"
  }
];

var userInfo = {
  name: "Victor Guo",
  agentType: "Email",
  img: "http://www.gravatar.com/avatar/d6841cf430543477f68981a3305ed120?d=https%3A%2F%2Flh6.googleusercontent.com%2F-KuHELFH6TKE%2FAAAAAAAAAAI%2FAAAAAAAAC6I%2FmUwyGNZZeY0%2Fphoto.jpg",
  loginTime: "May 12th, 2015",
  logoutTime: "Never"
};

var generate = function(){
  for (var i = 0; i < data.length; i++) {
    data[i].value = Math.random()*100;
  }
  return data;
};

/**
 * Agent Shift dashboard data virtualization
 */

$(function() {

var width = 300,
    height = 300,
    color = d3.scale.category20(),

    // set the thickness of the inner && outer radius
    viewBox     = Math.min(width, height),
    outerRadius = viewBox/2*0.9,
    innerRadius = viewBox/2*0.85,

    // construct default pie laoyut
    pie = d3.layout.pie().value(function(d) {
      return d.value;
    })
    .sort(null),

    // construct arc generator
    arc = d3.svg.arc().outerRadius(outerRadius).innerRadius(innerRadius);

// draw and append the container
var svg = d3.select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox",'0 0 '+viewBox+' '+viewBox)
    .attr("preserveAspectRatio","xMinYMin");

//  Pie chart container
var g = svg.append("g")
  .attr("transform", "translate("+width/2+","+height/2+")");

// tooltip container
var tooltip = d3.select(".tooltip");

// enter data and draw pie chart
var path = g.datum(data).selectAll("path")
    .data(pie)
    .enter()
    .append("path")
    .attr("fill", function(d,i){ return color(i); })
    .attr("d", arc)
    .each(function(d){ this._current = d; })
    .on("mousemove", function(d, i, j) {
      window.x = d3.event.pageX;
      window.y = d3.event.pageY;
      tooltip.style("left", d3.event.pageX+10+"px");
      tooltip.style("top", d3.event.pageY-25+"px");
      tooltip.style("display", "inline-block");
      tooltip.select("span").text(d.data.label+": "+Math.round(d.data.value));
    })
    .on("mouseout", function() {
      tooltip.style("display","none");
    });

g.append("svg:image")
  .attr("width", 80)
  .attr("height", 80)
  .attr("xlink:href", userInfo.img)
  .attr("x",-1*80/2)
  .attr("y",-1*140/2);

g.append("text")
  .attr("dy", "2em")
  .style("text-anchor", "middle")
  .text(function() { return userInfo.agentType+" - "+userInfo.name;});

g.append("text")
  .attr("dy", "4em")
  .style("text-anchor", "middle")
  .text(function() { return "Login time: "+userInfo.loginTime;});

g.append("text")
  .attr("dy", "6em")
  .style("text-anchor", "middle")
  .text(function() { return "Logout time: "+userInfo.logoutTime;});

var render = function(data){
  // add transition to new path
  g.datum(data).selectAll("path")
    .data(pie)
    .transition()
    .duration(1000)
    .attrTween("d",  function(a) {
      var i = d3.interpolate(this._current, a);
      this._current = i(0);
      return function(t) {
        return arc(i(t));
      };
    });

  // add any new paths
  g.datum(data).selectAll("path")
    .data(pie)
    .enter().append("path")
    .attr("fill", function(d,i){ return color(i); })
    .attr("d", arc)
    .each(function(d){ this._current = d; });

  // remove data not being used
  g.datum(data).selectAll("path")
    .data(pie).exit().remove();
  };

  render(data);
  setInterval(function () {
    render(generate());
  },2000);
});