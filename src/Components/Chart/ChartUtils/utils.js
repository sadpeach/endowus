import * as d3 from 'd3';
import { nest } from 'd3-collection';

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

//plot line
export const drawLine = ({ container, processData, xScale, yScale }) => {

    //group data
    const sumstat = nest()
        .key(d => d.type)
        .entries(processData);

    //set up color
    var typeName = sumstat.map(d => d.key);
    var colour = d3.scaleOrdinal().domain(typeName).range(["#c2ff61", "#32a852", "#6b0a70", "#a84c32", "#03abff"]);

    //set up dataline
    const benchmarkValueLine = d3.line()
        .x((d) => xScale(Date.parse(d.yearMonth)))
        .y((d) => yScale(d.value));

    return container.selectAll(".line")
        .data(sumstat)
        .enter()
        .append("path")
        .attr('fill', 'none')
        .attr('stroke-width', 1.5)
        .attr('stroke', d => colour(d.key))
        .attr("d", (d) =>
            benchmarkValueLine(d.values)
        );
}
