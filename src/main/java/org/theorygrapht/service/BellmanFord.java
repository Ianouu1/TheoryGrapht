package org.theorygrapht.service;

import org.theorygrapht.model.Edge;
import org.theorygrapht.model.Graph;
import org.theorygrapht.model.Vertex;
import org.theorygrapht.util.DummyGraph;

import java.util.HashMap;
import java.util.Map;

import static org.theorygrapht.util.GraphUtils.searchVertex;

public class BellmanFord {

    public static Map<Vertex, Integer> getBellmanFord(Graph graph, String startingVertexName) {
        Vertex[] vertices = graph.getVertices();
        Edge[] edges = graph.getEdges();

        Vertex start = searchVertex(vertices, startingVertexName);

        // Initialize distance map
        Map<Vertex, Integer> dist = new HashMap<>();
        for (Vertex v : vertices) dist.put(v, Integer.MAX_VALUE);
        dist.put(start, 0);

        int V = vertices.length;

        // Relax edges V-1 times
        for (int i = 0; i < V - 1; i++) {
            boolean updated = false;
            for (Edge e : edges) {
                Vertex u = e.getSource();
                Vertex v = e.getTarget();
                int w = e.getWeight();

                // Relaxation from u → v
                if (dist.get(u) != Integer.MAX_VALUE && dist.get(u) + w < dist.get(v)) {
                    dist.put(v, dist.get(u) + w);
                    updated = true;
                }
                // Relaxation from v → u (undirected graph)
                if (dist.get(v) != Integer.MAX_VALUE && dist.get(v) + w < dist.get(u)) {
                    dist.put(u, dist.get(v) + w);
                    updated = true;
                }
            }
            if (!updated) break; // Optimization: stop early if no update occurred
        }

        // Check for negative-weight cycles
        for (Edge e : edges) {
            Vertex u = e.getSource();
            Vertex v = e.getTarget();
            int w = e.getWeight();

            if (dist.get(u) != Integer.MAX_VALUE && dist.get(u) + w < dist.get(v)) {
                throw new IllegalStateException("Graph contains a negative-weight cycle");
            }
            if (dist.get(v) != Integer.MAX_VALUE && dist.get(v) + w < dist.get(u)) {
                throw new IllegalStateException("Graph contains a negative-weight cycle");
            }
        }

        return dist;
    }
}
