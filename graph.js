var createRandomGraph = function(numberOfNodes, maxNEdgesPerNode, width, height)
{
    var graph = {nodes: [], edges: []};
    var edges = [];

    for(var i = 0; i < numberOfNodes; i++)
    {
        var iString = i.toString()

        if(edges[i] == undefined)
            edges[i] = [];

        // Add a new node with random positions to the list
        graph.nodes.push({
            id: i.toString(),
            label: i.toString(),
            x: Math.floor(Math.random() * width),
            y: Math.floor(Math.random() * height),
            size: 1,
            color: '#666'
        });
        
        var nEdges = Math.floor(Math.sqrt(Math.floor(Math.random() * maxNEdgesPerNode * maxNEdgesPerNode) + 1));

        for(var j = 0; j < nEdges; j++)
        {
            var nodeId = (Math.floor(Math.random() * numberOfNodes)).toString();
            
            while(nodeId == iString || (edges[nodeId] !== undefined && iString in edges[nodeId]) || nodeId in edges[iString])
                nodeId = Math.floor(Math.random() * numberOfNodes);

            graph.edges.push({
                source: iString,
                target: nodeId,
                id: iString,
                size: 1,
                color: '#ccc',
            });

            edges[i][nodeId] = true;
        }
    }
    
    return graph;
}

var randomGraph = function(vertices, density, width, height)
{
    // Clamp the density
    density = Math.min(1, Math.max(0, density));

    var graph = { nodes : [], edges : [] };
    for (i = 0; i < vertices; i++)
        graph.nodes.push({
            id: i.toString(),
            label: i.toString(),
            x: Math.random() * width,
            y: Math.random() * height,
            size: 1,
            color: '#666'
        });

    var edges = getEdges(vertices, density);
    for (i = 0; i < edges.length; i++)
    {
        var edge = edges[i];
        edge.id = i.toString();
        edge.size = 1;
        edge.color = '#ccc';
        graph.edges.push(edge);
    }

    return graph;
};

var getEdges = function(size, density)
{
    // Build a complete graph with #vertices = size
    // and random weights
    var matrix = [];
    for (var i = 0; i < size; i++)
    {
        matrix[i] = [];
        for (var j = 0; j < size; j++)
            matrix[i][j] = Math.random();
    }

    // Calculate the minimal spanning tree
    // and create those edges
    var edges = [];
    var explored = [Math.floor(Math.random() * size)];
    while (explored.length < size)
    {
        var min = Infinity, source = 0, target = 0;
        for (var i = 0; i < explored.length; i++)
        {
            var v = explored[i];
            for (var j = 0; j < size; j++)
                if (explored.indexOf(j) === -1 && matrix[v][j] < min)
                {
                    min = matrix[v][j];
                    source = v;
                    target = j;
                }
        }
        edges.push({ source : source.toString(), target : target.toString()});
        explored.push(target);
    }

    // Create all other edges
    var candidates = [];
    for (var i = 0; i < size; i++)
        for (var j = i + 1; j < size; j++)
            if (!edgeExists(edges, i, j))
                candidates.push({ source : i.toString(), target : j.toString() });

    // Take random edges till we reach the correct density
    var shuffled = shuffle(candidates);
    for (var i = 0; shuffled.length > (1 - density) * candidates.length; i++)
        edges.push(shuffled.pop());

    return edges;
}

var edgeExists = function(edges, n1, n2)
{
    for (var i = 0, edge; edge = edges[i]; i++)
        if ((edge.source == n1 && edge.target == n2) || (edge.source == n2 && edge.target == n1))
            return true;
    return false;
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