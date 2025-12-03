import * as d3 from "d3";
import { useRef } from "react";
import type { VariationData } from "../models/data";

interface LineProps{
    xScale: any;
    yScale: any;
    color: any;
    data: VariationData[];
}

const Line = ({xScale, yScale, color, data}: LineProps) => {
  const ref = useRef(null);

  const line = d3
    .line()
    // @ts-ignore
    .x((d) => xScale(d.date))
    // @ts-ignore
    .y((d) => yScale(d.conversionRate))
    .curve(d3.curveCatmullRom.alpha(1.1));

    // @ts-ignore
    const d = line(data);

  return (
    <path
      ref={ref}
      // @ts-ignore
      d={d?.match(/NaN|undefined/) ? "" : d}
      stroke={color}
      strokeWidth={3}
      fill="none"
      opacity="1"
    />
  );
};

export default Line;
