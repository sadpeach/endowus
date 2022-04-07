import React, { useEffect, useState, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { setXAxis, setYAxis, drawAxis, drawLine, restyleData } from './ChartUtils/utils';

const Chart = (data) => {

    const ref = useRef(null);

    //sizing
    const width = 900;
    const height = 700;

    const margin = { top: 20, right: 20, bottom: 60, left: 60 },
        svgWidth = width - margin.left - margin.right,
        svgHeight = height - margin.top - margin.bottom;

    useEffect(() => {

        if (data.data) {

            var processData = restyleData(data.data);
            // console.log("processData:" + JSON.stringify(processData))
            const svgElement = d3.select(ref.current)
            svgElement.selectAll("*").remove();

            //setting svg
            var svg = svgElement
                .attr("id", "lineChart")
                .attr("width", svgWidth + margin.left + margin.right)
                .attr("height", svgHeight + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);

            //setting x-axis
            const xScale = setXAxis(processData, svgWidth)

            //draw x-axis
            drawAxis({
                container: svg,
                xScale,
                transform: `translate(0, ${svgHeight})`
            })

            //setting y-axis
            const yScale = setYAxis(processData, svgHeight)

            //find y-axis max
            console.log("max of y:"+d3.max(processData, d => d.value))

            //draw y-axis
            drawAxis({
                container: svg,
                yScale,
                tickFormat: (val) => `S$${(val / 1000000).toFixed(1)}m`
            })

            //plotting line
            drawLine({
                container:svg,
                processData,
                xScale,
                yScale
            })

        }

    }, [data])

    return (
        <div id="chart">
            <svg ref={ref}/>
        </div>

    )

}

export default Chart;