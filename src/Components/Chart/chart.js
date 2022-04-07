import React, { useEffect, useState, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { restyleData, reGroupData } from './ChartUtils/utils';
import { Axis } from "./ChartComponent/Axis";
import { tooltip } from './ChartComponent/Tooltip';
import { drawLine } from './ChartComponent/PlotLine';
import { AxisUtils } from './ChartUtils/axisUtils';

const Chart = (data) => {

    const ref = useRef(null);

    //sizing
    const width = 1200;
    const height = 500;

    const margin = { top: 20, right: 20, bottom: 20, left: 60 },
        svgWidth = width - margin.left - margin.right,
        svgHeight = height - margin.top - margin.bottom;

    const utils = AxisUtils(data.data,svgHeight,svgWidth);
    const {xScale,yScale,yTickFormat} = utils;

    useEffect(() => {

        if (data.data) {

            var processData = restyleData(data.data);
            const svgElement = d3.select(ref.current)
            svgElement.selectAll("*").remove();
            d3.select("#tooltip").remove();

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

            //draw y-axis
            drawAxis({
                container: svg,
                yScale,
                tickFormat: (val) => `S$${(val / 1000000).toFixed(1)}m`
            })

            //get groupedData 
            const regroupedData = reGroupData(processData)

            //plotting line
            drawLine({
                container: svg,
                regroupedData,
                xScale,
                yScale
            })

            //tooltip
            tooltip(
                regroupedData,
                svg,
                svgWidth,
                svgHeight,
                xScale,
                yScale
            );

        }

    }, [data])

    return (
        <div id="chart">
            <svg ref={ref}>
                <Axis
                    type="left"
                    scale={yScale}
                    tickFormat={yTickFormat}
                />
                <Axis
                    type="bottom"
                    className="axisX"
                    scale={xScale}
                    transform={`translate(0, ${svgHeight})`}
                />
            </svg>
        </div>

    )

}

export default Chart;