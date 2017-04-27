# Flight Performances for each Carrier in 2016

## Summary
The chart shows the monthly flight delay ratios for each carrier in the year of 2016. The carriers are sorted by overall delay performance, and the total number of flights for each one is also depicted.

## Design
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
- Assured the order of the months also on Firefox;
- Changed the chart title from "2016 Flight Delays by Cause" to "Flight Performances for each Carrier in 2016";
- Added a "References" section to communicate the source of the dataset;
- Changed the y axis label from "Ratio" to "Flights Ratio", and made it show percentual values;
- Made the x axis of the secondary bar chart visible, to make it clearer that it was also a chart;
- Fixed the height of the stacked bar chart, so that the "Month" label would be visible.

## Feedback
### Laurent de Vito
"Hi,
Interestingly, in Firefox, the months are labeled 12,7,8,... whereas they are correctly labeled in Chromium, but usually, we cannot do much about it.
I find the title a bit misleading since you report not only the flights that were delayed but also those that were canceled.
Furthermore, could you please cite your sources ?
Overall, nicely done!"

### Morgana Secco (my wife)
"The y axis show a ratio between what?
You should make it clearer that the horizontal bars on the right display the total flights for each carrier.
There is no month label on the x axis."

### tianchuanting
"Hi Luiz,

After spending a minute or two looking at your visualisation, my impression is that it is a very well made visualization. I especially like the small details you put into it, like the tooltip and animated guideline. And here is a list of feedback for you consideration.

1. I had some difficulty understanding what the vertical axis 'flight delay' ratio means. Maybe using something like % of delayed flight might be intuitive.
2. Similarly, It took me a while to get what the 1-12 on the horizontal axis is presenting, maybe using month abbrev (Jan, Feb etc) instead will be a better idea.
LT"

## Resources
- http://dimplejs.org/examples_viewer.html?id=bars_vertical_stacked
- http://dimplejs.org/advanced_examples_viewer.html?id=advanced_storyboard_control
- https://codepen.io/mistkaes/pen/WvPrJL