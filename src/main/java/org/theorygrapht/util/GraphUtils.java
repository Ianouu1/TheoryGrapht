package org.theorygrapht.util;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.theorygrapht.model.Edge;
import org.theorygrapht.model.Graph;
import org.theorygrapht.model.GraphInput;
import org.theorygrapht.model.Vertex;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class GraphUtils {
    public static Graph loadJson(String resourcePath) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            InputStream is = GraphUtils.class.getClassLoader().getResourceAsStream(resourcePath);
            if (is == null) {
                throw new IllegalStateException("Resource not found: " + resourcePath);
            }

            TypeReference<Map<String, List<Map<String, Object>>>> typeRef = new TypeReference<>() {
            };
            Map<String, List<Map<String, Object>>> raw = mapper.readValue(is, typeRef);

            // Create vertices
            List<Vertex> vertices = new ArrayList<>();
            for (String name : raw.keySet()) {
                vertices.add(new Vertex(name));
            }

            // Also ensure vertices referenced only as targets are included
            for (List<Map<String, Object>> neighbours : raw.values()) {
                for (Map<String, Object> n : neighbours) {
                    String name = (String) n.get("target");
                    boolean exists = vertices.stream().anyMatch(v -> v.getName().equals(name));
                    if (!exists) vertices.add(new Vertex(name));
                }
            }

            // Map names to vertex instances
            java.util.Map<String, Vertex> map = new java.util.HashMap<>();
            for (Vertex v : vertices) map.put(v.getName(), v);

            // Build edges
            List<Edge> edges = new ArrayList<>();
            for (Map.Entry<String, List<Map<String, Object>>> e : raw.entrySet()) {
                String from = e.getKey();
                Vertex vf = map.get(from);
                for (Map<String, Object> nb : e.getValue()) {
                    String target = (String) nb.get("target");
                    int dist = ((Number) nb.get("distance")).intValue();
                    Vertex vt = map.get(target);
                    edges.add(new Edge(vf, vt, dist));
                }
            }

            // Build adjacency list
            Map<Vertex, List<Edge>> adjacencyList = new HashMap<>();
            for (Vertex v : vertices) {
                adjacencyList.put(v, new ArrayList<>());
            }
            for (Edge e : edges) {
                adjacencyList.get(e.getSource()).add(e);
                adjacencyList.get(e.getTarget()).add(e);
            }

            return new Graph(vertices.toArray(new Vertex[0]), edges.toArray(new Edge[0]), adjacencyList);

        } catch (Exception ex) {
            throw new RuntimeException("Failed to load graph from resource", ex);
        }
    }

    public static Vertex searchVertex(Vertex[] vertices, String startingVertexName) {
        for (Vertex v : vertices) {
            if (v.getName().equalsIgnoreCase(startingVertexName)) {
                return v;
            }
        }
        throw new IllegalArgumentException("Vertex not found : " + startingVertexName);
    }

    public static List<Vertex> getNeighbors(Graph graph, Vertex vertex) {
        List<Vertex> neighbors = new ArrayList<>();
        for (Edge e : graph.getAdjacencyList().get(vertex)) {
            Vertex neighbor = e.getSource().equals(vertex) ? e.getTarget() : e.getSource();
            neighbors.add(neighbor);
        }
        return neighbors;
    }

    public static Graph fromMap(Map<String, List<GraphInput.Neighbor>> data) {
        List<Vertex> vertices = new ArrayList<>();
        List<Edge> edges = new ArrayList<>();
        Map<String, Vertex> vertexMap = new HashMap<>();

        // Création des sommets
        for (String name : data.keySet()) {
            Vertex v = new Vertex(name);
            vertices.add(v);
            vertexMap.put(name, v);
        }

        // Création des arêtes
        for (var entry : data.entrySet()) {
            Vertex source = vertexMap.get(entry.getKey());
            for (GraphInput.Neighbor neighbor : entry.getValue()) {
                Vertex target = vertexMap.get(neighbor.getTarget());
                int distance = neighbor.getDistance();
                edges.add(new Edge(source, target, distance));
            }
        }

        // Construction de la liste d’adjacence
        Map<Vertex, List<Edge>> adjacencyList = new HashMap<>();
        for (Edge e : edges) {
            adjacencyList.computeIfAbsent(e.getSource(), k -> new ArrayList<>()).add(e);
            adjacencyList.computeIfAbsent(e.getTarget(), k -> new ArrayList<>()).add(e);
        }

        return new Graph(vertices.toArray(new Vertex[0]), edges.toArray(new Edge[0]), adjacencyList);
    }
}


