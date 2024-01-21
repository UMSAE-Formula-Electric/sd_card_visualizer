import React, { useRef, useEffect, useState } from "react";

import * as d3 from "d3";

/*
import {
  select,
  line,
  curveCardinal,
  scaleLinear,
  axisBottom,
  axisLeft,
  range,
  zoom,
  event,
} from "d3";
*/

function LineChart({data}) {

    const width = 100;
    const height = 100;

    const [timer, setTimer] = useState(new Date());
    
    const [xs, setXs] = useState(data); // the list of points to graph
    const [ys, setYs] = useState(data); // the list of points to graph

    const [time, setTime] = useState(0);

    const [follow, setFollow] = useState(false);

    const [sliderValue, setSliderValue] = useState(1);

    const svgRef = useRef(); // ref for the d3 graph

    // Modifies the svgRef with the graph in view
    /*
    const drawChart = () => {

	// Idk what alot of this does, it was copied from somewhere
	const svg = select(svgRef.current);

	//scales

	const xsInView = xs.length * (sliderValue / 100);

	const xScale = scaleLinear()
	      .domain([0, xsInView]) // this allows values to fill graph (more values more spread out)
	      .range([0, time]);

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
	    .style("width", xs.length + "px")
	    .selectAll(".line")
	    .data([xs])
	    .join("path")
	    .attr("class", "line")
	    .attr("d", myLine)
	    .attr("fill", "none")
	    .attr("stroke", "#00bfa6");
    }
    // https://gist.github.com/mbostock/1642874
    */

    const drawChart = () => {

	// Idk what alot of this does, it was copied from somewhere
	const svg = d3.select(svgRef.current);

	//scales

	const chartWidth = document.getElementById("graph").scrollWidth;
	const xsInView = xs.length * (sliderValue / 100);

	const xScale = d3.scaleLinear();
	      //.domain([0, chartWidth])
	      //.range([0, chartWidth / (sliderValue / 100)]);
	      //.domain([Math.min(...xs.map((p) => p.x)), Math.max(...xs.map((p) => p.x))])
	      //.range([0, xsInView]);

	const yScale = d3.scaleLinear();
	    //.domain([0, time])
	      //.range([0, sliderValue]);
	

	/*
	const xScale = scaleLinear()
	      .domain([0, xsInView]) // this allows values to fill graph (more values more spread out)
	      .range([0, time]);

	const yScale = scaleLinear()
	      .domain([0, 100])
	      .range([100, 0]);
	*/

	//axes
	const xAxis = d3.axisBottom(xScale).ticks(xs.length);
	svg
	    .select(".x-axis")
	    .style("transform", "translateY(100px)")
	    .call(xAxis);

	const yAxis = d3.axisLeft(yScale);
	svg
	    .select(".y-axis")
	    .style("transform", "translateX(0px)")
	    .call(yAxis);

	//line generator
	const myLine = d3.line()
	    .x((d, i) => xScale(i))
	    .y((d) => yScale(d.y))
	    .curve(d3.curveCardinal);

	//drawing the line
	svg
	    .style("width", xs.length + "px")
	    .call(d3.zoom().on("zoom", (event) => {   // <-- `event` argument
		svg.attr("transform", event.transform); // <-- use `event` here
	    }))
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
	}, 10);

	//drawChart(xs[xs.length - 1]); // Redraw chart with new metrics
	//drawChart2(xs);
	drawChart();

	// Snaps graph to newest value
	if(follow) {
	    const graphDiv = document.getElementById("graph");
	    graphDiv.scrollLeft = graphDiv.scrollWidth;
	}

	return () => clearInterval(interval);
    }, [xs, follow]);

    // Creates a new point on the graph and increments time
    function updateGraph() {
	const point = {
	    x: time, 
	    y: Math.random() * 100,
	    //y: 10 * Math.cos(time)
	};

	setTime(time + 1); 

	setXs(prevData => [...prevData, point]); // append point to xs
    }

    return (
	<div>
	    <div style={{width: "100%", border: "1px solid black", overflowY: "scroll"}} id="graph">
		<svg ref={svgRef} style={{width: "100%"}} id="svg"/>
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
	    <LineChart data={[]}/>
	</>
    );
}


export default App;
