$(function(){
    var tooltip = d3.select(".tooltip");
    var $container = $('.chart-container'),
        width = $container.width(),
        height = $container.height(),
        innerRadius = Math.min(width,height)/4,
        fontSize = (Math.min(width,height)/4);

var dataset = {
  weeks: [20,80],
  trimester: [40,60]
};

var currentWeek = 23;

var seriesNames = ["Vecka","Trimester"];


var color = d3.scale.ordinal().range(["#8DD5A0","#ff6666"]);


var pie = d3.layout.pie()
    .sort(null);

var arc = d3.svg.arc();

var svg = d3.select('.chart-container').append("svg")
        .attr("width", '100%')
        .attr("height", '100%')
        .attr('viewBox','0 0 '+Math.min(width,height) +' '+Math.min(width,height) )
        .attr('preserveAspectRatio','xMinYMin')
        .append("g")
        .attr("transform", "translate(" +  width / 2 + "," + height / 2 + ")");

var gs = svg.selectAll("g")
    .data(d3.values(dataset))
    .enter()
    .append("g")
    .attr("class", "arc");

var path = gs.selectAll("path")
    .data(function(d) { return pie(d); })
  .enter().append("path")
    .attr("fill", function(d, i) {
      return color(i);
    })
    .attr("d", function(d, i, j) {
      return arc.innerRadius(innerRadius+(40*j)).outerRadius(innerRadius+40+(40*j))(d);
    })
    .attr("class", function(d, i, j) {
     if (i>=currentWeek && j<1) return "passed" ;
      })
  .on("mousemove", function(d,i,j){
      tooltip.style("left", d3.event.pageX+10+"px");
      tooltip.style("top", d3.event.pageY-25+"px");
      tooltip.style("display", "inline-block");
      tooltip.select("span").text(seriesNames[j]+" "+(i+1));
  })
  .on("mouseout",function(){
      tooltip.style("display","none");
});
});