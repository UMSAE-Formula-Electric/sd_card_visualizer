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


// let time = 0;

function LineChart({data}) {

    const width = 100;
    const height = 100;
    
    const [xs, setXs] = useState(data);

    const [min, setMin] = useState(0);
    const [max, setMax] = useState(1);

    const [minValue, setMinValue] = useState(0);
    const [maxValue, setMaxValue] = useState(1);

    const [disabled, setDisabled] = useState(false);

    const [time, setTime] = useState(0);

    const svgRef = useRef();


    const handleInput = (e) => {
	setMinValue(e.minValue);
	if(!disabled) {
	    setMaxValue(e.maxValue);
	}
	else {
	    setDisabled(false);
	}
    };

    const drawChart = () => {
	const xsInView = xs.filter(p => {
	    return p['x'] >= minValue && p['x'] <= maxValue;
	});

	const svg = select(svgRef.current);

	//scales
	const xScale = scaleLinear()
	    .domain([0, xsInView.length - 1]) // this allows values to fill graph (more values more spread out)
	    .range([0, 1000]);

	const yScale = scaleLinear()
	      .domain([0, 100])
	      .range([100, 0]);

	//axes
	const xAxis = axisBottom(xScale).ticks(xs.length);
	svg
	    .select(".x-axis")
	    .style("transform", "translateY(100px)")
	    .call(xAxis);

	const yAxis = axisLeft(yScale);
	svg
	    .select(".y-axis")
	    .style("transform", "translateX(0px)")
	    .call(yAxis);

	//line generator
	const myLine = line()
	    .x((d, i) => xScale(i))
	    .y((d) => yScale(d.y))
	    .curve(curveCardinal);

	//drawing the line
	svg
	    .selectAll(".line")
	    .data([xsInView])
	    .join("path")
	    .attr("class", "line")
	    .attr("d", myLine)
	    .attr("fill", "none")
	    .attr("stroke", "#00bfa6");
    }

    useEffect(() => {
	xs.sort(p => p['x']);

	let newMax = Math.max(...[...xs.map(p => p['x']), 1]); // max or 1
	let newMin = Math.min(...[...xs.map(p => p['x']), 0]); // min or 0

	setMax(newMax);
	setMin(newMin);

	if(maxValue == max) {
	    setMaxValue(newMax);
	    setDisabled(true);
	}

	drawChart();
    }, [xs, minValue, maxValue]);

    // Creates a new point on the graph and increments time
    function updateGraph() {
	const point = {
	    x: time, 
	    y: Math.random() * 100,
	};

	setTime(time + 1); 

	setXs(prevData => [...prevData, point]); // append point to xs
    }

    return (
	<div>
	    <div style={{padding: "5vw"}}>
		<svg ref={svgRef} style={{border: "1px solid black", width: "100%"}}/>
	    </div>
	    <MultiRangeSlider
		    min={min} // current min value set by user
		    max={max} // current max value set by user
		    step={1}
		    ruler={false}
		    minValue={minValue} // minimum value of the slider
		    maxValue={maxValue} // maximum value of the slider
		    onInput={(e) => handleInput(e)}
	    />
	    <button onClick={updateGraph}>Update</button>
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
	    <ThingSidebar things={THINGS}/>
	    <LineChart data={[]}/>
	</>
    );
}


export default App;
