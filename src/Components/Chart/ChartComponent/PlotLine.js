import * as d3 from 'd3';
import React,{ useEffect,useRef } from 'react';

//plot line
export const PlotLine = ({ xScale, yScale, data, color ,...props }) => {
    const ref = useRef(null);

    useEffect(() => {
        d3.select(ref.current);
    },[data])

    //set up dataline
    const benchmarkValueLine = d3.line()
        .x((d) => xScale(Date.parse(d.yearMonth)))
        .y((d) => yScale(d.value));

    return (

        <g className="line-group">
            <path
                ref={ref}
                d={benchmarkValueLine(data)}
                stroke={color}
                strokeWidth={1.5}
                fill="none"
                opacity={1}
                {...props}
            />
        </g>
    )

}
