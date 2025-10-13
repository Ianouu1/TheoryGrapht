package org.theorygrapht.service;

import org.theorygrapht.model.Edge;
import org.theorygrapht.model.Graph;
import org.theorygrapht.model.Vertex;
import org.theorygrapht.util.DummyGraph;

import java.util.ArrayList;
import java.util.List;

public class Prim {
    public static List<Edge> getPrim(String startingVertexName) {
        Graph graph = DummyGraph.create();
        Vertex[] vertices = graph.getVertices();
        Edge[] edges = graph.getEdges();

        Vertex start = searchVertex(vertices, startingVertexName);

        List<Vertex> visitedVertices = new ArrayList<>();
        List<Edge> visitedEdges = new ArrayList<>();

        visitedVertices.add(start);

        while (visitedVertices.size() != vertices.length) { // while not all vertices are visited
            Edge closestEdge = null;
            closestEdge = getClosestEdge(edges, visitedVertices, closestEdge);

            if (closestEdge == null) { // if no valid edge is found (=disconnected graph)
                throw new IllegalArgumentException("This is a disconnected graph");
            }
            visitedEdges.add(closestEdge);

            if (!visitedVertices.contains(closestEdge.getTarget())) {
                visitedVertices.add(closestEdge.getTarget());
            }
        }

        return visitedEdges;
    }

    private static Vertex searchVertex(Vertex[] vertices, String startingVertexName) {
        for (Vertex v : vertices) {
            if (v.getName().equalsIgnoreCase(startingVertexName)) {
                return v;
            }
        }
        throw new IllegalArgumentException("Vertex not found : " + startingVertexName);
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
