"use strict"

function orderRule(a, b) {
  console.log(a);
  var aTotal = 0,
      bTotal = 0, 
      aDelay = 0, 
      bDelay = 0;
  for (var i = a.Status.length - 1; i >= 0; i--) {
    aDelay += Number(a.Flights[i]);
    bDelay += Number(b.Flights[i]);
    // This could be any status. It is just to sum the total flights.
    if (a.Status[i] == "NAS") {
      aTotal += Number(a.Flights[i]) / Number(a["Flights Ratio"][i]);
    }
    if (b.Status[i] == "NAS") {
      bTotal += Number(b.Flights[i]) / Number(b["Flights Ratio"][i]);
    }
  }
  return (aDelay / aTotal) >= (bDelay / bTotal) ? -1 : 1;
}

// Dimple has a bug that doubles the lenght of an array if it is being used as
// a series in the chart. In this case, the Flights array.
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
  var width = 960;
  var height = 400;
  var frameDuration = 2500;

  var svg = dimple.newSvg("#chartContainer", width, height);

  var indicator = new dimple.chart(svg, data);
  indicator.setBounds(
    .75 * width,
    .1 * height, 
    .22 * width, 
    .80 * height);

  var defaultColor = indicator.defaultColors[0];
  var indicatorColor = indicator.defaultColors[2];

  var y = indicator.addCategoryAxis("y", "Carrier Name");
  y.addOrderRule(orderRuleBug);
  var x = indicator.addMeasureAxis("x", "Flights");
  // x.hidden = true;
  x.showGridlines = false;
  x.ticks = 5;
  var s = indicator.addSeries(null, dimple.plot.bar);
  s.addEventHandler("click", onClick);
  
  indicator.draw();

  y.titleShape.remove();
  y.shapes.selectAll("line,path").remove();
  y.shapes.selectAll("text")
          .style("text-anchor", "start")
          .style("font-size", "11px")
          .attr("transform", "translate(18, 0.5)");

  svg.selectAll("title_text")
          .data(["Click bar to select and pause.",
                 "Click again to resume animation"])
          .enter()
          .append("text")
          .attr("x", .75 * width)
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

  var stacked_data = dimple.filterData(data, "Status", [
    "Late Aircraft",
    "NAS", 
    "Carrier", 
    "Cancelled",
    "Weather", 
    "Diverted", 
    "Security"
  ]);

  var stacked = new dimple.chart(svg, stacked_data);
  stacked.setBounds(
    .06 * width,
    .07 * height,
    .68 * width,
    .83 * height);

  var stackedX = stacked.addCategoryAxis("x", "Month");
  stackedX.addOrderRule("Month");
  var stackedY = stacked.addMeasureAxis("y", "Flights Ratio");
  stackedY.overrideMax = 0.4;
  // stackedY.tickFormat = "%";
  // var p = Math.max(0, d3.precisionFixed(0.05) - 2),
  // f = d3.format("." + p + "%");
  stackedY.tickFormat = "1.0%";
  stacked.addSeries("Status", dimple.plot.bar)
  stacked.addLegend(
    .07 * width,
    .02 * height,
    .68 * width,
    .1 * height);

  var firstTick = true;

  var story = stacked.setStoryboard("Carrier Name", onTick);
  story.frameDuration = frameDuration;
  story.addOrderRule(orderRule, true);

  stacked.draw();

  stacked.legends = [];
  story.storyLabel.remove();

  function onClick(e) {
    story.pauseAnimation();
    if (e.yValue === story.getFrameValue()) {
      story.startAnimation();
    } else {
      story.goToFrame(e.yValue);
      story.pauseAnimation();
    }
  }

  function onTick(e) {
    if (!firstTick) {
      s.shapes
        .transition()
        .duration(frameDuration / 2)
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
