// stop the enterprise service
// go to C:\Program Files (x86)\Mitel\MiContact Center\DataDirectory
// Delete every directory like Node_01
// leave NodeTime
// then start the enterprise server

angular.module('widget.shift').directive('shiftChart', function () {
    return {
        restrict: 'E',
        scope: {
            data: '=',
            user: '='
        },
        template:'<div class="tooltip"><span></span></div>',
        link: function (scope, element) {
            var width = 200,
                height = 200,
                color = d3.scale.category20(),
                userInfo = scope.user,
                userData = scope.data,

                // set the thickness of the inner && outer radius
                viewBox = Math.min(width, height),
                outerRadius = viewBox / 2 * 0.9,
                innerRadius = viewBox / 2 * 0.85,

                // construct default pie laoyut
                pie = d3.layout.pie().value(function (d) {
                    return d.value;
                })
                .sort(null),

                // construct arc generator
                arc = d3.svg.arc().outerRadius(outerRadius).innerRadius(innerRadius),

                //dummy display text if the userData is all zero
                dummyEntry = {
                    label: "The Agent has no data in the system",
                    value: 100
                },

                //User data validator
                userDataChecker = function (data) {
                    for (var i = data.length - 1; i >= 0; i--) {
                        if (data[i].value === 0 || data[i].label === dummyEntry.label) {
                            data.splice(i, 1);
                        }
                    }

                    if (data.length === 0) {
                        data.push(dummyEntry);
                    }
                };

                userDataChecker(userData);

                // draw and append the container
                var svg = d3.select(element[0])
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .attr("viewBox", '0 0 ' + viewBox + ' ' + viewBox)
                    .attr("preserveAspectRatio", "xMinYMin");

                //  pie chart container
                var g = svg.append("g")
                  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

                // append user info to the center of the chart
                var updateUserInfo = function (info) {
                    g.selectAll("text").remove();
                    g.append("svg:image")
                        .attr("width", 60)
                        .attr("height", 60)
                        .attr("xlink:href", info.img)
                        .attr("x", -31)
                        .attr("y", -70);

                    g.append("text")
                        .attr("dy", "1em")
                        .style("text-anchor", "middle")
                        .style("font-size", "12px")
                        .text(function () { return info.agentType + " - " + info.name; });

                    g.append("text")
                        .attr("dy", "3em")
                        .style("text-anchor", "middle")
                        .style("font-size", "12px")
                        .text(function () { return "Login time: " + info.loginTime; });

                    g.append("text")
                        .attr("dy", "5em")
                        .style("text-anchor", "middle")
                        .style("font-size", "12px")
                        .text(function () { return "Logout time: " + info.logoutTime; });
                };

                // tooltip container
                var tooltip = d3.select(".tooltip");

                // enter data and draw pie chart and append path in g
                g.datum(userData).selectAll("path")
                    .data(pie)
                    .enter()
                    .append("path")
                    .attr("fill", function(d,i){ return color(i); })
                    .attr("d", arc)
                    .each(function(d){ this._current = d; })
                    .on("mousemove", function(d) {
                      tooltip.style("left", d3.event.pageX-150+"px");
                      tooltip.style("top", d3.event.pageY-90+"px");
                      tooltip.style("display", "inline-block");
                      tooltip.select("span").text(function () {
                          console.log("tool tip data: "+d);
                          if (d.data.label !== dummyEntry.label) {
                              return d.data.label + ": " + d.data.duration;
                          } else {
                              return d.data.label;
                          }
                      });
                    })
                    .on("mouseout", function() {
                      tooltip.style("display","none");
                    });
                updateUserInfo(userInfo);

                scope.renderData = function (data) {
                    console.log("rendering new data: "+data);
                    userDataChecker(data);
                    // add transition to new path
                    g.datum(data).selectAll("path")
                      .data(pie)
                      .transition()
                      .duration(1000)
                      .attrTween("d", function (a) {
                          var i = d3.interpolate(this._current, a);
                          this._current = i(0);
                          return function (t) {
                              return arc(i(t));
                          };
                      });

                    // add any new paths
                    g.datum(data).selectAll("path")
                      .data(pie)
                      .enter().append("path")
                      .attr("fill", function (d, i) { return color(i); })
                      .attr("d", arc)
                      .each(function (d) { this._current = d; });

                    // remove data not being used
                    g.datum(data).selectAll("path")
                      .data(pie).exit().remove();
                };

            scope.renderInfo = function(info) {
                updateUserInfo(info);
            };

            //Watch 'data' value and re-render the chart
            scope.$watch('data', function() {
                scope.renderData(scope.data);
            }, true);

            //Watch 'user' value and re-render the chart
            scope.$watch('user', function() {
                scope.renderInfo(scope.user);
            }, true);
        }
    };
});