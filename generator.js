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

	generator.generateSquareGrid = function(width, height, nodecolor, nodesize, edgecolor, edgesize)
	{
		var graph = new Graph();
		for (var y = 0; y < height; y++)
			for (var x = 0; x < width; x++)
			{
				var index = y * width + x;
				var node = new Node(index, nodecolor, nodesize, x / width, y / height);
				graph.nodes.push(node);

				if (x > 0)
					graph.edges.push(new Edge(graph.edges.length, index, index - 1, edgecolor, edgesize));
				if (y > 0)
					graph.edges.push(new Edge(graph.edges.length, index, index - width, edgecolor, edgesize));
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

		graph.nodes = graph.nodes.concat([
			new Node(0, nodecolor, nodesize, 0, 1),
			new Node(1, nodecolor, nodesize, 1, 1),
			new Node(2, nodecolor, nodesize, 0.5, 0.5)
		]);

		var current = [new Triangle(graph.nodes[0], graph.nodes[1], graph.nodes[2])];
		while (depth++ < maxDepth)
		{
			var next = [];
			for (var i = 0, t; t = current[i]; i++)
			{
				var l = graph.nodes.length;
				var ab = new Node(l, nodecolor, nodesize, t.a.x + (t.b.x - t.a.x) / 2, t.a.y + (t.b.y - t.a.y) / 2);
				var ac = new Node(l+1, nodecolor, nodesize, t.a.x + (t.c.x - t.a.x) / 2, t.a.y + (t.c.y - t.a.y) / 2);
				var bc = new Node(l+2, nodecolor, nodesize, t.b.x + (t.c.x - t.b.x) / 2, t.b.y + (t.c.y - t.b.y) / 2);
				graph.nodes = graph.nodes.concat([ab, ac, bc]);

				next = next.concat([new Triangle(t.a, ab, ac), new Triangle(t.b, bc, ab), new Triangle(t.c, bc, ac)]);
			}
			current = next;
		}

		for (var i = 0, t; t = current[i]; i++)
			graph.edges = graph.edges.concat([
				new Edge(3*i, t.a.id, t.b.id, edgecolor, edgesize),
				new Edge(3*i+1, t.a.id, t.c.id, edgecolor, edgesize),
				new Edge(3*i+2, t.b.id, t.c.id, edgecolor, edgesize)
			]);

		return graph;
	}

	generator.randomize = function(graph)
	{
		for (var i = 0, node; node = graph.nodes[i]; i++)
		{
			node.x = Math.random();
			nody.y = Math.random();
		}
		return graph;
	}
}(window.generator = window.generator || {}))