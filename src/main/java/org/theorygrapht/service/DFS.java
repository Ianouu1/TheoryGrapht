package org.theorygrapht.service;

import org.theorygrapht.model.Graph;
import org.theorygrapht.model.Vertex;
import org.theorygrapht.util.DummyGraph;

import java.util.*;

import static org.theorygrapht.util.GraphUtils.searchVertex;

public class DFS {

    public static List<Vertex> getDFS(String startingVertexName) {
        Graph graph = DummyGraph.create();
        Vertex[] vertices = graph.getVertices();

        Vertex start = searchVertex(vertices, startingVertexName);

        Set<Vertex> visited = new HashSet<>();
        List<Vertex> visitingOrder = new ArrayList<>();
        Map<Vertex, List<Vertex>> adjacency = new HashMap<>();

        graph.getAdjacencyList().forEach((vertex, edges) -> {
            List<Vertex> neighbors = new ArrayList<>();
            for (var edge : edges) {
                Vertex neighbor = edge.getSource().equals(vertex)
                        ? edge.getTarget()
                        : edge.getSource();
                neighbors.add(neighbor);
            }
            neighbors.sort(Comparator.comparing(Vertex::getName)); // Sort neighbors alphabetically
            adjacency.put(vertex, neighbors);
        });

        // Pile to hold vertices to visit
        Deque<Vertex> stack = new ArrayDeque<>();
        stack.push(start);

        while (!stack.isEmpty()) {
            Vertex current = stack.pop();

            if (visited.contains(current)) continue; // Skip if already visited

            visited.add(current);
            visitingOrder.add(current);

            List<Vertex> neighbors = adjacency.get(current);
            if (neighbors != null) {
                ListIterator<Vertex> it = neighbors.listIterator(neighbors.size());
                while (it.hasPrevious()) {
                    Vertex neighbor = it.previous();
                    if (!visited.contains(neighbor)) {
                        stack.push(neighbor);
                    }
                }
            }
        }

        return visitingOrder;
    }
}
