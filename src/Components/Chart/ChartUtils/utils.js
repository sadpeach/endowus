import * as d3 from 'd3';
import { nest } from 'd3-collection';

var toolTipContentHolder;
//dataRestyle
export const restyleData = (dataToProces) => {

    var newData = [];

    for (let item of dataToProces) {

        let holder = {};

        holder["type"] = "10";
        holder["yearMonth"] = item["yearMonth"];
        holder["value"] = item["expectedAmounts"]["10"];
        newData.push(holder);

        holder = {};
        holder["type"] = "50";
        holder["yearMonth"] = item["yearMonth"];
        holder["value"] = item["expectedAmounts"]["50"];
        newData.push(holder);

        holder = {};
        holder["type"] = "75";
        holder["yearMonth"] = item["yearMonth"];
        holder["value"] = item["expectedAmounts"]["75"];
        newData.push(holder);

        holder = {}
        holder["type"] = "totalDeposit";
        holder["yearMonth"] = item["yearMonth"];
        holder["value"] = item["totalDeposit"];
        newData.push(holder);

        holder = {};
        holder["type"] = "benchmark";
        holder["yearMonth"] = item["yearMonth"];
        holder["value"] = item["expectedAmounts"]["benchmark"];
        newData.push(holder);
    }

    return newData;

}

//x-axis
export const setXAxis = (processData, svgWidth) => d3.scaleTime()
    .domain(d3.extent(processData, function (d) {
        var date = Date.parse(d.yearMonth);
        return date;
    }))
    .range([0, svgWidth])


//y-axis
export const setYAxis = (processData, svgHeight) => d3.scaleLinear()
    .domain([0, d3.max(processData, function (d) {
        return d.value;
    })])
    .range([svgHeight, 0])

//plot axis
export const drawAxis = ({
    container, xScale, yScale, tickFormat, transform
}) => {
    const scale = xScale || yScale;
    const axisGenerator = xScale ? d3.axisBottom : d3.axisLeft;

    const axis = axisGenerator(scale)
        .tickFormat(tickFormat);

    const axisGroup = container.append("g")
        .attr("class", "axis")
        .attr("transform", transform)
        .call(axis);

    return axisGroup;
};

//grouped data
export const reGroupData = (processData) => {
    return nest()
        .key(d => d.type)
        .entries(processData);
}

//plot line
export const drawLine = ({ container, regroupedData, xScale, yScale }) => {

    //set up color
    var colour = setUpColors(regroupedData);

    //set up dataline
    const benchmarkValueLine = d3.line()
        .x((d) => xScale(Date.parse(d.yearMonth)))
        .y((d) => yScale(d.value));

    //grouping lines
    var lines = container.append('g')
        .attr('class', 'lines')

    var glines = lines.selectAll('.line-group')
        .data(regroupedData)
        .enter()
        .append('g')
        .attr('class', 'line-group')

    return glines
        .append("path")
        .attr('class', 'line')
        .attr('fill', 'none')
        .attr('stroke-width', 1.5)
        .attr('stroke', d => colour(d.key))
        .attr("d", (d) =>
            benchmarkValueLine(d.values)
        )

}

//tooltip
export function tooltip(regroupedData, svg, width, height, xScale, yScale) {

    //set up color
    var colour = setUpColors(regroupedData);

    //showing tooltip content
    toolTipContentHolder = d3.select("#chart")
        .append("div")
        .attr('id', 'tooltip')
        .style('position', 'absolute')
        .style("background-color", "#D3D3D3")
        .style('padding', 6)
        .style('display', 'none');

    var mouseG = svg
        .append("g")
        .attr("class", "mouse-over-effects");

    mouseG
        .append("path")
        .attr("class", "mouse-line")
        .style("stroke", "steelblue")
        .style("stroke-width", "2px")
        .style("opacity", "0");

    //for individual line
    var mousePerLine = mouseG.selectAll('.mouse-per-line')
        .data(regroupedData)
        .enter()
        .append("g")
        .attr("class", "mouse-per-line");

    // node to follow line
    mousePerLine.append("circle")
        .attr("r", 2)
        .style("stroke", d => colour(d.key))
        .style("fill", "none")
        .style("stroke-width", "2px")
        .style("opacity", "0");

    // append a rect to catch mouse movements on canvas
    mouseG.append('svg:rect')
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on('mouseout', function () { // on mouse out hide line, circles and text
            d3.select(".mouse-line")
                .style("opacity", "0");
            d3.selectAll(".mouse-per-line circle")
                .style("opacity", "0");
            d3.selectAll("#tooltip")
                .style('display', 'none')

        })
        .on('mouseover', function () { // on mouse in show line, circles and text
            d3.select(".mouse-line")
                .style("opacity", "1");
            d3.selectAll(".mouse-per-line circle")
                .style("opacity", "1");
            d3.selectAll("#tooltip")
                .style('display', 'block')
        })

    mouseG.selectAll('.mouse-per-line')
        .data(regroupedData)

    mouseG.on('mousemove', function (event) {

        var mouse = d3.pointer(event);
        d3.selectAll(".mouse-per-line")
            .attr("transform", function (d, i) {

                // use 'invert' to get date corresponding to distance from mouse position relative to svg
                var xDate = xScale.invert(mouse[0]);

                // retrieve row index of date on groupedData
                var idx = bisectData(d, xDate);

                d3.select(".mouse-line")
                    .attr("d", function () {
                        var data = "M" + xScale(Date.parse(d.values[idx].yearMonth)) + "," + (height);
                        data += " " + xScale(Date.parse(d.values[idx].yearMonth)) + "," + 0;
                        return data;
                    });

                return "translate(" + xScale(Date.parse(d.values[idx].yearMonth)) + "," + yScale(d.values[idx].value) + ")";

            });

        toolTipContent(mouse, regroupedData, event, xScale);
        svg.selectAll("*").remove();
    })
}

function toolTipContent(mouse, regroupedData, event, xScale) {

    //set up color
    var colour = setUpColors(regroupedData);

    var content = []
    regroupedData.map(d => {
        var idx = bisectData(d, xScale.invert(mouse[0]));

        content.push({
            type: d.values[idx].type,
            value: d.values[idx].value,
            date: d.values[idx].yearMonth,
        })
    })

    toolTipContentHolder.html(content[0].date)
        .style('display', 'block')
        .style('left', `${event.pageX + 10 }px`)
        .style('top', `${event.pageY + 40}px`)
        .style('font-size', "11.5px")
        .selectAll()
        .data(regroupedData)
        .enter()
        .append('div')
        .style('color', d => {
            return colour(d.key)
        })
        .style('font-size', 10)
        .html(d => {
            var idx = bisectData(d, xScale.invert(mouse[0]));
            return d.key + ": $" + d.values[idx].value
        })

        
}

//set up bisectData
function bisectData(d, xDate) {

    var formatter = d3.timeFormat("%Y-%m");
    xDate = formatter(xDate);
    var bisect = d3.bisector(function (d) {
        return d.yearMonth;
    }).left
    var idx = bisect(d.values, xDate);
    return idx;
}

//set up color
function setUpColors(regroupedData) {
    var typeName = regroupedData.map(d => d.key);
    var colour = d3.scaleOrdinal().domain(typeName).range(["#c2ff61", "#32a852", "#6b0a70", "#a84c32", "#03abff"]);
    return colour
}
