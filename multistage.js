// TODO:
// - Roel: Get moar graphs in addition to sierpinski
//  	* Maybe other then 'geometrically' generated graphs, some real world shit
//		* Maybe a molecule
// - Tomas: Generalize the code so that normal FD and collapsed FD can be used more easily
// - Tomas Pull out the parameters to the FD algorithm and put them in a config
// - Jelle W.: Further build the analyser
// - Jelle H.: Show up for once
//
// (- For moar beauty, try to display the graph at each uncollapse level at collapsed FD)

(function(multistage)
{
	// Input: A list of nodes and a list of edges
	// Return value: A list of vertices, consisting of:
	//	* ID
	//  * Adjacency list
	//  * Weight (default 1)
	var toVertices = function(nodes, edges)
	{
		var vertices = [];

		for (var i = 0, node; node = nodes[i]; i++)
			vertices.push({ id: node.id, adj: [], weight: 1, x: node.x, y: node.y });

		for (var i = 0, edge; edge = edges[i]; i++)
		{
			vertices[edge.source].adj.push(vertices[edge.target]);
			vertices[edge.target].adj.push(vertices[edge.source]);
		}

		return vertices;
	}

	multistage.createLayout = function(nodes, edges)
	{
		var vertices = toVertices(nodes, edges);
		var verticeAmount = vertices.length;
		
		var tree = merge(vertices);
		var supervertices = tree.supervertices;

		// Give all (usually a single one) supervertices a random position
		for (var i = 0, vertex; vertex = supervertices[i]; i++)
		{
			supervertices[i].x = Math.random();
			supervertices[i].y = Math.random();
		}
		
		var zero = 0;
		var totalIterations = 0;

		for(var depth = tree.maxdepth; depth >= zero; depth--)
		{
			// k: spring constant
			// s: stiffness of the edges
			// l: optimum distance between vertices (also A LIE)
			// r: repulsion between vertices
			// c: some constant

			var k = 1 * Math.pow(1.3, depth) / Math.sqrt(verticeAmount),
				s = -1/k,
				l = 0,
				r = k * k,
				c = 1 / (verticeAmount * Math.sqrt(supervertices.length)),
				stop = c;

			// Iteratively exectute the force-directed algorithm
			var iterations = 0;
			while(true) {
				
				var change = force(supervertices, s, l, r, c) / supervertices.length;
				
				iterations++;
				totalIterations++;

				if(change <= stop || iterations >= 10000) {
					break;
				}
			}

			if(window.forceDebug)
				console.log(iterations + ' iterations at depth ' + depth + ' with k = ' + k + ', c = ' + c + ' and stop = ' + stop);

			if (depth === zero)
				break;

			// Expand all the supervertices into their left/right children
			var nextSupervertices = [];
			for (var i = 0, supervertex; supervertex = supervertices[i]; i++)
			{
				// Place the children on the position of the supervertex
				supervertex.left.x = supervertex.x;
				supervertex.left.y = supervertex.y;
				nextSupervertices.push(supervertex.left);

				if (supervertex.right)
				{
					supervertex.right.x = supervertex.x;
					supervertex.right.y = supervertex.y;
					nextSupervertices.push(supervertex.right);
				}
			}

			supervertices = nextSupervertices;
		}

		if(window.forceDebug)
			console.log('We were done after ' + totalIterations + ' iterations');
		
		// Convert all our vertices to a graph
		var resultGraph = toGraph(supervertices);
		resultGraph.iterations = totalIterations;

		return resultGraph;
	}

	multistage.createLayoutRegular = function(nodes, edges)
	{
		var vertices = toVertices(nodes, edges);
		var verticeAmount = vertices.length;
		
		// k: spring constant
		// s: stiffness of the edges
		// l: optimum distance between vertices (also A LIE)
		// r: repulsion between vertices
		// c: some constant

		var k = 1 / Math.sqrt(verticeAmount), // !
			s = -1/k,
			l = 0,
			r = k * k,
			c = 1 / (verticeAmount * Math.sqrt(verticeAmount)), // !
			stop = c;

		// Iteratively exectute the force-directed algorithm
		var iterations = 0;
		while(true) {
			
			var change = force(vertices, s, l, r, c) / verticeAmount;
			iterations++;

			if(change <= stop || iterations >= 10000) {
				break;
			}
		}

		if(window.forceDebug)
			console.log('We were done after ' + iterations + ' iterations');
		
		// Convert all our vertices to a graph
		var resultGraph = toGraph(vertices);
		resultGraph.iterations = iterations;

		return resultGraph;
	}

	var Supervertex = function(left, right, id)
	{
		this.id = id;
		this.left = left;
		this.right = right;
		this.weight = left.weight;
		this.adj = [];

		left.supervertex = this;

		if(right)
		{
			this.weight += right.weight;
			right.supervertex = this;
		}
	}

	// Input: List of vertices
	// Output: Tree object, consisting of:
	// * Supervertices
	// * Maximum depth
	var merge = function(vertices)
	{
		// Loop until we have merged all vertices to a single one
		for(var depth = 0; vertices.length > 1; depth++)
		{
			var supervertices = [];
			var visited = [];
			
			// TODO: Do we need this?
			//vertices.sort(function(a, b){ return a.weight - b.weight; });
			vertices = shuffle(vertices);

			// Loop across all vertices, and create supervertices
			for (var i = 0, vertexA; vertexA = vertices[i]; i++)
			{
				if (visited[i])
					continue;

				visited[i] = true;
				var foundMatchingVertex = false;

				// Find the first vertex, that is not visited and is adjacent to vertexA
				for (var j = i + 1, vertexB; vertexB = vertices[j]; j++)
				{
					if (!visited[j] && vertexA.adj.indexOf(vertexB) !== -1)
					{
						visited[j] = true;
						foundMatchingVertex = true;
						
						// Combine vertexA and vertexB into a supervertex, and store
						supervertices.push(new Supervertex(vertexA, vertexB, supervertices.length));
						break;
					}
				}

				// If we didn't find a matching vertex, create a supervertex of vertexA itself
				if (!foundMatchingVertex)
					supervertices.push(new Supervertex(vertexA, null, supervertices.length));
			}

			// Now loop over all created supervertices, and connect
			//  all supervertices with each other
			for (var i = 0, supervertex; supervertex = supervertices[i]; i++)
			{
				// First look at the left side
				for (var j = 0, neighbor; neighbor = supervertex.left.adj[j]; j++) 
				{
					// Make sure we don't connect supervertex.left and supervertex.right
					if(neighbor.supervertex.id === supervertex.id)
						continue;

					// Make sure we don't connect the neighbor multiple times
					if(supervertex.adj.indexOf(neighbor.supervertex) !== -1)
						continue;

					supervertex.adj.push(neighbor.supervertex);
				}

				// Do the same, but now at the right side of the supervertex
				if (supervertex.right) {
					for (var j = 0, neighbor; neighbor = supervertex.right.adj[j]; j++) {

						if(neighbor.supervertex.id === supervertex.id)
							continue;

						if(supervertex.adj.indexOf(neighbor.supervertex) !== -1)
							continue

						supervertex.adj.push(neighbor.supervertex);
					}
				}
			}

			// Check for an arbitrary parameter to see if our collection doesn't turn sour
			//if (supervertices.length / vertices.length > 0.8)
			//	return { supervertices: supervertices, depth: depth + 1 };

			vertices = supervertices;
		}

		return { supervertices: vertices, maxdepth: depth };
	}

	var shuffle = function(array) 
	{
	    var counter = array.length, result = array.slice(0), temp, index;

	    // While there are elements in the array
	    while (counter--) 
	    {
	        // Pick a random index
	        index = Math.floor((Math.random() * counter));

	        // And swap the last element with it
	        temp = result[counter];
	        result[counter] = result[index];
	        result[index] = temp;
	    }

	    return result;
	};

	var toGraph = function(vertices)
	{
		var nodes = [];
		var edges = [];

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
		    	var neighbor = vertex.adj[j];
		    	if (neighbor === null)
		    		continue;

	    		edges.push({
	    			id: edges.length.toString(),
	    			source: vertex.id.toString(),
	    			target: neighbor.id.toString(),
	    			size: 1,
					color: '#ccc'
	    		});
	    		
	    		// Clear the entry of the current vertex in the adjacency list of the neighbor
	    		neighbor.adj[neighbor.adj.indexOf(vertex)] = null;
		    }

		}

		return { nodes: nodes, edges: edges};
	}

	var force = function(vertices, s, l, r, c)
	{
		// s: stiffness of the edges
		// l: optimum distance between vertices (also A LIE)
		// r: repulsion between vertices
		// c: some constant

		var verticeAmount = vertices.length;
		var displacement = [];

		// For each vertex, create a (null) displacement
		for (var i = 0; i < verticeAmount; i++)
			displacement[i] = { x: 0, y: 0 };

		for (var i = 0; i < verticeAmount; i++)
		{
			var vertexA = vertices[i];

			// Calculate the repulsion between vertices
			for (var j = i + 1; j < verticeAmount; j++)
			{
				var vertexB = vertices[j];

				var d = distance(vertexA, vertexB);
				var dx = vertexA.x - vertexB.x;
				var dy = vertexA.y - vertexB.y;
				
				// Make sure we don't get a division by zero
				if (d === 0)
				{
					d = 0.1;
					dx = Math.random() * d;
					dy = Math.random() * d;
				}

				// repulsion = constant * deltaPosition / distance^3
				var repulsionX = r * dx / (d * d * d);
				var repulsionY = r * dy / (d * d * d);

				displacement[i].x += repulsionX;
				displacement[i].y += repulsionY;
				displacement[j].x -= repulsionX;
				displacement[j].y -= repulsionY;
			}

			// Calculate the attraction between neigbors
			for (var k = 0, neighbor; neighbor = vertexA.adj[k]; k++)
			{
				var d = distance(vertexA, neighbor);
				var dx = vertexA.x - neighbor.x;
				var dy = vertexA.y - neighbor.y;
			
				// Don't attract if we're on top of each other anyway
				if (d === 0)
					continue;

				// attraction = constant * (distance - constant) * deltaDistance / distance
				var attractionX = s * (d - l) * dx / d;
				var attractionY = s * (d - l) * dy / d;

				displacement[i].x += attractionX;
				displacement[i].y += attractionY;
			}
		}

		// Apply displacement
		var change = 0;
		
		for (var i = 0; i < verticeAmount; i++)
		{
			vertices[i].x += c * displacement[i].x;
			vertices[i].y += c * displacement[i].y;

			// The change is the square of the displacement on both axes
			change += displacement[i].x * displacement[i].x + displacement[i].y * displacement[i].y;
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