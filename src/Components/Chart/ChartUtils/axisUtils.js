import * as d3 from 'd3';
import { useMemo, } from 'react';

export const AxisUtils = (processData, svgHeight, svgWidth) => {

    //x-axis
    const xScale = useMemo (
        () => {
            return d3.scaleTime()
                .domain(d3.extent(processData, function (d) {
                    var date = Date.parse(d.yearMonth);
                    return date;
                }))
                .range([0, svgWidth])
        }
        , [processData])


    const yScale = useMemo(
        () => {
            return d3.scaleLinear()
                .domain([0, d3.max(processData, function (d) {
                    return d.value;
                })])
                .range([svgHeight, 0])
        }
        , [processData,svgHeight])

    const yTickFormat = (d) =>{
        return `S$${(d / 1000000).toFixed(1)}m`;}
        

    return {
        xScale,
        yScale,
        yTickFormat
    }
}