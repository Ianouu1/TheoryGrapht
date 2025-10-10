package org.theorygrapht.model;

import java.util.Arrays;
import java.util.List;

public class Graph {
    private Vertex[] vertices;
    private Edge[] edges;

    public Graph() {
    }

    public Graph(Vertex[] vertices, Edge[] edges) {
        this.vertices = vertices;
        this.edges = edges;
    }

    public Vertex[] getVertices() {
        return vertices;
    }

    public void setVertices(Vertex[] vertices) {
        this.vertices = vertices;
    }

    public Edge[] getEdges() {
        return edges;
    }

    public void setEdges(Edge[] edges) {
        this.edges = edges;
    }

    public List<Vertex> verticesAsList() {
        return Arrays.asList(vertices);
    }
}
