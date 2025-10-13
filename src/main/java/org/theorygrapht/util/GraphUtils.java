package org.theorygrapht.util;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.theorygrapht.model.Edge;
import org.theorygrapht.model.Graph;
import org.theorygrapht.model.Vertex;

import java.io.InputStream;
import java.util.ArrayList;
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
                    String name = (String) n.get("ville");
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
                    String to = (String) nb.get("ville");
                    int dist = ((Number) nb.get("distance")).intValue();
                    Vertex vt = map.get(to);
                    edges.add(new Edge(vf, vt, dist));
                }
            }

            return new Graph(vertices.toArray(new Vertex[0]), edges.toArray(new Edge[0]));

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
}


