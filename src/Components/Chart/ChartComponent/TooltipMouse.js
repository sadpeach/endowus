import * as d3 from 'd3';
import { bisectData, setUpColors } from '../ChartUtils/utils';
import React, { useEffect, useRef } from 'react';

export const TooltipMouse = ({ width, height, groupedData, xScale, yScale, color }) => {

    function onMouseMove(event) {
        var mouse = d3.pointer(event);

        d3.selectAll(".mouse-per-line")
            .data(groupedData)
            .attr("transform", function (d, i) {

                var xDate = xScale.invert(mouse[0]);

                var idx = bisectData(d, xDate);
                d3.select(".mouse-line")
                    .attr("d", function () {
                        var data = "M" + xScale(Date.parse(d.values[idx].yearMonth)) + "," + (height);
                        data += " " + xScale(Date.parse(d.values[idx].yearMonth)) + "," + 0;
                        return data;
                    });

                return "translate(" + xScale(Date.parse(d.values[idx].yearMonth)) + "," + yScale(d.values[idx].value) + ")";

            });

        toolTipContent(mouse, groupedData, event, xScale);
        d3.select("mouse-over-effects").selectAll("*").remove();
    }

    return (
        <g className='mouse-over-effects' onMouseMove={onMouseMove}>
            <MouseLine />
            <MousePerLine groupedData={groupedData} color={color} />
            <Rect width={width} height={height} groupedData={groupedData} />
        </g>
    )


}

export const MouseLine = () => {
    return <path className='mouse-line' style={{ stroke: 'steelblue', opacity: '0', strokeWidth: '2px' }} />
}

export const MousePerLine = ({ groupedData, color }) => {


    return (
        <>
            {groupedData.map(({ key }) => (
                <g key={"g" + key} className='mouse-per-line'>
                    <circle className="dataNode" r={2} style={{ fill: 'none', strokeWidth: '2px', opacity: "0", stroke: color(key) }}></circle>
                </g>
            ))}

        </>
    )
}

export const Rect = ({ width, height }) => {
    // on mouse out hide line, circles and text
    function onMouseOut() {
        d3.select(".mouse-line")
            .style("opacity", "0");
        d3.selectAll("circle")
            .style("opacity", "0");
        d3.selectAll("#tooltip")
            .style('display', 'none');
    }

    // on mouse in show line, circles and text
    function onMouseOver() {
        d3.select(".mouse-line")
            .style("opacity", "1");
        d3.selectAll("circle")
            .style("opacity", "1");
        d3.selectAll("#tooltip")
            .style('display', 'block')
    }

    return (
        <>
            <rect width={width} height={height} fill="none" pointerEvents="all" onMouseOut={onMouseOut} onMouseOver={onMouseOver}></rect>
        </>
    )


}

export const ToolTipContent = () => {

    return (
        <div id="tooltip" style={{ position: 'absolute', backgroundColor: '#ffffe6', padding: 6, display: "none" }}></div>
    )
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

    d3.select("#tooltip").html(content[0].date)
        .style('display', 'block')
        .style('left', `${event.pageX + 10}px`)
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

