import React 		from 'react'
import * as d3	from 'd3'

export default React.createClass({

	componentDidMount() {
		const width = this.props.width;
		const height = this.props.height;
		var data = this.props.data;

		var svg = d3.select(this.refs.hook)
			.append("svg:svg")
		  	.attr("viewBox", "0 0 " + width + " " + height)
		    .attr("preserveAspectRatio", "xMinYMin")
				.attr("xmlns","http://www.w3.org/2000/svg")
				.attr("version","1.1")

		var simulation = d3.forceSimulation()
			.force("link", 		d3.forceLink().id(function(d) { return d.id; }))
    	.force("charge", 	d3.forceManyBody().strength(-15000).theta(1).distanceMax(1000))
    	.force("center", 	d3.forceCenter(0.5*width,0.5*height))

		var link = svg.append("g")
			.attr("class", "links")
	    	.selectAll("line")
	    		.data(data.links)
	    			.enter().append("line")
	      			.attr("stroke-width", function(d) { return 10; })
	      			.attr("stroke", 			function(d) { return "#e12828"; })

	  var node = svg.append("g")
			.attr("class", "nodes")
	    	.selectAll("circle")
	    	.data(data.nodes)
	    	.enter()
					.append("svg:g").attr('id', function(d) { return ("g_"+d.id); })
					.on("mouseover", 	function(d) { mouseOver(d,width); })
					.on("mouseout", 	function(d) { mouseOut(d,width); })
					.append("svg:a").attr('id', function(d) { return ("a_"+d.id); })
					.attr("xlink:href", function(d) { return d.url; })
					.attr("onclick", 		function(d) { return ("ga('send','event','link_outbound','"+d.url+"')"); })
					.append("circle")
					.attr('id', function(d) { return ("circle_"+d.id); })
	      	.attr("r", width/10)
					.attr("fill", function(d) { return ("url(#pattern_"+d.id+")"); })
	      	.attr("stroke-width", function(d) { return 2; })
	      	.attr("stroke", function(d) { return "#ffffff"; })
	      	.call(d3.drag()
	        	.on("start", 	function(d) { dragStart	(d,simulation,width) })
						.on("drag", 	function(d) { dragged		(d,simulation,width) })
						.on("end", 		function(d) { dragEnd		(d,simulation,width) })
					)

		var defs = svg.append("defs")

		var patterns = defs.selectAll("pattern")
			.data(data.nodes)
			.enter()
				.append('svg:pattern')
					.attr('id', function(d) { return ("pattern_"+d.id);})
					.attr("width", 1.0)
					.attr("height", 1.0)
					.attr("patternUnits", "objectBoundingBox")
					.attr("patternContentUnits", "objectBoundingBox")

		patterns.append("circle")
			.attr('id', function(d) { return ("pattern_circle_"+d.id);})
			.attr("cx",0.5)
			.attr("cy",0.5)
			.attr("r",0.5)
			.attr("fill","#333333")

		patterns.append("path")
			.attr('id', function(d) { return ("pattern_path_"+d.id); })
			.attr("transform","scale(0.001953125) translate(0.499023438,0.499023438)")
			.attr("fill","#ffffff")
			.attr('d', function(d) { return (d.path); })

	  	node.append("title").text(function(d) { return d.id; })

	  	simulation.nodes(data.nodes).on("tick", ticked)

	  	simulation.force("link").links(data.links);

	  	function ticked() {
				updateLink(link);
				updateNode(node);
		}
	},

	render() {
			// console.log(this.props.data);
    	return (
				<div>
					<p>This is the d3 visualization.</p>
					<div ref='hook' />
				</div>
    	)
  	}
});

var updateNode = (selection) => {
	selection.attr("cx", function(d) { return d.x; });
	selection.attr("cy", function(d) { return d.y; });
};

var updateLink = (selection) => {
	selection.attr("x1", function(d) { return d.source.x; })
	selection.attr("y1", function(d) { return d.source.y; })
	selection.attr("x2", function(d) { return d.target.x; })
	selection.attr("y2", function(d) { return d.target.y; })
};

var dragStart = (d,simulation,width) => {
	if (!d3.event.active) simulation.alphaTarget(0.3).restart();
	d.fx = d.x;
	d.fy = d.y;
};

var dragged = (d,simulation,width) => {
		d.fx = d3.event.x;
		d.fy = d3.event.y;
};

var dragEnd = (d,simulation,width) => {
	if (!d3.event.active) simulation.alphaTarget(0);
	d.fx = null;
	d.fy = null;
	mouseOut(d,width);
};

var mouseOver = (d,width) => {
	d3.select("#pattern_circle_"+d.id).attr("fill", function(d) { return (d.color); })
	d3.select("#circle_"+d.id).transition().ease(d3.easeElastic).duration("600").attr("r",width/8);
};

var mouseOut = (d,width) => {
	d3.select("#pattern_circle_"+d.id).attr("fill", function(d) { return "#333333"; })
	d3.select("#circle_"+d.id).transition().ease(d3.easeElastic).duration("600").attr("r",width/10);
};
