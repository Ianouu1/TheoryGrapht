package org.theorygrapht.service;

import org.theorygrapht.model.Edge;
import org.theorygrapht.model.Graph;
import org.theorygrapht.model.Vertex;
import org.theorygrapht.util.DummyGraph;

import java.util.*;

public class Kruskal {

    public static List<Edge> getKruskal() {
        Graph graph = DummyGraph.create();
        List<Edge> edges = new ArrayList<>(Arrays.asList(graph.getEdges()));
        edges.sort(Comparator.comparingInt(Edge::getWeight));

        // Union-Find initialization
        Map<Vertex, Vertex> parent = new HashMap<>();
        for (Vertex v : graph.getVertices()) {
            parent.put(v, v);
        }

        List<Edge> mst = new ArrayList<>();
        for (Edge e : edges) {
            Vertex root1 = find(parent, e.getSource());
            Vertex root2 = find(parent, e.getTarget());

            // if the two vertices are not already connected
            if (!root1.equals(root2)) {
                mst.add(e);
                parent.put(root1, root2); // union
            }
        }

        return mst;
    }

    private static Vertex find(Map<Vertex, Vertex> parent, Vertex v) {
        if (!parent.get(v).equals(v)) {
            parent.put(v, find(parent, parent.get(v))); // path compression
        }
        return parent.get(v);
    }
}
