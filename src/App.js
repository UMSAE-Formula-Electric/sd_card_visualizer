import React, { useRef, useEffect, useState } from "react";
import MultiRangeSlider from "multi-range-slider-react";
import {
  select,
  line,
  curveCardinal,
  scaleLinear,
  axisBottom,
  axisLeft,
  polygonArea,
} from "d3";

/*
const DATA = [
  { x: 0, y: 10 },
  { x: 1, y: 20 },
  { x: 2, y: 15 },
  { x: 3, y: 25 },
  { x: 4, y: 30 },
];
*/
const DATA = [];

let time = 0;

function LineChart({data}) {
    const [xs, setXs] = useState(data);
    const [ys, setYs] = useState(data);

    const [min, setMin] = useState(0);
    const [max, setMax] = useState(1);

    const [minValue, setMinValue] = useState(0);
    const [maxValue, setMaxValue] = useState(1);

    const svgRef = useRef();

    const handleInput = (e) => {
	    setMinValue(e.minValue);
	    setMaxValue(e.maxValue);
    };

    //draws chart
    useEffect(() => {

	setMax(_ => Math.max(...[...xs.map(p => p['x']), 1]));
	setMin(_ => Math.min(...[...xs.map(p => p['x']), 0]));

	const svg =
	      select(svgRef.current);

	//scales
	const xScale = scaleLinear()
	    .domain([0, xs.length - 1])
	    //.range([minValue, maxValue]);
	    .range([0, 300]);

	const yScale = scaleLinear().domain([0, 100]).range([100, 0]);

	//axes
	const xAxis = axisBottom(xScale).ticks(xs.length);
	svg.select(".x-axis").style("transform", "translateY(100px)").call(xAxis);

	const yAxis = axisLeft(yScale);
	svg.select(".y-axis").style("transform", "translateX(0px)").call(yAxis);

	//line generator
	const myLine = line()
	    .x((d, i) => xScale(i))
	    .y((d) => yScale(d.y))
	    .curve(curveCardinal);

	const xsInView = xs.filter(p => {
	    return p['x'] >= minValue && p['x'] <= maxValue;
	});

	const ysInView = ys.filter(p => {
	    return p['x'] >= minValue && p['x'] <= maxValue;
	});
	//drawing the line
	svg
	    .selectAll(".line")
	    .data([xsInView, ysInView])
	    //.data([xs])
	    .join("path")
	    .attr("class", "line")
	    .attr("d", myLine)
	    .attr("fill", "none")
	    .attr("stroke", "#00bfa6");
    }, [xs, maxValue, minValue]);

	function updateGraph2() {
		const point = {
			x: time, // Math.random() * 200,
			y: Math.random() * 100,
		};
		time++;

	setYs(prevData => [...prevData, point]);
	}

    function updateGraph() {
	const point = {
	    x: time, // Math.random() * 200,
	    y: Math.random() * 100,
	};
	time++;

	setXs(prevData => [...prevData, point]);
    }

    return (
	<div>
	    <div style={{padding: "10px"}}>
		<svg ref={svgRef}/>
	    </div>
	    {/*<button onClick={() => setXs(prevData => [...prevData, {x: Math.random() * 100, y: Math.random() * 100}])}>Update</button>*/}
	    <button onClick={updateGraph}>Update</button>
	    <button onClick={updateGraph2}>Update2</button>
	    <MultiRangeSlider
		    min={min}
		    max={max}
		    step={1}
		    minValue={minValue}
		    maxValue={maxValue}
		    onInput={(e) => {
			    handleInput(e);
		    }}
	    />
	</div>
    );
};

function App() {
    return (
		<div class="grid">
		  <div class="right-bar" id="right-bar">
			<button class="button wheel-button">Wheel Speed</button>
			<button class="button slip-button">Slip</button>
			<button class="button voltage-button">Voltage</button>
		  </div>
		  <div class="graph-area">
			<div class="graph-holder">
				<LineChart data={[]} class="line-chart"></LineChart>
			</div>	
		  </div>
		  <div class="bottom-bar">
			<div class="checkboxes">
			  <input type="checkbox" id="rolling-box" class="rolling-box"></input>
			  <label for="rolling-box" class="rolling-label">Rolling Average</label>
			  <input type="checkbox" id="diff-box" class="diff-box"></input>
			  <label for="diff-box" class="diff-label">Difference</label>
			</div>
		  </div>  
		</div>
	  );
}

export default App;
