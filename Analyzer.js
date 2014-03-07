var Analyzer = {}

Analyzer.getCrossings = function(graph)
{
	var edges = graph.edges()
	for(var i = 0; i < edges.length; )
}

Analyzer.Analyze = function(graph)
{
	return {
		crossing_edges: Analyzer.getCrossings(graph),
		symmetry: Analyzer.getSymmatry(graph),
		min_angle: Analyzer.getMinAngle(graph),
		max_edge_orthogonality: Analyzer.getMaxEdgeOrthogonality(graph),
		max_node_orthogonality: Analyzer.getMaxNodeOrthogonality(graph)
	}
}