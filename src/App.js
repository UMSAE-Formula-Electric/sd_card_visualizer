import React, { useRef, useEffect, useState } from "react";
import MultiRangeSlider from "multi-range-slider-react";
import {
  select,
  line,
  curveCardinal,
  scaleLinear,
  axisBottom,
  axisLeft,
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

	//drawing the line
	svg
	    .selectAll(".line")
	    .data([xsInView])
	    //.data([xs])
	    .join("path")
	    .attr("class", "line")
	    .attr("d", myLine)
	    .attr("fill", "none")
	    .attr("stroke", "#00bfa6");
    }, [xs, maxValue, minValue]);

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

function ThingSidebar({things}) {
    const thingsBar = [];

    things.forEach(thing => {
	thingsBar.push(
	    <button>{thing}</button>
	);
    });

    return (
	<div id="things">
	    {thingsBar}
	</div>
    );
}

const THINGS = [
    "Wheel Speed",
    "Slip",
    "Voltage"
];

function App() {
    return (
	<>
	    <div style={{background: "red"}}></div>
	    <ThingSidebar things={THINGS}/>
	    <LineChart data={DATA}/>
	</>
    );
}


export default App;

/*
function App() {
const [minValue, set_minValue] = useState(25);
const [maxValue, set_maxValue] = useState(75);
const handleInput = (e) => {
	set_minValue(e.minValue);
	set_maxValue(e.maxValue);
};

return (
	<div className="App">
		<MultiRangeSlider
			min={0}
			max={100}
			step={5}
			minValue={minValue}
			maxValue={maxValue}
			onInput={(e) => {
				handleInput(e);
			}}
		/>
	</div>
	);
}

export default App;
*/
