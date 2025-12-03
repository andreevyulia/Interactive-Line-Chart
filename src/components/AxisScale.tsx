import * as d3 from "d3";
import { useEffect, useRef } from "react";

// @ts-ignore
const AxisScale = ({type, scale, ticks, size, transform = {}}) => {
  const ref = useRef(null);
  useEffect(() => {
    const axisGenerator = type === "x" ? d3.axisBottom : d3.axisLeft;
    const axis = axisGenerator(scale).ticks(ticks).tickSize(-size);

    const gridGroup = d3.select(ref.current);
    // @ts-ignore
    gridGroup.transition().call(axis).style("color", "#a4a4a4");;
    gridGroup.selectAll("text").remove();
  }, [scale, ticks, size]);


  // @ts-ignore
  return <g ref={ref} transform={transform} />;
};

export default AxisScale;