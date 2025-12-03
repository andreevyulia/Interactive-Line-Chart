import { useCallback, useEffect, useRef } from "react";
import * as d3 from "d3";
import { color } from "../utils/helpers";
import type { VariationData, VariationDef } from "../models/data";

interface TooltipProps{
    xScale: any;
    yScale: any;
    width: any;
    height: any;
    data: [string, VariationData[]][];
    variationDef: VariationDef[];
    marginTop: any;
}

const Tooltip = ({xScale, yScale, width, height, data, variationDef, marginTop}: TooltipProps) => {
  const ref = useRef(null);
  const rectRef = useRef(null);
  const drawLine = useCallback(
    (x : number) => {
      d3.select(ref.current)
        .select(".tooltipLine")
        .attr("x1", x)
        .attr("x2", x)
        .attr("y1", 0)
        .attr("y2", height);
    },
    [ref, height, marginTop]
  );

  const drawContent = useCallback(
    (x : number) => {
      const tooltipContent = d3.select(ref.current).select(".tooltipContent");
      tooltipContent.attr("transform", (_cur, i, nodes) => {
        const nodeWidth = (nodes[i] as HTMLElement)?.getBoundingClientRect()?.width || 0;
        const translateX = nodeWidth + x > width ? x - nodeWidth - 12 : x + 8;
        return `translate(${translateX}, ${-marginTop})`;
      });
      tooltipContent
        .select(".contentTitle")
        .text(d3.timeFormat("%b %d, %Y")(xScale.invert(x)));
    },
    [xScale, marginTop, width]
  );

  const drawBackground = useCallback(() => {
    // reset background size to defaults
    const contentBackground = d3
      .select(ref.current)
      .select(".contentBackground");
    contentBackground.attr("width", 125).attr("height", 40).attr("fill", "white");

    // calculate new background size
    const tooltipContentElement = d3
      .select(ref.current)
      .select(".tooltipContent")
      .node();
    if (!tooltipContentElement) return;

    // @ts-ignore
    const contentSize = tooltipContentElement.getBoundingClientRect();
    contentBackground
      .attr("width", contentSize.width + 8)
      .attr("height", contentSize.height + 4);
  }, []);

  // @ts-ignore
  const onChangePosition = useCallback((d, i, isVisible) => {
    d3.selectAll(".name")
    // @ts-ignore
      .filter((td, tIndex) => tIndex === i)
      // @ts-ignore
      .text(variationDef.find((x) => x.id === d.variationId).name);

    d3.selectAll(".value")
    // @ts-ignore
      .filter((td, tIndex) => tIndex === i)
      .text(d.conversionRate && !isVisible ? "No data" : d.conversionRate.toFixed(2)+'%');

    const maxNameWidth = d3.max(
      d3.selectAll(".name").nodes(),
      // @ts-ignore
      (node) => node.getBoundingClientRect().width
    );

    d3.selectAll(".value").attr(
      "transform",
      `translate(${maxNameWidth + 30},4)`
    );

  }, []);

  // @ts-ignore
  const followPoints = useCallback((event) => {
    const [x] = d3.pointer(event, this);
    const xDate = xScale.invert(x);
    // @ts-ignore
    const bisectDate = d3.bisector((d) => d.date).left;
    let baseXPos = 0;

    // draw circles on line
    d3.select(ref.current)
      .selectAll(".tooltipLinePoint")
      // @ts-ignore
      .attr("transform", (cur, i) => {
        const index = bisectDate(data[i][1], xDate, 1);
        const d0 = (data[i][1])[index - 1];
        const d1 = (data[i][1])[index];
        const d = xDate - d0?.date > d1?.date - xDate ? d1 : d0;
        if (d.date === undefined && d.conversionRate === undefined) {
          // move point out of container
          return "translate(-100,-100)";
        }
        const xPos = xScale(d.date);
        if (i === 0) {
          baseXPos = xPos;
        }

        let isVisible = true;
        if (xPos !== baseXPos) {
          isVisible = false;
        }
        const yPos = yScale(d.conversionRate);

        onChangePosition(d, i, isVisible);

        return isVisible
          ? `translate(${xPos}, ${yPos})`
          : "translate(-100,-100)";
      });

    drawLine(baseXPos);
    drawContent(baseXPos);
    drawBackground();
  }, [
    rectRef,
    drawLine,
    drawContent,
    drawBackground,
    xScale,
    yScale,
    data,
    onChangePosition
  ]);

  useEffect(() => {
    d3.select(rectRef.current)
      .on("mouseout.tooltip", () => {
        d3.select(ref.current).attr("opacity", 0);
      })
      .on("mouseover.tooltip", () => {
        d3.select(ref.current).attr("opacity", 1);
      })
      .on("mousemove.tooltip", (event) => {
        d3.select(ref.current)
          .selectAll(".tooltipLinePoint")
          .attr("opacity", 1);
        followPoints(event);
      });
  }, [rectRef, followPoints]);
  
  if (!data.length) return null;

  return (
    <g>
        <g ref={ref} opacity={0} className="tooltip">
            <line className="tooltipLine" />
            <g className="tooltipContent">
               <rect className="contentBackground" rx={4} ry={4} />
                <text className="contentTitle" transform="translate(4,14)" />
                <g className="content" transform="translate(4,32)">
                {data.map((d, i) => (
                    <g key={d[0]} transform={`translate(6,${22 * i})`} className="dataRow">
                      
                      <circle r={6} fill={color(d[0])!.toString()} />
                      <text className="name" transform="translate(10,4)" />
                      <text className="value" fontSize={10} />
                    </g>
                ))}
                </g>
            </g>
            {data.map((d) => (
                <circle className="tooltipLinePoint" r="0" key={d[0]} opacity={0} />
            ))}
        </g>
        <rect ref={rectRef} width={width} height={height} opacity={0}/>
    </g>
  );
};

export default Tooltip;