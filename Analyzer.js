(function() {

	var Analyzer = (function() {

		function Analyzer(graph) {
			this.graph = graph;
			this.nodes = graph.nodes;
			this.edges = graph.edges;
		}

		// --- Private functions --

		Analyzer.prototype._checkIfEdgesCross = function(e1, e2) { 

			if(e1.source == e2.source || e1.source == e2.target || 
				e1.target == e2.source || e1.target == e2.target) {
				return false;
			}

			var p0_x = nodes[e1.source].x;
			var p0_y = nodes[e1.source].y;
			var p1_x = nodes[e1.target].x;
			var p1_y = nodes[e1.target].y;

			var p2_x = nodes[e2.source].x;
			var p2_y = nodes[e2.source].y;
			var p3_x = nodes[e2.target].x;
			var p3_y = nodes[e2.target].y;

			var s1_x, s1_y, s2_x, s2_y;
			s1_x = p1_x - p0_x;
			s1_y = p1_y - p0_y;
			s2_x = p3_x - p2_x;
			s2_y = p3_y - p2_y;

			var s, t;

			s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
			t = ( s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);

			if (s >= 0 && s <= 1 && t >= 0 && t <= 1) { 
				return true;
			} 

			return false;
		}

		Analyzer.prototype._getNeighbourNodes = function(node)
		{
			var neighbourNodes = [];

			for(var i = 0; i < this.edges.length; i++) {
				
				if(this.edges[i].source == node.id) {
					neighbourNodes.push( this.nodes[this.edges[i].target] );
				} else if(edges[i].target == node.id) {
					neighbourNodes.push( this.nodes[this.edges[i].source] );
				}

			}

			return neighbourNodes;
		}

		Analyzer.prototype._getSingleMinAngle = function(node)
		{
			var neighbourNodes = this._getNeighbourNodes(node);
			var minAngle = Number.MAX_VALUE;

			for(var i = 0; i < neighbourNodes.length; ++i) {
				for(var j = i + 1; j < neighbourNodes.length; ++j) {

					var angle1 = Math.atan2(node.y - neighbourNodes[i].y, node.x - neighbourNodes[i].x);
					var angle2 = Math.atan2(node.y - neighbourNodes[j].y, node.x - neighbourNodes[j].x);

					var angleDifference = Math.abs(angle1 - angle2);
					var currentAngle = Math.min( angleDifference, 2 * Math.PI - angleDifference);

					var minAngle = Math.min(minAngle, currentAngle);
				}
			}

			return minAngle;
		}

		Analyzer.prototype._getPointsDistance = function(pointOne, pointTwo) {
			var firstSide = pointTwo.x - pointOne.x;
			var secondSide = pointTwo.y - pointTwo.y;

			return Math.sqrt(firstSide * firstSide + secondSide * secondSide);
		}

		// --- Public functions ---
		Analyzer.prototype.getCrossingsAmount = function(graph)
		{
			var crossingsAmount = 0;

			for(var i = 0; i < this.edges.length; i++) {
				for(var j = i + 1; j < this.edges.length; j++) {
					
					if(this._checkIfEdgesCross(this.edges[i], this.edges[j])) {
						crossingsAmount += 1;
					}

				}
			}

			return crossingsAmount;
		}

		Analyzer.prototype.getMinAngle = function()
		{
			var nodeAngles = [];
			var globalMinAngle = Number.MAX_VALUE;

			for(var i = 0; i < this.nodes.length; i++)
			{
				var currentMinAngle = this._getSingleMinAngle(this.nodes[i]);
				
				nodeAngles.push(currentMinAngle);
				globalMinAngle = Math.min(globalMinAngle, currentMinAngle);
			}

			return {nodeAngles: nodeAngles, globalMinAngle: globalMinAngle};
		}

		Analyzer.prototype.getEdgeLengths = function() {
			var edgeLengths = [];

			for(var i = 0; i < this.edges.length; ++i) {
				var pointOne = this.nodes[ this.edges[i].source ];
				var pointTwo = this.nodes[ this.edges[i].target ];

				edgeLengths.push( this._getPointsDistance(pointOne, pointTwo) );
			}

			return edgeLengths;
		}

		Analyzer.prototype.getNodeDistances = function() {
			var nodeDistances = []

			for(var i = 0; i < this.nodes.length; ++i) {
				for(var j = i + 1; j < this.nodes.length; ++j) {
					nodeDistances.push( this._getPointsDistance(this.nodes[i], this.nodes[j]) );
				}
			}

			return nodeDistances;
		}

		Analyzer.prototype.analyze = function()
		{
			return {
				crossingsAmount: this.getCrossingsAmount(),
				// symmetry: this.getSymmetry(),
				minAngle: this.getMinAngle(),
				edgeLengths: this.getEdgeLengths(),
				nodeDistances: this.getNodeDistances(),
				// max_edge_orthogonality: this.getMaxEdgeOrthogonality(),
				// max_node_orthogonality: this.getMaxNodeOrthogonality()
			}
		}



		window.Analyzer = Analyzer;
		return Analyzer;

	})();

}).call(this);