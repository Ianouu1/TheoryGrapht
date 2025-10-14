package org.theorygrapht.service;

import org.theorygrapht.model.Edge;
import org.theorygrapht.model.Graph;
import org.theorygrapht.model.Vertex;
import org.theorygrapht.util.DummyGraph;

import java.util.*;

import static org.theorygrapht.util.GraphUtils.searchVertex;

public class BFS {
    public static List<Edge> getBFS(Graph graph, String startingVertexName) {
        Vertex[] vertices = graph.getVertices();
        Vertex start = searchVertex(vertices, startingVertexName);

        Set<Vertex> visited = new HashSet<>();
        Queue<Vertex> queue = new LinkedList<>();
        List<Edge> traversalEdges = new ArrayList<>();

        visited.add(start);
        queue.add(start);

        while (!queue.isEmpty()) {
            Vertex current = queue.poll();

            for (Edge edge : graph.getAdjacencyList().get(current)) {
                Vertex neighbor = edge.getSource().equals(current)
                        ? edge.getTarget()
                        : edge.getSource();

                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    queue.add(neighbor);
                    traversalEdges.add(edge);
                }
            }
        }

        return traversalEdges;
    }
}
