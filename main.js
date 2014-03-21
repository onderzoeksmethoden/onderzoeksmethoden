window.forceDebug = true;

var init = function()
{
	// Graph
	var nodes = 200,
		density = 0.0025;

	// Initialize the graph
	var initialGraph = generator.generateSierpinskiGraph(4, '#666', 1, '#ccc', 1);

	// Other graph layouts:
	//generator.generateSquareGrid(10, 10, '#666', 1, '#ccc', 1);
	//randomGraph(nodes, density, 1, 1);
	
	var sigmaGraph = new sigma(
	{
		graph: initialGraph, 
		container : 'container'
	});

	var start = function()
	{
		var graph = multistage.createLayout(initialGraph.nodes, initialGraph.edges);

		sigmaGraph.graph.clear();
		sigmaGraph.refresh();

		sigmaGraph = new sigma(
		{ 
			graph: graph, 
			container : 'container'
		});

		if(window.forceDebug) 
		{
			console.log(graph);
			console.log(Analyzer.Analyze(graph));
		}
	}

	// Add animation button
	var button = document.createElement('input');
	button.type = 'button';
	button.value = 'do it';
	button.onclick = start;
	document.body.appendChild(button);
}