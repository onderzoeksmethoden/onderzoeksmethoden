(function(generator)
{
	var Graph = function(nodes, edges)
	{
		this.nodes = nodes || [];
		this.edges = edges || [];
	}

	var Node = function(id, color, size, x, y)
	{
		this.id = id.toString();
		this.label = id.toString();
		this.color = color;
		this.size = size;
		this.x = x;
		this.y = y;
	}

	var Edge = function(id, source, target, color, size)
	{
		this.id = id.toString();
		this.source = source.toString();
		this.target = target.toString();
		this.color = color;
		this.size = size;
	}

	// TODO: Refactor
	// generator.generateSquareGrid = function(width, height, nodecolor, nodesize, edgecolor, edgesize)
	// {
	// 	var graph = new Graph();
	// 	for (var y = 0; y < height; y++)
	// 		for (var x = 0; x < width; x++)
	// 		{
	// 			var index = y * width + x;
	// 			var node = new Node(index, nodecolor, nodesize, x / width, y / height);
	// 			graph.nodes.push(node);

	// 			if (x > 0)
	// 				graph.edges.push(new Edge(graph.edges.length, index, index - 1, edgecolor, edgesize));
	// 			if (y > 0)
	// 				graph.edges.push(new Edge(graph.edges.length, index, index - width, edgecolor, edgesize));
	// 		}

	// 	return graph;
	// }

	generator.generateSierpinskiGraph = function(maxDepth, nodecolor, nodesize, edgecolor, edgesize)
	{
		var graph = new Graph();
		var depth = 0;

		var Triangle = function(a, b, c)
		{
			this.a = a;
			this.b = b;
			this.c = c;
		};

		// Start with 3 node in a triangle
		graph.nodes = graph.nodes.concat([
			new Node(0, nodecolor, nodesize, 0, 1),
			new Node(1, nodecolor, nodesize, 1, 1),
			new Node(2, nodecolor, nodesize, 0.5, 0.5)
		]);

		// Create a starting triangle, and then iterate over the depth
		var currentTriangles = [new Triangle(graph.nodes[0], graph.nodes[1], graph.nodes[2])];
		for(var depth = 1; depth < maxDepth; depth++)
		{
			var nextTriangles = [];

			// Current triangles are all triangles on the current depth
			// Iterate over all of them, and put the triangles for the next depth in nextTriangles
			for (var i = 0; i < currentTriangles.length; i++)
			{
				var currentTriangle = currentTriangles[i];

				var nodeAmount = graph.nodes.length;
				var ab = new Node(nodeAmount, nodecolor, nodesize, currentTriangle.a.x + (currentTriangle.b.x - currentTriangle.a.x) / 2, currentTriangle.a.y + (currentTriangle.b.y - currentTriangle.a.y) / 2);
				var ac = new Node(nodeAmount + 1, nodecolor, nodesize, currentTriangle.a.x + (currentTriangle.c.x - currentTriangle.a.x) / 2, currentTriangle.a.y + (currentTriangle.c.y - currentTriangle.a.y) / 2);
				var bc = new Node(nodeAmount + 2, nodecolor, nodesize, currentTriangle.b.x + (currentTriangle.c.x - currentTriangle.b.x) / 2, currentTriangle.b.y + (currentTriangle.c.y - currentTriangle.b.y) / 2);
				graph.nodes = graph.nodes.concat([ab, ac, bc]);

				nextTriangles = nextTriangles.concat([new Triangle(currentTriangle.a, ab, ac), new Triangle(currentTriangle.b, bc, ab), new Triangle(currentTriangle.c, bc, ac)]);
			}

			currentTriangles = nextTriangles;
		}

		// We can only create the edges once we have all nodes in place
		// Create those edges now
		for (var i = 0; i < currentTriangles.length; i++) 
		{
			var currentTriangle = currentTriangles[i];

			graph.edges = graph.edges.concat([
				new Edge(3 * i, currentTriangle.a.id, currentTriangle.b.id, edgecolor, edgesize),
				new Edge(3 * i + 1, currentTriangle.a.id, currentTriangle.c.id, edgecolor, edgesize),
				new Edge(3 * i + 2, currentTriangle.b.id, currentTriangle.c.id, edgecolor, edgesize)
			]);
		}

		return graph;
	}

	// generator.randomize = function(graph)
	// {
	// 	for (var i = 0, node; node = graph.nodes[i]; i++)
	// 	{
	// 		node.x = Math.random();
	// 		nody.y = Math.random();
	// 	}
	// 	return graph;
	// }
	
}(window.generator = window.generator || {}))