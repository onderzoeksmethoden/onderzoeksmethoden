var init = function()
{
	// Graph
	var nodes = 8,
		density = 1;

	// Drawing Area
	var width = 2,
		height = 2,
		k = Math.sqrt(width * height / nodes);

	// Force Directed
	var s = -1/k,
		l = 0,
		r = k,
		c = 1 / (nodes * nodes),
		stop = k / nodes;

	// Animation
	var timeout = 20;

	// Initialize the graph
	var gr = new sigma(
	{ 
		graph: randomGraph(nodes, density, width, height), 
		container : 'container',
	});
	
	// Starts the force directed algorithm
	var start = function()
	{
		var i = 0;
		var interval = setInterval(function() 
		{
			i++;
			var change = force(gr.graph.nodes(), gr.graph.edges(), s, l, r, c);
			if (change < stop)
			{
				clearInterval(interval);
				console.log('We were done in ' + i +' iterations');
			}

			gr.refresh();
		}, timeout); 
	}

	// Add a button
	var button = document.createElement('input');
    button.type = 'button';
    button.value = 'do it';
    button.onclick = start;
    document.body.appendChild(button);
}