package org.theorygrapht.model;

import java.util.List;
import java.util.Map;

public class Graph {
    private Vertex[] vertices;
    private Edge[] edges;
    private Map<Vertex, List<Edge>> adjacencyList;

    public Graph() {
    }

    public Graph(Vertex[] vertices, Edge[] edges, Map<Vertex, List<Edge>> adjacencyList) {
        this.vertices = vertices;
        this.edges = edges;
        this.adjacencyList = adjacencyList;
    }

    public Vertex[] getVertices() {
        return vertices;
    }


    public Edge[] getEdges() {
        return edges;
    }

    public Map<Vertex, List<Edge>> getAdjacencyList() {
        return adjacencyList;
    }
}
