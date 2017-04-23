# 2016 Flight Delays by Cause

## Summary
The chart shows the monthly flight delay ratios for each carrier in the year of 2016. The carriers are sorted by overall delay performance, and the total number of flights for each one is also depicted.

## Design

Initial design decisions such as chart type, visual encodings, layout, legends, or hierarchy are included at the beginning of the Design section in the README.md file.

I chose to draw a main stacked bar chart with the following visual encodings:
- The ratio between delayed and total flights is represented vertically on the y axis;
- Months are displayed horizontally on the x axis;
- Delay categories are represented by different colors;

There is also a secondary bar chart with the following visual encodings:
- Carrier names are displayed vertically;
- Total flights for each carrier are represented by the lenghts of the horizontal bars.

At first I made the stacked bars show the number of delayed flights, however, the x axis scale changed too much between carriers, so I changed it to show ratios, so that the scales would be comparable.
I chose not to show "on time" flights on the chart, so I could zoom in the scale, allowing a better visualization of the delay causes.

After collecting feedback I changed the following:
- Item 1
- Item 2
- Etc

## Feedback
- "Hey, it looks nice :)"
- "Yo, you suck"
- "Well, whatever"

## Resources
- http://dimplejs.org/examples_viewer.html?id=bars_vertical_stacked
- http://dimplejs.org/advanced_examples_viewer.html?id=advanced_storyboard_control