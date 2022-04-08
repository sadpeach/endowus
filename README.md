# Getting Started 
To start the project
  1. navigate to the project directory
  2. **_npm run dev_**

# Components and Directory Description

## ChartComponent/
- contains all the components required to draw the line graph.

### ChartComponent/Axis.js
- Components to draw Axis on graph.

### ChartComponent/PlotLine.js
- Components to draw data line on graph.

### ChartComponent/TooltipMouse.js
- Contains all components required to create tooltip message box when mouse is hovered over the graph.
  -  Component to show verticle line when hovering graph.
  -  Component to show data dots on each plotted line when hovering graph.
  -  Component to hold the tooltip message.

### ChartComponent/ChartUtils/

### ChartComponent/ChartUtils/utils.js
- contains common functions such as reformatting, regrouping, and color labeling of the data retrieved from API.

### ChartComponent/ChartUtils/axisUtils.js
- contains the yScale and yScale created based on the data retrieved from API to be used as the axis of the line graph.
- contains the format for the scale. (e.g. displaying axis in SGD)

