import React, { useRef } from 'react';
import { restyleData, reGroupData, setUpColors } from './ChartUtils/utils';
import { Axis } from "./ChartComponent/Axis";
import { ToolTipContent, TooltipMouse } from './ChartComponent/TooltipMouse';
import { AxisUtils } from './ChartUtils/axisUtils';
import { PlotLine } from './ChartComponent/PlotLine';

const Chart = ({ data }) => {
    const ref = useRef(null);

    //sizing
    const width = 1200;
    const height = 500;

    const margin = { top: 20, right: 20, bottom: 20, left: 60 },
        svgWidth = width - margin.left - margin.right,
        svgHeight = height - margin.top - margin.bottom;

    const processData = restyleData(data);
    const utils = AxisUtils(processData, svgHeight, svgWidth);
    const { xScale, yScale, yTickFormat } = utils;
    const groupedData = reGroupData(processData);
    const color = setUpColors(groupedData);

    return (
        <div id="chart">
            <svg ref={ref} width={svgWidth + margin.left + margin.right} height={svgHeight + margin.top + margin.bottom}>
                <g transform={`translate(${margin.left},${margin.top})`}>
                    <Axis
                        type="left"
                        className="axisY"
                        yScale={yScale}
                        tickFormat={yTickFormat}
                    />
                    <Axis
                        type="bottom"
                        className="axisX"
                        xScale={xScale}
                        transform={`translate(0, ${svgHeight})`}
                    />

                    <g className="lines">
                        {groupedData.map(({ key, values = [] }) => (
                            <PlotLine
                                key={key}
                                data={values}
                                xScale={xScale}
                                yScale={yScale}
                                color={color(key)}
                            />
                        ))}
                    </g>

                    <TooltipMouse width={svgWidth} height={svgHeight} groupedData={groupedData} color={color} xScale={xScale} yScale={yScale}/>

                </g>
            </svg>
            <ToolTipContent />
        </div >

    )

}

export default Chart;