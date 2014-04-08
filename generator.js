(function(generator)
{
	var Graph = function(nodes, edges)
	{
		this.nodes = nodes || [];
		this.edges = edges || [];
		
		this.iterations = null;
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

	generator.generateSquareGrid = function(width, height, nodecolor, nodesize, edgecolor, edgesize)
	{
		var graph = new Graph();

		for (var y = 0; y < height; y++)
			for (var x = 0; x < width; x++)
			{
				// Create a node at each (x, y) position in the grid
				var index = y * width + x;
				var node = new Node(index, nodecolor, nodesize, x / width, y / height);
				graph.nodes.push(node);

				// Connect the node to its left and top neighbor, if possible
				if (x > 0)
					graph.edges.push(new Edge(graph.edges.length, index, index - 1, edgecolor, edgesize));
				if (y > 0)
					graph.edges.push(new Edge(graph.edges.length, index, index - width, edgecolor, edgesize));
			}

		return graph;
	}

	generator.generateTriangleGrid = function(width, height, nodecolor, nodesize, edgecolor, edgesize)
	{
		var graph = new Graph();

		for (var y = 0; y < height; y++)
			for (var x = 0; x < width; x++)
			{
				// Create a node at each (x, y) position in the grid
				var index = y * width + x;
				var node = new Node(index, nodecolor, nodesize, x / width, y / height);
				graph.nodes.push(node);

				// Connect the node to its left, top and topleft neighbor, if possible
				if (x > 0)
					graph.edges.push(new Edge(graph.edges.length, index, index - 1, edgecolor, edgesize));
				if (y > 0)
					graph.edges.push(new Edge(graph.edges.length, index, index - width, edgecolor, edgesize));
				if (x > 0 && y > 0)
					graph.edges.push(new Edge(graph.edges.length, index, index - width - 1, edgecolor, edgesize));
			}

		return graph;
	}

	generator.generateHexagonalGrid = function(width, height, nodecolor, nodesize, edgecolor, edgesize)
	{
		var graph = new Graph();

		for (var y = 0; y <= height; y++)
		{
			var offset = 1/6;
			for (var x = 0; x < width; x++)
			{
				// Create the topleft node
				var id = graph.nodes.length;
				graph.nodes.push(new Node(id, nodecolor, nodesize, (x + offset) / width, y / height));
				// Connect it to its upper left neighbor
				if (id - 2 * width >= 0)
					graph.edges.push(new Edge(graph.edges.length, id, id - 2 * width, edgecolor, edgesize));

				id = graph.nodes.length;
				// Create the topright node
				graph.nodes.push(new Node(id, nodecolor, nodesize, (x + 1/3 + offset) / width, y / height));
				// Connect it to its left neighbor
				graph.edges.push(new Edge(graph.edges.length, id, id - 1, edgecolor, edgesize));
				// Connect it to its upper right neighbor
				if (id - 2 * width >= 0)
					graph.edges.push(new Edge(graph.edges.length, id, id - 2 * width, edgecolor, edgesize));
			}

			// No need to add more nodes when we reach the bottom row
			if (y === height)
				break;

			for (var x = 0; x < width; x++)
			{	
				// Create the left node
				var id = graph.nodes.length;
				graph.nodes.push(new Node(id, nodecolor, nodesize, x / width, (y + 1/2) / height));
				// Connect it to its left neighbor
				if (x > 0)
					graph.edges.push(new Edge(graph.edges.length, id, id - 1, edgecolor, edgesize));
				// Connect it to its upper right neighbor
				if (id - 2 * width >= 0)
					graph.edges.push(new Edge(graph.edges.length, id, id - 2 * width, edgecolor, edgesize));

				var id = graph.nodes.length;
				// Create the right node
				graph.nodes.push(new Node(id, nodecolor, nodesize, (x + 2/3) / width, (y + 1/2) / height));
				// Connect it to its upper left neighbor
				if (id - 2 * width >= 0)
					graph.edges.push(new Edge(graph.edges.length, id, id - 2 * width, edgecolor, edgesize));
			}
		}

		return graph;
	}

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

	generator.generateTree = function(maxDepth, branchingFactor, nodecolor, nodesize, edgecolor, edgesize)
	{
		var graph = new Graph();

		// Add the root node
		graph.nodes.push(new Node(0, nodecolor, nodesize, 1/2, 0));

		for (var depth = 1; depth <= maxDepth; depth++)
		{
			var nodeAmount = Math.pow(branchingFactor, depth);
			for (var depthIndex = 0; depthIndex < nodeAmount; depthIndex++)
			{
				// Create the node
				var id = graph.nodes.length;
				graph.nodes.push(new Node(id, nodecolor, nodesize, (depthIndex + 1) / (nodeAmount + 1), depth / maxDepth));
				// Connect the node to its parent
				graph.edges.push(new Edge(graph.edges.length, id, Math.floor((id - 1) / branchingFactor), edgecolor, edgesize));
			}
		}

		return graph;
	}

	generator.generatePolygon = function(sides, nodecolor, nodesize, edgecolor, edgesize)
	{
		var graph = new Graph();

		for (var index = 0; index < sides; index++)
		{
			var angle = (index / sides) * 2 * Math.PI;
			// Create the node
			graph.nodes.push(new Node(index, nodecolor, nodesize, (1 + Math.cos(angle)) / 2, (1 + Math.sin(angle)) / 2));
			// Connect it to its next neigbor
			graph.edges.push(new Edge(index, index, (index + 1) % sides, edgecolor, edgesize));
		}

		return graph;
	}

	generator.generateFatPolygon = function(sides, maxDepth, branchingFactor, nodecolor, nodesize, edgecolor, edgesize)
	{
		var graph = new Graph();

		for (var depth = 0; depth <= maxDepth; depth++)
		{
			var nodeAmount = sides * Math.pow(branchingFactor, depth);
			var radius = (depth + 1) / (2 * (maxDepth + 1));

			for (var index = 0; index < nodeAmount; index++)
			{
				var angle = ((index + 1/2) / nodeAmount) * 2 * Math.PI;
				var id = graph.nodes.length;

				graph.nodes.push(new Node(id, nodecolor, nodesize, radius * Math.cos(angle) + 1/2, radius * Math.sin(angle) + 1/2));
				graph.edges.push(new Edge(graph.edges.length, id, id - index + ((index + 1) % nodeAmount), edgecolor, edgesize));
				if (depth > 0)
					graph.edges.push(new Edge(graph.edges.length, id, Math.floor((id - sides) / branchingFactor), edgecolor, edgesize));
			}
		}

		return graph;
	}

	generator.randomize = function(graph)
	{
		for (var i = 0, node; node = graph.nodes[i]; i++)
		{
			node.x = Math.random();
			node.y = Math.random();
		}
		
		return graph;
	}
	
}(window.generator = window.generator || {}))