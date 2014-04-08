window.forceDebug = true;

var init = function()
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
		var graph = multistage.createLayout(initialGraph.nodes, initialGraph.edges);
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