package org.theorygrapht.service;

import org.theorygrapht.model.Edge;
import org.theorygrapht.model.Graph;
import org.theorygrapht.model.Vertex;
import org.theorygrapht.util.DummyGraph;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.theorygrapht.util.GraphUtils.searchVertex;

public class Prim {
    public static Map<String, Object> getPrim(String startingVertexName) {
        Graph graph = DummyGraph.create();
        Vertex[] vertices = graph.getVertices();
        Edge[] edges = graph.getEdges();

        Vertex start = searchVertex(vertices, startingVertexName);

        List<Vertex> visitedVertices = new ArrayList<>();
        List<Edge> visitedEdges = new ArrayList<>();
        int totalCost = 0;

        visitedVertices.add(start);

        while (visitedVertices.size() != vertices.length) { // while not all vertices are visited
            Edge closestEdge = null;
            closestEdge = getClosestEdge(edges, visitedVertices, closestEdge);

            if (closestEdge == null) { // if no valid edge is found (=disconnected graph)
                throw new IllegalArgumentException("This is a disconnected graph");
            }
            visitedEdges.add(closestEdge);
            totalCost += closestEdge.getWeight();
            if (!visitedVertices.contains(closestEdge.getTarget())) {
                visitedVertices.add(closestEdge.getTarget());
            }
        }
        Map<String, Object> result = new HashMap<>();
        result.put("visitedEdges", visitedEdges);
        result.put("totalCost", totalCost);
        return result;
    }



    private static Edge getClosestEdge(Edge[] edges, List<Vertex> visited, Edge closestEdge) {
        for (Edge edge : edges) {
            Vertex source = edge.getSource();
            Vertex target = edge.getTarget();

            boolean visitedSource = visited.contains(source);
            boolean visitedTarget = visited.contains(target);

            if (visitedSource && !visitedTarget) { // If one vertex is visited and the other is not
                if (closestEdge == null || edge.getWeight() < closestEdge.getWeight()) {
                    closestEdge = edge;
                }
            }
        }
        return closestEdge;
    }
}
