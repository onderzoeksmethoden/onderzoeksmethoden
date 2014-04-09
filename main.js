window.forceDebug = false;

$(function() {
	init();

	var currentSigma = new sigma({
		graph: {"edges": [], "nodes": []},
		container: "container",
		settings: {maxNodeSize: 8},
	});

	$("body button").click(function() {

		var newGraph = $(this).data("graph");

		currentSigma.graph.clear();

		for(var a = 0; a < newGraph.nodes.length; ++a)
			currentSigma.graph.addNode(newGraph.nodes[a]);

		for(var a = 0; a < newGraph.edges.length; ++a)
			currentSigma.graph.addEdge(newGraph.edges[a]);

		currentSigma.refresh();

		console.log($(this).data("analysis"));

	});
});

var init = function()
{
	// Configuration
	var testAmount = 10;

	var ttestSidedness = 1;
	var ttestType = 1;
	var ttestBoundary = 0.05;

	var graphs = {
		//"sierpinski_4": generator.generateSierpinskiGraph(5), 
		//"square_grid": generator.generateSquareGrid(11, 11),
		//"hexagon_grid": generator.generateHexagonalGrid(5, 5),
		//"tree": generator.generateTree(3, 4),
		//"cylinder": generator.generateFatPolygon(8, 15, 1),
		//"procedural1": generator.generateFatPolygon(4, 4, 2),
		//"procedural2": generator.generateFatPolygon(6, 2, 4),
/*		"randomized21": createRandomGraph(120, 2, 50, 50),
		"randomized22": createRandomGraph(120, 2, 50, 50),
		"randomized23": createRandomGraph(120, 2, 50, 50),
		"randomized24": createRandomGraph(120, 2, 50, 50),
		"randomized25": createRandomGraph(120, 2, 50, 50),*/
		"randomized11": createRandomGraph(120, 1, 50, 50),
		//"randomized12": createRandomGraph(120, 1, 50, 50),
		//"randomized13": createRandomGraph(120, 1, 50, 50),
		//"randomized14": createRandomGraph(120, 1, 50, 50),
		//"randomized15": createRandomGraph(120, 1, 50, 50),
	}

	function make_ttest(columnOne, columnTwo, testAmount, currentRow) {
		var startRow = currentRow - testAmount
		var endRow = currentRow - 1;		

		return "=T.TEST(" + columnOne + startRow + ":" + columnOne + endRow +";" + columnTwo + startRow + ":" + columnTwo + endRow + ";" + ttestSidedness + ";" + ttestType +")\t=" + columnOne + currentRow + " < " + ttestBoundary;
	}

	// Main
	var output = "";
	var row = 1;

	for(var graph_name in graphs) {
		
		var graph = graphs[graph_name];

		for(var a = 0; a < testAmount; ++a) {
			
			generator.randomize(graph);

			var regular_graph = multistage.createLayoutRegular(graph.nodes, graph.edges);
			var regular_analysis = new window.Analyzer(regular_graph).result;

			var multistage_graph = multistage.createLayout(graph.nodes, graph.edges);
			var multistage_analysis = new window.Analyzer(multistage_graph).result;

			output += graph_name + "\t" + a + "\t" + graph.nodes.length + "\t" + graph.edges.length + "\t" + regular_analysis.crossingsAmount + "\t" + multistage_analysis.crossingsAmount + "\t" + regular_analysis.minAngle + "\t" + multistage_analysis.minAngle + "\t" + regular_analysis.minNodeDistance + "\t" + multistage_analysis.minNodeDistance + "\t" + regular_analysis.diffEdgeLength + "\t" + multistage_analysis.diffEdgeLength + "\n";
			row++;

			// Create button
			var button_regular = $("<button>"+ graph_name +": regular "+ a +"</button>");
			button_regular.data("graph", regular_graph);
			button_regular.data("analysis", regular_analysis);
			$("#buttoncontainer").append(button_regular);

			var button_multistage = $("<button>"+ graph_name +": multistage "+ a +"</button>");
			button_multistage.data("graph", multistage_graph);
			button_multistage.data("analysis", multistage_analysis);
			$("#buttoncontainer").append(button_multistage);
		}

		output += graph_name + "\t\t\tR\t";
		output += make_ttest("E", "F", testAmount, row) + "\t";
		output += make_ttest("G", "H", testAmount, row) + "\t";
		output += make_ttest("I", "J", testAmount, row) + "\t";
		output += make_ttest("K", "L", testAmount, row) + "\n";

		row++;
	}

	window.result = output;
	console.log(output);
}

var init_old = function()
{
	// Initialize the graph
	var initialGraph = generator.generateSierpinskiGraph(4, '#666', 1, '#ccc', 1);

	// Other graph layouts:
	//generator.generateSquareGrid(10, 10, '#666', 1, '#ccc', 1);
	//randomGraph(nodes, density, 1, 1);
	
	var sigmaGraph = new sigma(
	{
		graph: initialGraph, 
		container : 'container',
		settings: {maxNodeSize: 8},
	});

	var start = function()
	{
		var graph = multistage.createLayoutRegular(initialGraph.nodes, initialGraph.edges);
		window.stupidgraph = graph;

		sigmaGraph.graph.clear();
		sigmaGraph.refresh();

		sigmaGraph = new sigma(
		{ 
			graph: graph, 
			container : 'container',
			settings: {maxNodeSize: 8},
		});

		if(window.forceDebug) 
		{
			console.log(graph);

			analyzer = new window.Analyzer(graph, {k: 0.1543033499620919});
			console.log(analyzer.analyze());
		}
	}

	// Add animation button
	var button = document.createElement('input');
	button.type = 'button';
	button.value = 'do it';
	button.onclick = start;
	document.body.appendChild(button);
}