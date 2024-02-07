import React, { useRef, useEffect, useState } from "react";

import {
  select,
  line,
  curveCardinal,
  scaleLinear,
  axisBottom,
  axisLeft,
} from "d3";

function LineChart({}) {

    const [timer, setTimer] = useState(new Date());
    const [time, setTime] = useState(0);
    const [data, setData] = useState([]);
    const [follow, setFollow] = useState(false);
    const [sliderValue, setSliderValue] = useState(1);
    const svgRef = useRef(); // ref for the d3 graph

    useEffect(() => {
	const interval = setInterval(() => {
	    updateGraph();
	}, 120);

	const width  = 100;
	const height = 100;

	const svg = select(svgRef.current)
	    .attr("width", time)
	    .attr("height", height)
	    .style("overflow", "visible")
	    .style("background", "#c5f6fa");

	/*
	  
	// For Reference, please don't delete

	const xScale = scaleLinear()
	    .domain([0, data.length - 1])
	    .range([0, width]);

	const yScale = scaleLinear()
	      .domain([0, height])
	      .range([height, 0]);
	*/

	// Snaps graph to newest value
	if(follow) {
	    const graphDiv = document.getElementById("graph");
	    graphDiv.scrollLeft = graphDiv.scrollWidth;
	}

	const xScale = scaleLinear()
	    .domain([0, data.length - 1])
	    .range([0, width]);

	const yScale = scaleLinear()
	      .domain([0, height])
	      .range([height, 0]);

	const generateScaledLine = line()
	      .x((d) => d.x * (100 / sliderValue)) 
	      .y((d) => d.y);
	      //.curve(curveCardinal);

	svg
	    .selectAll(".line")
	    .data([data])
	    .join("path")
	    .attr("class", "line")
	    .attr("d", (d) => generateScaledLine(d))
	    .attr("fill", "none")
	    .attr("stroke", "black");

	return () => clearInterval(interval);
    }, [data]);

    function updateGraph() {
	const point = {
	    x: time, 
	    y: Math.random() * 100,
	};

	setTime(time + 10); 

	setData(prevData => [...prevData, point]); // append point to xs
    }

    return (
	<div id="graph-container">
	    <div style={{width: "100wv", overflowY: "scroll"}}id="graph">
		<svg ref={svgRef}/>
	    </div>
	    {/* This slider below will allow you to select the range of your time */}
	    <div sytyle={{width: "100%"}}>
		<input style={{width: "95%", float: "left"}}
		       id="slider"
		       type="range"
		       min="1"
		       max="100"
		       value={sliderValue}
		       onChange={(event) => setSliderValue(event.target.value)}/> 
		<input type="checkbox" onClick={() => setFollow(!follow)}></input>
	    </div>
	</div>
    );

}

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
    );}

const THINGS = [
    "Wheel Speed",
    "Slip",
    "Voltage"
];

function App() {
    return (
	<>
	    <ThingSidebar things={THINGS}/>
	    <LineChart/>
	</>
    );
}


export default App;
