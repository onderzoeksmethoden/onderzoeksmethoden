var init = function()
{
	// Graph
	var nodes = 200,
		density = 0.0025;

	// Initialize the graph
	var initialGraph = generator.generateSierpinskiGraph(4, '#666', 1, '#ccc', 1);//generator.generateSquareGrid(10, 10, '#666', 1, '#ccc', 1);//randomGraph(nodes, density, 1, 1);
	var gr = new sigma(
	{ 
		graph: initialGraph, 
		container : 'container'
	});

	var start = function()
	{
		var graph = multistage.createLayout(initialGraph.nodes, initialGraph.edges);
		gr.graph.clear();
		gr.refresh();
		gr = new sigma(
		{ 
			graph: graph, 
			container : 'container'
		});
		console.log(graph);
	}

	// Add animation button
	var button = document.createElement('input');
    button.type = 'button';
    button.value = 'do it';
    button.onclick = start;
    document.body.appendChild(button);

    // Add save button
    var form = document.createElement('form');
    form.method = 'post';
    form.action = 'savegraph';
    var textbox = document.createElement('input');
    textbox.type = 'text';
    textbox.name = 'name';
    form.appendChild(textbox);
    var save = document.createElement('input');
    save.type = 'submit';
    save.value = 'save';
    form.appendChild(save);
    var graph = document.createElement('input');
    graph.type = 'hidden';
    graph.name = 'graph';
    graph.value = JSON.stringify({ nodes: gr.graph.nodes(), edges: gr.graph.edges() });
    form.appendChild(graph);
    document.body.appendChild(form);
}