(function(multistage)
{
	multistage.createLayout = function(nodes, edges)
	{
		var vertices = toVertices(nodes, edges);
		var length = vertices.length;
		var tree = merge(vertices);
		var depth = tree.depth
		var current = tree.vertices;
		for (var i = 0, vertex; vertex = current[i]; i++)
		{
			current[i].x = Math.random();
			current[i].y = Math.random();
		}
		
		var end = 0;
		var total = 0;
		while (depth >= end)
		{
			var k = 1 * Math.pow(1.3, depth) / Math.sqrt(length),
				s = -1/k,
				l = 0,
				r = k * k,
				c = 1 / (length * Math.sqrt(current.length)),
				stop = c;

			var iterations = 0;
			do 
			{
				iterations++;
			}
			while(force(current, s, l, r, c) / current.length > stop);
			total += iterations;

			console.log(iterations + ' iterations at depth ' + depth + ' with k = ' + k + ', c = ' + c + ' and stop = ' + stop);

			if (depth-- === end)
				continue;

			var next = [];
			for (var i = 0, vertex; vertex = current[i]; i++)
			{
				vertex.left.x = vertex.x;
				vertex.left.y = vertex.y;
				next.push(vertex.left);

				if (vertex.right)
				{
					vertex.right.x = vertex.x;
					vertex.right.y = vertex.y;
					next.push(vertex.right);
				}
			}
			current = next;
		}

		console.log('We were done after ' + total + ' iterations');
		return toGraph(current);
	}

	var supervertex = function(left, right, id)
	{
		this.id = id;
		this.left = left;
		this.right = right;
		this.weight = 0;
		this.adj = [];

		this.weight += left.weight;
		left.parent = this;

		if (right)
		{
			this.weight += right.weight;
			right.parent = this;
		}
	}

	var merge = function(vertices)
	{
		var depth = 0;

		while (vertices.length > 1)
		{
			var next = [];
			vertices.sort(function(a, b){ return a.weight - b.weight; });
			var visited = [];

			for (var i = 0, vertex; vertex = vertices[i]; i++)
			{
				if (visited[i])
					continue;

				var match = i;
				for (var j = i + 1, v; v = vertices[j]; j++)
					if (!visited[j] && vertex.adj.indexOf(v) !== -1)
					{
						match = j;
						visited[j] = true;
						next.push(new supervertex(vertex, v, next.length));
						break;
					}

				visited[i] = true;
				if (match === i)
					next.push(new supervertex(vertex, null, next.length));
			}

			for (var i = 0, vertex; vertex = next[i]; i++)
			{
				for (var j = 0, neighbor; neighbor = vertex.left.adj[j]; j++)
					if (neighbor.parent.id !== vertex.id && vertex.adj.indexOf(neighbor.parent) === -1)
						vertex.adj.push(neighbor.parent);

				if (vertex.right)
					for (var j = 0, neighbor; neighbor = vertex.right.adj[j]; j++)
						if (neighbor.parent.id !== vertex.id && vertex.adj.indexOf(neighbor.parent) === -1)
							vertex.adj.push(neighbor.parent);
			}

			depth++;
			if (next.length / vertices.length > 0.8)
				return { vertices: next, depth: depth };

			vertices = next;
		}
		return { vertices: vertices, depth: depth };
	}

	var toVertices = function(nodes, edges)
	{
		var vertices = [];
		for (var i = 0, node; node = nodes[i]; i++)
			vertices.push({ id: node.id, adj: [], weight: 1 });

		for (var i = 0, edge; edge = edges[i]; i++)
		{
			vertices[edge.source].adj.push(vertices[edge.target]);
			vertices[edge.target].adj.push(vertices[edge.source]);
		}

		return vertices;
	}

	var toGraph = function(vertices)
	{
		nodes = [];
		edges = [];
		for (var i = 0, vertex; vertex = vertices[i]; i++)
		{
			nodes[vertex.id] = {
	            id: vertex.id.toString(),
	            label: vertex.id.toString(),
	            x: vertex.x,
	            y: vertex.y,
	            size: 1,
	            color: '#666'
	        }

	        var length = vertex.adj.length;
		    for (var j = 0; j < length; j++)
		    {
		    	neighbor = vertex.adj[j];
		    	if (neighbor === null)
		    		continue;

	    		edges.push({
	    			id: edges.length.toString(),
	    			source: vertex.id.toString(),
	    			target: neighbor.id.toString(),
	    			size: 1,
					color: '#ccc'
	    		});
	    		neighbor.adj[neighbor.adj.indexOf(vertex)] = null;
		    }

		}

		return { nodes: nodes, edges: edges};
	}

	var force = function(vertices, s, l, r, c)
	{
		var length = vertices.length;
		var displacement = [];
		for (var i = 0; i < length; i++)
			displacement[i] = { x: 0, y: 0 };
		
		for (var i = 0; i < length; i++)
		{
			var u = vertices[i];

			// Repulsion
			for (var j = i + 1; j < length; j++)
			{
				var v = vertices[j];

				var d = distance(u, v);
				var dx = u.x - v.x;
				var dy = u.y - v.y;
				if (d === 0)
				{
					d = 0.1;
					dx = Math.random() * d;
					dy = Math.random() * d;
				}

				var rX = r * dx / (d * d * d);
				var rY = r * dy / (d * d * d);

				displacement[i].x += rX;
				displacement[i].y += rY;
				displacement[j].x -= rX;
				displacement[j].y -= rY;
			}

			// Attraction
			for (var k = 0, v; v = u.adj[k]; k++)
			{
				var d = distance(u, v);
				var dx = u.x - v.x;
				var dy = u.y - v.y;
			
				if (d === 0)
				{
					d = 0.1;
					dx = Math.random() * d;
					dy = Math.random() * d;
				}

				var aX = s * (d - l) * dx / d;
				var aY = s * (d - l) * dy / d;

				displacement[i].x += aX;
				displacement[i].y += aY;
			}
		}

		// Apply displacement
		var change = 0;
		for (var i = 0; i < displacement.length; i++)
		{
			var disp = displacement[i];
			var vertex = vertices[i];
			vertex.x += c * disp.x;
			vertex.y += c * disp.y;

			change += disp.x * disp.x + disp.y * disp.y;
		}

		return change;
	}

	var distance = function(a, b)
	{
		var dx = a.x - b.x;
		var dy = a.y - b.y;
		return Math.sqrt(dx * dx + dy * dy);
	}
}(window.multistage = window.multistage || {}));