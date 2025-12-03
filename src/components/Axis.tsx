import * as d3 from "d3";
import { useEffect, useRef } from "react";

// @ts-ignore
const Axis = ({type, scale, ticks, transform, tickFormat=null}) => {
  const ref = useRef(null);
  useEffect(() => {
    const axisGenerator = type === "left" ? d3.axisLeft : d3.axisBottom;
    const axis = axisGenerator(scale).ticks(ticks).tickFormat(tickFormat);
    const axisGroup = d3.select(ref.current);
    // @ts-ignore
    axisGroup.call(axis).style("color", "#a4a4a4");
    
    axisGroup
      .selectAll("text")
      .attr("opacity", 0.5)
      .attr("color", "#a4a4a4")
      .attr("font-size", "0.75rem");
  }, [scale, ticks, tickFormat]);

  return <g ref={ref} transform={transform} />;
};

export default Axis;
