package org.theorygrapht.service;

import org.theorygrapht.model.Edge;
import org.theorygrapht.model.Graph;
import org.theorygrapht.model.Vertex;

import java.util.*;

import static org.theorygrapht.util.GraphUtils.searchVertex;

public class DFS {

    public static List<Edge> getDFS(Graph graph, String startingVertexName) {
        Vertex[] vertices = graph.getVertices();
        Vertex start = searchVertex(vertices, startingVertexName);

        Set<Vertex> visited = new HashSet<>();
        Deque<Vertex> stack = new ArrayDeque<>();
        List<Edge> traversalEdges = new ArrayList<>();

        stack.push(start);
        visited.add(start);

        while (!stack.isEmpty()) {
            Vertex current = stack.pop();


            List<Edge> edges = graph.getAdjacencyList().getOrDefault(current, Collections.emptyList());

            ListIterator<Edge> it = edges.listIterator(edges.size());
            while (it.hasPrevious()) {
                Edge edge = it.previous();
                Vertex neighbor = edge.getSource().equals(current)
                        ? edge.getTarget()
                        : edge.getSource();

                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    stack.push(neighbor);
                    traversalEdges.add(new Edge(current, neighbor, edge.getWeight()));
                }
            }
        }

        return traversalEdges;
    }
}
