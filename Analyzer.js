var Analyzer = {}

Analyzer.getCrossings = function(graph)
{
	var edges = graph.edges
    var n = edges.length;
    var nodes = graph.nodes

    var doCross = function(e1, e2)
    {
        var x1 = nodes[e1.source].x
        var y1 = nodes[e1.source].y
        var x2 = nodes[e1.target].x
        var y2 = nodes[e1.target].y
        var x3 = nodes[e2.source].x
        var y3 = nodes[e2.source].y
        var x4 = nodes[e2.target].x
        var y4 = nodes[e2.target].y
        
        var denomTerm = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)

        if(denomTerm == 0) // paralel
            return false
        else
        {
            Px = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4))/denomTerm
            Py = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4))/denomTerm

            if(Px >= Math.min(x1, x2, x3, x3) && Px <= Math.max(x1,x2,x3,x4)
            && Py >= Math.min(y1, y2, y3, y3) && Py <= Math.max(y1,y2,y3,y4))
                return true

            return false
        }
    }

    var nCrossings = 0;
	for(var i = 0; i < n; i++)
        for(var j = i+1; j < n; j++)
            if(doCross(edges[i], edges[j]))
                nCrossings++

    return nCrossings
}

Analyzer.GetSymmetry = function(graph)
{

}

Analyzer.getMinAngle  = function(graph)
{
    var nodes = graph.nodes
    var edges = graph.edges

    var getEdges = function(node)
    {
        var n = edges.length
        var es = []
        for(var i = 0; i < n; i++)
        {
            if(edges[i].source == node.id || edges[i].target == node.id)
                es.push(edges[i])
        }
        return es
    }

    var getAngle = function(line1, line2)
    {
        var angle1 = Math.atan2(parseInt(line1.p1.y) - parseInt(line1.p2.y), parseInt(line1.p1.x) - parseInt(line1.p2.x))
        var angle2 = Math.atan2(parseInt(line2.p1.y) - parseInt(line2.p2.y), parseInt(line2.p1.x) - parseInt(line2.p2.x))

        if(angle1 - angle2 == 0)
        {
            console.log(line1)
            console.log(line2)
            console.log("--")
        }

        return Math.abs(angle1 - angle2);
    }

    var getSingleMinAngle = function(nodeEdges)
    {   
        var minAngle= Number.MAX_VALUE
        var n = nodeEdges.length;
        if(n > 0)
            for(var i = 0; i < n; i++)
                for(var j = i+1; j < n; j++)
                {
                    minAngle = Math.min(minAngle, getAngle({
                        p1 : nodes[nodeEdges[i].source],
                        p2 : nodes[nodeEdges[i].target]
                    }, {
                        p1 : nodes[nodeEdges[j].source],
                        p2 : nodes[nodeEdges[j].target]
                    }))
                }
        return minAngle
    }

    var n = nodes.length
    var minAngle = Number.MAX_VALUE
    for(var i = 0; i < n; i++)
    {
        minAngle = Math.min(minAngle, getSingleMinAngle(getEdges(nodes[i])))       
    }

    return minAngle
}   

Analyzer.Analyze = function(graph)
{
	return {
		crossing_edges: Analyzer.getCrossings(graph),
		// symmetry: Analyzer.getSymmetry(graph),
		min_angle: Analyzer.getMinAngle(graph),
		// max_edge_orthogonality: Analyzer.getMaxEdgeOrthogonality(graph),
		// max_node_orthogonality: Analyzer.getMaxNodeOrthogonality(graph)
	}
}