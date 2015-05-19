//Global variable - data input
var dataset = [
  {
    label: "Do not Disturb",
    value: [40, 60],
  },
  {
    label:  "Non ACD",
    value: [60, 40]
  },
  {
    label: "Outbound",
    value: [20, 80]
  },
  {
    label: "Work time",
    value: [10, 90]
  }
];

$(function(){

var tooltip     = d3.select(".tooltip"),
    $container  = $('.chart-container'),

    //Layouts
    pie         = d3.layout.pie().sort(null);
    arc         = d3.svg.arc(),
    color       = d3.scale.ordinal().range(["#8DD5A0", "#ffffff"]),

    //Diemension
    width       = 200,
    height      = 200,
    viewBox     = Math.min(width, height),
    innerRadius = viewBox/400,
    fontSize    = viewBox/400;

var svg = d3.select('.chart-container').append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr('viewBox','0 0 '+viewBox+' '+viewBox)
        .attr('preserveAspectRatio','xMinYMin')
        .append("g")
        .attr("transform", "translate("+width/2+","+height/2+")");

var gs = svg.selectAll("g")
            .data(d3.values(dataset))
            .enter()
            .append("g")
            .attr("class", "arc");

var path = gs.selectAll("path")
  .data(function(d) {
    return pie(d.value);
  })
  .enter().append("path")
  .attr("fill", function(d, i) {
    return color(i);
  })
  .attr("d", function(d, i, j) {
    return arc.innerRadius(innerRadius+(15*j))
              .outerRadius(innerRadius+15+(15*j))(d);
  })
  .on("mousemove", function(d,i,j){
    //Only display tooltip for the time duration portion
    if (i==0) {
      tooltip.style("left", d3.event.pageX+10+"px");
      tooltip.style("top", d3.event.pageY-25+"px");
      tooltip.style("display", "inline-block");
      tooltip.select("span").text(dataset[j].label+": "+dataset[j].value);
    }
  })
  .on("mouseout",function(){
      tooltip.style("display","none");
  });
});