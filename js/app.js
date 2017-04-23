"use strict"

// function draw(data) {
//   var svg = dimple.newSvg("#chartContainer", 590, 400);
//   var myChart = new dimple.chart(svg, data);
//   var x = myChart.addCategoryAxis("x", "month");
//   // var y = myChart.addPctAxis("y", "ratio");
//   var y = myChart.addMeasureAxis("y", "ratio");  
//   // y.showPercent = true;
//   myChart.addSeries("status", dimple.plot.bar);
//   myChart.addLegend(60, 10, 500, 20, "right");
//   myChart.draw();
// }

// d3.csv("../data/2016_delays.csv", draw);

// function orderRule(a, b) {
//   var aTotal = 0,
//       bTotal = 0, 
//       aOnTime = 0, 
//       bOnTime = 0;
//   for (var i = a.status.length - 1; i >= 0; i--) {
//     aTotal += Number(a.sum[i]);
//     bTotal += Number(b.sum[i]);
//     if (a.status[i] == "on_time") {
//       aOnTime += Number(a.sum[i]);
//     }
//     if (b.status[i] == "on_time") {
//       bOnTime += Number(b.sum[i]);
//     }
//   }
//   return (aOnTime / aTotal) >= (bOnTime / bTotal) ? 1 : -1;
// }

function orderRule(a, b) {
  var aTotal = 0,
      bTotal = 0, 
      aDelay = 0, 
      bDelay = 0;
  for (var i = a.Status.length - 1; i >= 0; i--) {
    aDelay += Number(a.Flights[i]);
    bDelay += Number(b.Flights[i]);
    if (a.Status[i] == "NAS") {
      aTotal += Number(a.Flights[i]) / Number(a.Ratio[i]);
    }
    if (b.Status[i] == "NAS") {
      bTotal += Number(b.Flights[i]) / Number(b.Ratio[i]);
    }
  }
  return (aDelay / aTotal) >= (bDelay / bTotal) ? -1 : 1;
}

function orderRuleBug(a, b) {
  var aTotal = 0,
      bTotal = 0, 
      aOnTime = 0, 
      bOnTime = 0;
  for (var i = a.Status.length - 1; i >= 0; i--) {
    aTotal += Number(a.Flights[2*i]);
    bTotal += Number(b.Flights[2*i]);
    if (a.Status[i] == "On Time") {
      aOnTime += Number(a.Flights[2*i]);
    }
    if (b.Status[i] == "On Time") {
      bOnTime += Number(b.Flights[2*i]);
    }
  }
  return (aOnTime / aTotal) >= (bOnTime / bTotal) ? 1 : -1;
}


function draw(data) {
  var svg = dimple.newSvg("#chartContainer", 590, 400);

  // Create the indicator chart on the right of the main chart
  var indicator = new dimple.chart(svg, data);

  // Pick blue as the default and orange for the selected month
  var defaultColor = indicator.defaultColors[0];
  var indicatorColor = indicator.defaultColors[2];

  // Place the indicator bar chart to the right
  indicator.setBounds(434, 49, 153, 311);

  // Add dates along the y axis
  var y = indicator.addCategoryAxis("y", "Carrier Name");
  y.addOrderRule(orderRuleBug);

  // Use sales for bar size and hide the axis
  var x = indicator.addMeasureAxis("x", "Flights");
  x.hidden = true;

  // Add the bars to the indicator and add event handlers
  var s = indicator.addSeries(null, dimple.plot.bar);
  s.addEventHandler("click", onClick);
  // Draw the side chart
  indicator.draw();

  // Remove the title from the y axis
  y.titleShape.remove();

  // Remove the lines from the y axis
  y.shapes.selectAll("line,path").remove();

  // Move the y axis text inside the plot area
  y.shapes.selectAll("text")
          .style("text-anchor", "start")
          .style("font-size", "11px")
          .attr("transform", "translate(18, 0.5)");

  // This block simply adds the legend title. I put it into a d3 data
  // object to split it onto 2 lines.  This technique works with any
  // number of lines, it isn't dimple specific.
  svg.selectAll("title_text")
          .data(["Click bar to select",
              "and pause. Click again",
              "to resume animation"])
          .enter()
          .append("text")
          .attr("x", 435)
          .attr("y", function (d, i) { return 15 + i * 12; })
          .style("font-family", "sans-serif")
          .style("font-size", "10px")
          .style("color", "Black")
          .text(function (d) { return d; });

  var selected = "Hawaiian Airlines Inc.";

  // Manually set the bar colors
  s.shapes
          .attr("rx", 10)
          .attr("ry", 10)
          .style("fill", function (d) { 
            return (d.y === selected ? 
              indicatorColor.fill : 
              defaultColor.fill) })
          .style("stroke", function (d) { 
            return (d.y === selected ? 
              indicatorColor.stroke : 
              defaultColor.stroke) })
          .style("opacity", 0.4);

  var bubbles_data = dimple.filterData(data, "Status", [
    "Late Aircraft",
    "NAS", 
    "Carrier", 
    "Cancelled",
    "Weather", 
    "Diverted", 
    "Security"
  ]);

  // Draw the main chart
  var bubbles = new dimple.chart(svg, bubbles_data);
  bubbles.setBounds(60, 50, 355, 310)
  bubbles.addCategoryAxis("x", "Month");
  var bubblesY = bubbles.addMeasureAxis("y", "Ratio");
  bubblesY.overrideMax = 0.4;
  // bubbles.addMeasureAxis("y", "sum");
  // var bubblesY = bubbles.addPctAxis("y", "sum");
  // bubblesY.showPercent = true;
  bubbles.addSeries("Status", dimple.plot.bar)
  bubbles.addLegend(60, 10, 410, 60);

  // The frame duration for the animation in milliseconds
  var frame = 2000;

  var firstTick = true;

  // Add a storyboard to the main chart and set the tick event
  var story = bubbles.setStoryboard("Carrier Name", onTick);
  // Change the frame duration
  story.frameDuration = frame;
  // Order the storyboard by date
  // TODO: Ordenar por total de voos atrasados ou por ultimo mes?
  story.addOrderRule(orderRule, true);

  // Draw the bubble chart
  bubbles.draw();

  // Orphan the legends as they are consistent but by default they
  // will refresh on tick
  bubbles.legends = [];
  // Remove the storyboard label because the chart will indicate the
  // current month instead of the label
  story.storyLabel.remove();

  // On click of the side chart
  function onClick(e) {
      // Pause the animation
      story.pauseAnimation();
      // If it is already selected resume the animation
      // otherwise pause and move to the selected month
      if (e.yValue === story.getFrameValue()) {
          story.startAnimation();
      } else {
          story.goToFrame(e.yValue);
          story.pauseAnimation();
      }
  }

  // On tick of the main charts storyboard
  function onTick(e) {
      if (!firstTick) {
          // Color all shapes the same
          s.shapes
                  .transition()
                  .duration(frame / 2)
                  .style("fill", function (d) { 
                    return (d.y === e ? 
                      indicatorColor.fill : 
                      defaultColor.fill) })
                  .style("stroke", function (d) { 
                    return (d.y === e ? 
                      indicatorColor.stroke : 
                      defaultColor.stroke) });
      }
      firstTick = false;
  }
}

d3.csv("../data/2016_delays.csv", draw);
