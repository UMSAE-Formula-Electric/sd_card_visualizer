import React, { useRef, useEffect, useState } from "react";

import {
  select,
  line,
  curveCardinal,
  scaleLinear,
  axisBottom,
  axisLeft,
} from "d3";

function LineChart2({}) {

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

	// Don't Change this
	const xScale = scaleLinear()
	    .domain([0, data.length - 1])
	    .range([0, width]);

	// Or this
	const yScale = scaleLinear()
	      .domain([0, height])
	      .range([height, 0]);

	const generateScaledLine = line()
	      .x((d) => d.x)
	      .y((d) => d.y)
	      .curve(curveCardinal);

	svg
	    //.style("width", 
	    .selectAll(".line")
	    .data([data])
	    .join("path")
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
	</div>
    );

}

function LineChart({data}) {

    const width = 100;
    const height = 100;

    const [timer, setTimer] = useState(new Date());
    
    const [xs, setXs] = useState([]); // the list of points to graph

    const [time, setTime] = useState(0);

    const [follow, setFollow] = useState(false);

    const [sliderValue, setSliderValue] = useState(1);

    const svgRef = useRef(); // ref for the d3 graph

    // x-domain: [0, xMax]
    // x-range : [0, 1]

    // 100% View -> x-range [0, div-size]
    //  50% View -> x-range [0, 2 * div-size]


    // 100% shows 100% of points within graph-div
    //  50% shows  50% of points within graph-div

    // Modifies the svgRef with the graph in view
    const drawChart = () => {

	const graphContainerWidth =
	      document
	      .getElementById("graph-container")
	      .getBoundingClientRect()
	      .width;

	// Idk what alot of this does, it was copied from somewhere
	const svg = select(svgRef.current);

	//scales

	//const xsInView = xs.length * (sliderValue / 100);

	const xMax = Math.max(...xs.map((p) => p.x));

	const xScale = scaleLinear()
	      .domain([0, xMax])
	      .range([0, 1024 * (100 / sliderValue)]);
	      //.domain([0, sliderValue]) // this allows values to fill graph (more values more spread out)
	      //.range([0, 10]);
	      //.range([0, time]);

	const yScale = scaleLinear();
	      //.domain([0, 100])
	      //.range([100, 0]);

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
	    //.curve(curveCardinal);

	//drawing the line
	svg
	    //.style("width ", xs.length + "px")
	    .style("width", 1024 * (100 / sliderValue) + "px")
	    .selectAll(".line")
	    .data([xs])
	    .join("path")
	    .attr("class", "line")
	    .attr("d", myLine)
	    .attr("fill", "none")
	    .attr("stroke", "#00bfa6");
    }

    // Called everytime we change our time window or add new data points
    useEffect(() => {
	const interval = setInterval(() => {
	    updateGraph();
	}, 12);

	drawChart(); // Redraw chart with new metrics

	// Snaps graph to newest value
	if(follow) {
	    const graphDiv = document.getElementById("graph");
	    graphDiv.scrollLeft = graphDiv.scrollWidth;
	}

	return () => clearInterval(interval);
    }, [xs, follow, sliderValue]);

    // Creates a new point on the graph and increments time
    function updateGraph() {
	const point = {
	    x: time, 
	    y: time % 2 == 0 ? 0 : 100,
	};

	setTime(time + 1); 

	setXs(prevData => [...prevData, point]); // append point to xs
    }

    function generateRandomPoints(n) {
	const arr = [];

	for(let i = 0; i < n; i++) {
	    arr.push({ x: i, 
		       y: Math.random() * 100 });
		       //y: i % 2 == 0 ? 0 : 100 });
	}

	return arr;
    }

    return (
	<div id="graph-container">
	    <div style={{width: "100%", border: "1px solid black", overflowX: "scroll"}} id="graph">
		<svg ref={svgRef} style={{overflowX: "scroll"}}/> {/* style={{width: "100%"}}/> */}
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
	    <LineChart2/>
	    {/* <LineChart data={[]}/> */}
	</>
    );
}


export default App;
