import React, { useRef, useEffect, useState } from "react";
import MultiRangeSlider from "multi-range-slider-react";
import './index.css';
import {
  select,
  line,
  curveCardinal,
  scaleLinear,
  axisBottom,
  axisLeft,
  scaleOrdinal,
  range,
  map,
} from "d3";

function LineChart({data}) {

    const width = 150; //width of chart
    const height = 150; //height of chart

    const [timer, setTimer] = useState(new Date());
    
    const [xs, setXs] = useState(data); // the list of points to graph
	const [xsSpeed, setXsSpeed] = useState(data); // the list of points to graph

    const [min, setMin] = useState(0); // the smallest time value (x)
    const [max, setMax] = useState(1); // the largest time value (x)

    const [minValue, setMinValue] = useState(0); // the lower bound of our viewing window
    const [maxValue, setMaxValue] = useState(1); // the upper bound of our viewing window

    const [disabled, setDisabled] = useState(false); // managing following state

    const [time, setTime] = useState(0);

    const svgRef = useRef(); // ref for the d3 graph

    const handleInput = (e) => {
	setMinValue(e.minValue);
	if(!disabled) {
	    setMaxValue(e.maxValue);
	}
	else {
	    // this means we're trying follow as time updates, so ignore input this time and try again next time
	    setDisabled(false); 
	}
    };

    const setSvg = (input,inputSpeed) => {
	/* Selects the svg we are using and 
	* filters the input based on the min and max value
	*/
		const svg = 
			select(svgRef.current)
			.style('overflow', 'visible')
			.style("margin-left", "25");
		const xsInView = input.filter(p => {
			return p['x'] >= minValue && p['x'] <= maxValue;
		})
	
		const xsSpeedInView = inputSpeed.filter(p => {
			return p['x'] >= minValue && p['x'] <= maxValue;
		});
		
		createScale(svg, xsInView, xsSpeedInView)
			
	}
	const createScale = (svg, xsInView, xsSpeedInView) => {	
		/* creates the scale of the line and
		*  creates the scale of the x and y axis
		*/
		const xScale = scaleLinear()
			.domain([0, xsInView.length - 1]) // this allows values to fill graph (more values more spread out)
			.range([0, 1000]);

		const yScale = scaleLinear()
			.domain([0, 150])
			.range([150, 0]);

		const yScale2 = scaleLinear()
			.domain([0, 50])
			.range([150, 0]);

		const myLine = new line()
			.x((d, i) => xScale(i))
			.y((d) => yScale(d.y))
			.curve(curveCardinal);

		const myLine2 = new line()
			.x((d, i) => xScale(i))
			.y((d) => yScale2(d.y))
			.curve(curveCardinal);
		
		var combine = [xsInView, xsSpeedInView]
		var media = combine.map(d => d.key)
		var color = scaleOrdinal().domain(media).range(["red", "blue"]);


		//axes
		const xAxis = axisBottom(xScale).ticks(xs.length).tickFormat(i => i + 1);
		//svg.call(xAxis).attr('transform',`translate(0, ${xs.length -1})`); DON'T NEED X AXIS

		const yAxis = axisLeft(yScale).tickValues(range(0,height + 1,10)).tickPadding(10).tickSizeOuter(0);
		const yAxisSpeed = axisLeft(yScale2)//.tickValues(range(0,150 + 1,10))
		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
			.style("stroke", "blue");
		svg.append("g")
			.attr("transform", "translate(-40,0)")
			.attr("class", "y axis")
			.call(yAxisSpeed)
			.style("stroke", "red");
		
		//drawing the line
		svg
			//.append("path")
			.selectAll(".myline")//myLine.line)
			.data([xsInView])
			.join("path")//,
				//enter => enter.append(),
				//update => update,
				//exit => exit.remove()
				//)
			.attr("class", "myline")
			.attr("d", myLine)
			.attr("fill", "none")
			.attr("stroke", d => color(d))
			.attr("stroke-width", 1.5);
			//.remove("path");	
			svg
				.selectAll(".myline2")
				.data([xsSpeedInView])
				.join("path")
				.attr("class", "myline2")
				.attr("d", myLine2)
				.attr("fill", "none")
				.attr("stroke", d => color(d))
				.attr("stroke-width", 1.5);

		
			
    }

    // Called everytime we change our time window or add new data points
    useEffect(() => {
	const interval = setInterval(() => {
	    updateGraph();
	}, 2000);

	// find the minimum and maximum time values (x)
	xs.sort(p => p['x']);

	let newMax = Math.max(...[...xs.map(p => p['x']), 1]); // max or 1
	let newMin = Math.min(...[...xs.map(p => p['x']), 0]); // min or 0

	setMax(newMax);
	setMin(newMin);

	// Should we be following?
	if(maxValue == max) {
	    setMaxValue(newMax);
	    setDisabled(true);
	}
	setSvg(xs, xsSpeed); // Redraw chart with new metrics
	//setSvg(xsSpeed, "red");
	return () => clearInterval(interval);
    }, [xs, minValue, maxValue]);

    // Creates a new point on the graph and increments time
    function updateGraph() {
		/* Updates graph when called by adding a new point to the dataset
		* 
		*/
		const point = {
			x: time, 
			y: Math.random() * 150,//adds value to y component
		};
		const speedPoint = {
			x: time, 
			y: Math.random() * 50,//adds value to y component
		};

		setTime(time + 1); //increases x range

		setXs(prevData => [...prevData, point]); // append point to dataset
		setXsSpeed(prevData => [...prevData, speedPoint]); // append point to data
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
