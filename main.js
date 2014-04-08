window.forceDebug = true;

var graphs = {

	"sierpinskitest": {"nodes":[{"id":"0","label":"0","x":0,"y":1},{"id":"1","label":"1","x":1,"y":1},{"id":"2","label":"2","x":0.5,"y":0.5},{"id":"3","label":"3","x":0.5,"y":1},{"id":"4","label":"4","x":0.25,"y":0.75},{"id":"5","label":"5","x":0.75,"y":0.75},{"id":"6","label":"6","x":0.25,"y":1},{"id":"7","label":"7","x":0.125,"y":0.875},{"id":"8","label":"8","x":0.375,"y":0.875},{"id":"9","label":"9","x":0.875,"y":0.875},{"id":"10","label":"10","x":0.75,"y":1},{"id":"11","label":"11","x":0.625,"y":0.875},{"id":"12","label":"12","x":0.625,"y":0.625},{"id":"13","label":"13","x":0.375,"y":0.625},{"id":"14","label":"14","x":0.5,"y":0.75},{"id":"15","label":"15","x":0.125,"y":1},{"id":"16","label":"16","x":0.0625,"y":0.9375},{"id":"17","label":"17","x":0.1875,"y":0.9375},{"id":"18","label":"18","x":0.4375,"y":0.9375},{"id":"19","label":"19","x":0.375,"y":1},{"id":"20","label":"20","x":0.3125,"y":0.9375},{"id":"21","label":"21","x":0.3125,"y":0.8125},{"id":"22","label":"22","x":0.1875,"y":0.8125},{"id":"23","label":"23","x":0.25,"y":0.875},{"id":"24","label":"24","x":0.9375,"y":0.9375},{"id":"25","label":"25","x":0.875,"y":1},{"id":"26","label":"26","x":0.8125,"y":0.9375},{"id":"27","label":"27","x":0.6875,"y":0.8125},{"id":"28","label":"28","x":0.8125,"y":0.8125},{"id":"29","label":"29","x":0.75,"y":0.875},{"id":"30","label":"30","x":0.5625,"y":0.9375},{"id":"31","label":"31","x":0.625,"y":1},{"id":"32","label":"32","x":0.6875,"y":0.9375},{"id":"33","label":"33","x":0.5625,"y":0.5625},{"id":"34","label":"34","x":0.4375,"y":0.5625},{"id":"35","label":"35","x":0.5,"y":0.625},{"id":"36","label":"36","x":0.625,"y":0.75},{"id":"37","label":"37","x":0.6875,"y":0.6875},{"id":"38","label":"38","x":0.5625,"y":0.6875},{"id":"39","label":"39","x":0.375,"y":0.75},{"id":"40","label":"40","x":0.3125,"y":0.6875},{"id":"41","label":"41","x":0.4375,"y":0.6875}],"edges":[{"id":"0","source":"0","target":"15"},{"id":"1","source":"0","target":"16"},{"id":"2","source":"15","target":"16"},{"id":"3","source":"6","target":"17"},{"id":"4","source":"6","target":"15"},{"id":"5","source":"17","target":"15"},{"id":"6","source":"7","target":"17"},{"id":"7","source":"7","target":"16"},{"id":"8","source":"17","target":"16"},{"id":"9","source":"3","target":"18"},{"id":"10","source":"3","target":"19"},{"id":"11","source":"18","target":"19"},{"id":"12","source":"8","target":"20"},{"id":"13","source":"8","target":"18"},{"id":"14","source":"20","target":"18"},{"id":"15","source":"6","target":"20"},{"id":"16","source":"6","target":"19"},{"id":"17","source":"20","target":"19"},{"id":"18","source":"4","target":"21"},{"id":"19","source":"4","target":"22"},{"id":"20","source":"21","target":"22"},{"id":"21","source":"8","target":"23"},{"id":"22","source":"8","target":"21"},{"id":"23","source":"23","target":"21"},{"id":"24","source":"7","target":"23"},{"id":"25","source":"7","target":"22"},{"id":"26","source":"23","target":"22"},{"id":"27","source":"1","target":"24"},{"id":"28","source":"1","target":"25"},{"id":"29","source":"24","target":"25"},{"id":"30","source":"9","target":"26"},{"id":"31","source":"9","target":"24"},{"id":"32","source":"26","target":"24"},{"id":"33","source":"10","target":"26"},{"id":"34","source":"10","target":"25"},{"id":"35","source":"26","target":"25"},{"id":"36","source":"5","target":"27"},{"id":"37","source":"5","target":"28"},{"id":"38","source":"27","target":"28"},{"id":"39","source":"11","target":"29"},{"id":"40","source":"11","target":"27"},{"id":"41","source":"29","target":"27"},{"id":"42","source":"9","target":"29"},{"id":"43","source":"9","target":"28"},{"id":"44","source":"29","target":"28"},{"id":"45","source":"3","target":"30"},{"id":"46","source":"3","target":"31"},{"id":"47","source":"30","target":"31"},{"id":"48","source":"11","target":"32"},{"id":"49","source":"11","target":"30"},{"id":"50","source":"32","target":"30"},{"id":"51","source":"10","target":"32"},{"id":"52","source":"10","target":"31"},{"id":"53","source":"32","target":"31"},{"id":"54","source":"2","target":"33"},{"id":"55","source":"2","target":"34"},{"id":"56","source":"33","target":"34"},{"id":"57","source":"12","target":"35"},{"id":"58","source":"12","target":"33"},{"id":"59","source":"35","target":"33"},{"id":"60","source":"13","target":"35"},{"id":"61","source":"13","target":"34"},{"id":"62","source":"35","target":"34"},{"id":"63","source":"5","target":"36"},{"id":"64","source":"5","target":"37"},{"id":"65","source":"36","target":"37"},{"id":"66","source":"14","target":"38"},{"id":"67","source":"14","target":"36"},{"id":"68","source":"38","target":"36"},{"id":"69","source":"12","target":"38"},{"id":"70","source":"12","target":"37"},{"id":"71","source":"38","target":"37"},{"id":"72","source":"4","target":"39"},{"id":"73","source":"4","target":"40"},{"id":"74","source":"39","target":"40"},{"id":"75","source":"14","target":"41"},{"id":"76","source":"14","target":"39"},{"id":"77","source":"41","target":"39"},{"id":"78","source":"13","target":"41"},{"id":"79","source":"13","target":"40"},{"id":"80","source":"41","target":"40"}]},

}

var init = function()
{
	// Configuration
	var amount_of_tests = 1;

	// Main
	for(var graph_name in graphs) {
		graph = graphs[graph_name];

		generator.randomize(graph);

		for(var a = 0; a < amount_of_tests; ++a) {

			var regular_graph = multistage.createLayoutRegular(graph.nodes, graph.edges);
			var multistage_graph = multistage.createLayout(graph.nodes, graph.edges);

			var regular_analysis = new window.Analyzer(regular_graph, {k: 0.1543033499620919}).result;
			var multistage_analysis = new window.Analyzer(multistage_graph, {k: 0.1543033499620919}).result;

			console.log(regular_analysis);
			console.log(multistage_analysis);
		}
	}
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