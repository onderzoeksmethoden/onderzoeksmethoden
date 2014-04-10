window.forceDebug = false;
var currentSigma = null;

$(function() {

	var graphs = {
		"square_grid": function() { return generator.generateSquareGrid(11, 11); },
		"hexagon": function() { return generator.generateHexagonalGrid(5, 5); },
		"sierpinski": function() { return generator.generateSierpinskiGraph(4); }, 
		"tree": function() { return generator.generateTree(3, 4); },
		"cylinder": function() { return generator.generateFatPolygon(8, 15, 1); },
		"lowbranch": function() { return generator.generateFatPolygon(4, 4, 2); },
		"randomsparse": function() { return createRandomGraph(120, 1, 50, 50); },
		"randomdense": function() { return createRandomGraph(120, 2, 50, 50); },
	}

	for(var graphName in graphs) {
		$("#graphName").append('<option value="'+ graphName +'">'+ graphName +'</select>');
	}

	$("#generate").click(function() {
		var graphName = $("#graphName").find(":selected").val();
		var multistageEnabled = $("#multistageEnabled").is(':checked');
		var updateTimeout = parseInt($("#updateTimeout").val());
		var updateStep = parseInt($("#updateStep").val());

		$("#container").empty();
		runDemo(graphs[graphName](), multistageEnabled, updateTimeout, updateStep);
	});

	return;
});

var runDemo = function(graph, multistageEnabled, updateTimeout, updateStep)
{
	// Randomize graph positions
	generator.randomize(graph);

	// Put it on screen
	currentSigma = new sigma({
		graph: graph,
		container: "container",
		settings: {maxNodeSize: 8},
	});

	// Keep an array of vertice updates, and update the graph periodically
	var updateCounter = 0;
	var updates = [];

	var currentNodes = currentSigma.graph.nodes();

	// Hide all nodes first
	for(var i = 0; i < currentNodes.length; ++i) {
		currentNodes[i].hidden = true;
	}

	currentSigma.refresh();

	// Function periodically called to update node positions
	function updateGraph() {
		// Don't do anything if there are no updates
		if(updateCounter >= updates.length) {
			setTimeout(updateGraph, updateTimeout);
			return;
		}

		var newNodes = updates[updateCounter];

		for(var i = 0; i < newNodes.length; ++i) {
			var newNode = newNodes[i];
			var currentNode = currentNodes[parseInt(newNode.id)];

			currentNode.x = newNode.x;
			currentNode.y = newNode.y;
			currentNode.hidden = false;
			currentNode.color = "#000000";
		}

		// $("#updateContainer").text("Now on iteration " + (updateCounter + 1) + " of " + updates.length);
		currentSigma.refresh();

		// Update the counter, but make sure we reach the end
		if(updateCounter == updates.length - 1) {
			return;
		}

		updateCounter += updateStep;
		if(updateCounter >= updates.length) {
			updateCounter = updates.length - 1;
		}
		
		setTimeout(updateGraph, updateTimeout);
	}

	// Create the force-directed layout, and keep track of the changes per force movement
	function collectUpdates(vertices) {

		update = [];
		for(var i = 0; i < vertices.length; ++i) {
			update.push({x: vertices[i].x, y: vertices[i].y, id: vertices[i].id});
		}

		updates.push(update);

	}

	if(multistageEnabled)
		multistage.createLayout(graph.nodes, graph.edges, collectUpdates );
	else
		multistage.createLayoutRegular(graph.nodes, graph.edges, collectUpdates );

	updateGraph();
}

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
		"randomized11": createRandomGraph(12, 1, 50, 50),
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