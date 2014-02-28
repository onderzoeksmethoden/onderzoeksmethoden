var force = function(nodes, edges, s, l, r, c)
{
	var displacement = [];
	for (var i = 0; i < nodes.length; i++)
		displacement[i] = { x: 0, y: 0 };

	// Repulsion
	for (var i = 0; i < nodes.length; i++)
	{
		var u = nodes[i];
		for (var j = i + 1; j < nodes.length; j++)
		{
			var v = nodes[j];

			var d = distance(u, v);
			var dx = u.x - v.x;
			var dy = u.y - v.y;
			if (d === 0)
			{
				d = 0.001;
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
	}

	// Attraction
	for (var k = 0; k < edges.length; k++)
	{
		var edge = edges[k];
		var i = edge.source;
		var j = edge.target;
		var u = nodes[i];
		var v = nodes[j];

		var d = distance(u, v);
		var dx = u.x - v.x;
		var dy = u.y - v.y;
		
		if (d === 0)
		{
			d = 0.001;
			dx = Math.random() * d;
			dy = Math.random() * d;
		}

		var aX = s * (d - l) * dx / d;
		var aY = s * (d - l) * dy / d;

		displacement[i].x += aX;
		displacement[i].y += aY;
		displacement[j].x -= aX;
		displacement[j].y -= aY;
	}

	// Apply displacement
	var change = 0;
	for (var i = 0; i < displacement.length; i++)
	{
		var disp = displacement[i];
		var node = nodes[i];
		node.x += c * disp.x;
		node.y += c * disp.y;

		change += Math.abs(disp.x) + Math.abs(disp.y);
	}

	return change;
}

var distance = function(a, b)
{
	var dx = a.x - b.x;
	var dy = a.y - b.y;
	return Math.sqrt(dx * dx + dy * dy);
}