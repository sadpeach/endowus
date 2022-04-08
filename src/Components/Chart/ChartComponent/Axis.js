import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';
import PropTypes from "prop-types";

export const Axis = ({ xScale, yScale, tickFormat, transform, type, ...props }) => {

    const ref = useRef(null);

    useEffect(() => {
        
        const scale = xScale || yScale;
        const axisGenerator = type == "bottom" ? d3.axisBottom : d3.axisLeft;

        const axis = axisGenerator(scale)
            .tickFormat(tickFormat)

        const axisGroup = d3.select(ref.current);
        axisGroup.call(axis);

        // //clean up
        // axisGroup.select(".domain").remove();
        // axisGroup.selectAll("line").remove();

    }, [xScale, yScale, tickFormat]);

    return <g ref={ref} transform={transform} {...props} />;

}

Axis.propTypes = {
    type: PropTypes.oneOf(["left", "bottom"]).isRequired
};

