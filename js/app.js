"use strict"

function draw(data) {
  // carriers sorted by overall 'on time' rate
  var carriers = [
    "Spirit Air Lines",
    "JetBlue Airways",
    "Frontier Airlines Inc.",
    "Virgin America",
    "American Airlines Inc.",
    "ExpressJet Airlines Inc.",
    "Southwest Airlines Co.",
    "United Air Lines Inc.",
    "SkyWest Airlines Inc.",
    "Delta Air Lines Inc.",
    "Alaska Airlines Inc.",
    "Hawaiian Airlines Inc."];

  var carrierCodes = [
    "NK",
    "B6",
    "F9",
    "VX",
    "AA",
    "EV",
    "WN",
    "UA",
    "OO",
    "DL",
    "AS",
    "HA"];

  function getCarrier(code) {
    var index = carrierCodes.indexOf(code);
    return carriers[index];
  }

  var width = 960;
  var height = 400;
  var frameDuration = 2000;

  var svg = dimple.newSvg("#chartContainer", width, height);

  var indicator = new dimple.chart(svg, data);
  indicator.setBounds(
    // .795 * width,
    .775 * width,
    .1 * height, 
    .17 * width, 
    .8 * height);

  indicator.defaultColors = [
    new dimple.color("#bdbdbd", "#555"),
    new dimple.color("#636363", "#555")
  ];

  var defaultColor = indicator.defaultColors[0];
  var indicatorColor = indicator.defaultColors[1];

  var y = indicator.addCategoryAxis("y", "Carrier Code");
  y.addOrderRule(carrierCodes);
  var x = indicator.addMeasureAxis("x", "Total Flights");
  x.showGridlines = false;
  x.ticks = 5;
  var s = indicator.addSeries("Carrier Name", dimple.plot.bar);
  s.addEventHandler("click", onClick);
  
  indicator.draw();

  y.titleShape.remove();
  y.shapes.selectAll("line,path").remove();
  // y.shapes.selectAll("text")
  //         .style("text-anchor", "start")
  //         .style("font-size", "11px")
  //         .attr("transform", "translate(18, 0.5)");

  // var ranking = [];
  // for (var i = 12; i >= 1; i--) {
  //   ranking.push(i);
  // }
  // svg.selectAll("title_text")
  //         .data(ranking)
  //         .enter()
  //         .append("text")
  //         .attr("x", .748 * width)
  //         .attr("y", function (d, i) { return height * (.1425 + i * .0666); })
  //         .style("font-family", "sans-serif")
  //         .style("font-size", "11px")
  //         .style("color", "Black")
  //         .text(function (d) { return "#" + ("0" + d).slice(-2); });

  var pause = svg.append("g")
    .attr("class", "pause");
  pause.append("path")
    .attr("d", "M11,10 L17,10 17,26 11,26 M20,10 L26,10 26,26 20,26")
    .attr("transform", 
      "translate(" + .76 * width + "," + -.02 * height + ") scale(1.2)");

  var play = svg.append("g")
    .attr("class", "play")
    .style("visibility", "hidden");
  play.append("path")
    .attr("d", "M11,10 L18,13.74 18,22.28 11,26 M18,13.74 L26,18 26,18 18,22.28")
    .attr("transform", 
      "translate(" + .76 * width + "," + -.02 * height + ") scale(1.2)");

  pause.on("click", onPause);
  play.on("click", onPlay);

  function onPause() {
    story.pauseAnimation();
    pause.style("visibility", "hidden");
    play.style("visibility", "visible");
  }

  function onPlay() {
    story.startAnimation();
    play.style("visibility", "hidden");
    pause.style("visibility", "visible");
  }

  var selected = carrierCodes[carrierCodes.length - 1];

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
    "Delayed",
    "Cancelled or Diverted"
  ]);

  var stacked = new dimple.chart(svg, stacked_data);
  stacked.setBounds(
    .06 * width,
    .1 * height,
    .68 * width,
    .8 * height);

  var stackedX = stacked.addCategoryAxis("x", "Month");
  stackedX.addOrderRule("Month Order");

  var stackedY = stacked.addMeasureAxis("y", "Flights Ratio");
  stackedY.overrideMax = 0.4;
  stackedY.tickFormat = "1.0%";

  stacked.addSeries("Status", dimple.plot.bar)
  stacked.addLegend(
    .48 * width,
    .03 * height,
    .3 * width,
    .1 * height);

  var firstTick = true;

  var story = stacked.setStoryboard("Carrier Name", onTick);
  story.frameDuration = frameDuration;
  story.addOrderRule(carriers, true);

  stacked.draw();

  stacked.legends = [];

  // Remove dimple storyboard title to include a custom one.
  story.storyLabel.remove();
  svg.append("text")
    .attr("class", "stacked_title")
    .attr("x", .0 * width)
    .attr("y", .05 * height)
    .style("font-family", "Helvetica Neue, Helvetica, sans-serif")
    .style("font-size", "1.5em")
    .style("color", "Black")
    .style("font-weight", "bold")
    .text(getTitle());

  // Returns the formatted title
  function getTitle() {
    var carrier = story.getFrameValue();
    var index = carriers.indexOf(carrier) + 1;
    return "#" + ("0" + index).slice(-2)+ " - " + carrier;
  }

  function onClick(e) {
    onPause();
    if (getCarrier(e.yValue) === story.getFrameValue()) {
      onPlay();
    } else {
      story.goToFrame(getCarrier(e.yValue));
      onPause();
    }
  }

  // keep state to check if title transition is needed
  var currentFrameValue = carriers[carriers.length - 1];

  function onTick(e) {
    if (!firstTick) {
      s.shapes
        .transition()
        .duration(frameDuration / 2)
        .style("fill", function (d) {
          return (getCarrier(d.y) === e ?
            indicatorColor.fill : 
            defaultColor.fill) })
        .style("stroke", function (d) { 
          return (getCarrier(d.y) === e ? 
            indicatorColor.stroke : 
            defaultColor.stroke) });
    }
    firstTick = false;

    // Update stacked bar chart title
    if (currentFrameValue != e) {
      svg.selectAll(".stacked_title")
        .transition()
        .duration(frameDuration / 4)
        .style("opacity", 0)
        .transition()
        .duration(frameDuration / 4)
        .text(getTitle()) 
        .style("opacity", 1);
    }

    // Pause animation when it reaches last carrier
    if (e == carriers[0]) {
      onPause();
    }

    currentFrameValue = e;
  }
}

d3.csv("../data/2016_delays.csv", draw);
