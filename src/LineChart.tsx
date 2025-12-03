import * as d3 from "d3";
import { useEffect, useMemo, useRef, useState } from "react";
import AxisScale from './components/AxisScale';
import { useChartDimensions } from "./hooks/useChartDimensions";
import Line from "./components/Line";
import Tooltip from "./components/Tooltip";
import Axis from "./components/Axis";
import ChartFilter from "./components/ChartFilter";
import { VariationDate, type VariationData, type VariationDef } from "./models/data";
import { color } from "./utils/helpers";
import type { MultiValue } from "react-select";

interface Props {
  variationData: VariationData[];
  variationDef: VariationDef[];
}

export const LineChart = ({ variationData = [], variationDef = []} : Props) => {
    const tooltipRef = useRef(null);
    const [chartData, setChartData] = useState<[string, VariationData[]][]>([]);
    const [selectedDates, setSelectedDates] = useState<MultiValue<VariationDef>>([]);
    const [selectedVariations, setSelectedVariations] = useState<MultiValue<VariationDef>>([]);
    
    const chartSettings = {
        marginLeft: 75,
        maxHeight: 400
    }
    const [chartWrapperRef, dms] = useChartDimensions(chartSettings)

    const groupedData = useMemo(() => (
        Array.from(d3.group(variationData, d => d.variationId))
    ), [variationData]);

    const dates = useMemo(() => (
        [...new Set(variationData.map(item => item.date))].map(d =>new VariationDate(d, new Date(d).toLocaleDateString()))
        ), [variationData]);

    useEffect(() => {
        // group data
        setChartData(groupedData);
        }, [groupedData]);

    const xScale = useMemo(() => (
        d3.scaleTime()
         // @ts-ignore
        .domain(d3.extent(variationData, (d) => d.date ))
        .range([ 0, dms.containerWidth ])
    ), [dms.containerWidth]);

    const yScale = useMemo(() => (
        d3.scaleLinear()
         // @ts-ignore
        .domain([0, d3.max(variationData, (d) => d.conversionRate)])
        .range([ dms.containerHeight, 0 ])
    ), [dms.containerHeight]);

    useEffect(() => {
        if (selectedDates.length == 0 && selectedVariations.length == 0){
            setChartData(groupedData);
            return;
        }
        // Filter by date
        const filteredByDate = Array.from(d3.group(selectedDates.length == 0 ? variationData :
            variationData.filter(x => {
                return selectedDates.some((f) => {
                    return x.date.toString() == f.id;
            })}),d => d.variationId));
         
            // Filter by variation
            const filteredData = selectedVariations.length == 0 ? filteredByDate :
                filteredByDate.filter(x => {
                return selectedVariations.some((f) => {
                    return x[0] === f.id;
                })});
            setChartData(filteredData);
            }, [selectedDates, selectedVariations]
        );

    return (
        <div>
        <div className="filterContainer">
            <div>
            <ChartFilter
                data={variationDef}
                onChange={selected => setSelectedVariations(selected)} 
                placeholder='All variations selected'/>
            </div>
            <div>
            <ChartFilter
            data={dates}
            onChange={selected => setSelectedDates(selected)} 
            placeholder='All dates selected'/>
            </div>
        </div>
        <div ref={chartWrapperRef}>
            <svg width={dms.width} height={dms.height}>
                <g transform={`translate(${dms.marginLeft},${dms.marginTop})`}>
                <AxisScale
                    type="x"
                    scale={xScale}
                    ticks="10"
                    size={dms.containerHeight}
                    transform={`translate(0, ${dms.containerHeight})`}
                />
                <AxisScale
                    type="y"
                    scale={yScale}
                    ticks="5"
                    size={dms.containerWidth}
                    transform=""
                />
                 {chartData.map((d) => (
                    <Line
                    key={d[0]}
                    data={d[1]}
                    xScale={xScale}
                    yScale={yScale}
                    color={color(d[0])}
                    />
                ))}
                <Axis
                    type="left"
                    scale={yScale}
                     // @ts-ignore
                    tickFormat={(val) => `${val}%`}
                    ticks="5"
                    transform=""
                />
                <Axis
                    type="bottom"
                    scale={xScale}
                    transform={`translate(0, ${dms.containerHeight})`}
                    ticks={5}                  
                />
                <Tooltip
                    width={dms.width}
                    height={dms.containerHeight}
                    xScale={xScale}
                    yScale={yScale}
                    marginTop={dms.marginTop}
                    data={chartData}
                    variationDef={variationDef}
                />
           </g>

            <div ref={tooltipRef} className="lc-tooltip">
                <div className="data"></div>
                <div className="date"></div>
            </div>
            </svg>
        </div>
        </div>
    );
};
