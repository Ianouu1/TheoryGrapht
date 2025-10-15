package org.theorygrapht.service;

import org.theorygrapht.model.Edge;
import org.theorygrapht.model.Graph;
import org.theorygrapht.model.Vertex;

import java.util.*;

import static org.theorygrapht.util.GraphUtils.searchVertex;

public class Dijkstra {

    private static class DijkstraResult {
        Map<Vertex, Integer> dist;
        Map<Vertex, Vertex> prev;

        DijkstraResult(Map<Vertex, Integer> dist, Map<Vertex, Vertex> prev) {
            this.dist = dist;
            this.prev = prev;
        }
    }

    private static DijkstraResult computeDijkstra(Graph graph, String startName) {
        Vertex[] vertices = graph.getVertices();
        Edge[] edges = graph.getEdges();
        Vertex start = searchVertex(vertices, startName);

        Map<Vertex, Integer> dist = new HashMap<>();
        Map<Vertex, Vertex> prev = new HashMap<>();

        // Initialize all distances to infinity
        for (Vertex v : vertices) dist.put(v, Integer.MAX_VALUE);
        dist.put(start, 0);

        PriorityQueue<Vertex> pq = new PriorityQueue<>(Comparator.comparingInt(dist::get));
        pq.add(start);

        while (!pq.isEmpty()) {
            Vertex u = pq.poll();

            for (Edge e : edges) {
                Vertex neighbor = null;
                if (e.getSource().equals(u)) neighbor = e.getTarget();
                else if (e.getTarget().equals(u)) neighbor = e.getSource();
                else continue;

                int alt = dist.get(u) + e.getWeight();
                if (alt < dist.get(neighbor)) {
                    dist.put(neighbor, alt);
                    prev.put(neighbor, u);
                    pq.remove(neighbor); // refresh priority
                    pq.add(neighbor);
                }
            }
        }

        return new DijkstraResult(dist, prev);
    }

    public static List<Edge> getDijkstra(Graph graph, String startName, String endName) {
        DijkstraResult res = computeDijkstra(graph, startName);
        Vertex[] vertices = graph.getVertices();
        Edge[] edges = graph.getEdges();

        Vertex end = searchVertex(vertices, endName);
        List<Edge> path = new ArrayList<>();
        Vertex current = end;

        // Reconstruct path using predecessors
        while (res.prev.containsKey(current)) {
            Vertex predecessor = res.prev.get(current);
            for (Edge e : edges) {
                if ((e.getSource().equals(predecessor) && e.getTarget().equals(current)) ||
                        (e.getSource().equals(current) && e.getTarget().equals(predecessor))) {
                    path.add(e);
                    break;
                }
            }
            current = predecessor;
        }

        Collections.reverse(path);
        return path;
    }

    public static Map<String, Integer> getDijkstraFinalMatrix(Graph graph, String startName) {
        DijkstraResult res = computeDijkstra(graph, startName);

        Map<String, Integer> result = new HashMap<>();
        for (Vertex v : res.dist.keySet()) {
            result.put(v.getName(), res.dist.get(v));
        }
        return result;
    }

    public static List<Map<String, String>> getDijkstraTable(Graph graph, String startName) {
        Vertex[] vertices = graph.getVertices();
        Edge[] edges = graph.getEdges();
        Vertex start = searchVertex(vertices, startName);

        Map<Vertex, Integer> dist = new HashMap<>();
        Set<Vertex> visited = new HashSet<>();

        // Initialize all distances to infinity
        for (Vertex v : vertices) dist.put(v, Integer.MAX_VALUE);
        dist.put(start, 0);

        PriorityQueue<Vertex> pq = new PriorityQueue<>(Comparator.comparingInt(dist::get));
        pq.add(start);

        // Each element of the list will represent one iteration of Dijkstra
        List<Map<String, String>> table = new ArrayList<>();

        while (!pq.isEmpty()) {
            Vertex u = pq.poll();
            if (visited.contains(u)) continue;
            visited.add(u);

            Map<String, String> row = new LinkedHashMap<>();
            row.put("C", u.getName() + ", " + dist.get(u)); // Column "C"

            // For each vertex, store either "inf" or "(predecessor, cost)"
            for (Vertex v : vertices) {
                if (v.equals(u)) {
                    row.put(v.getName(), "(" + u.getName() + ", " + dist.get(u) + ")");
                } else if (visited.contains(v)) {
                    row.put(v.getName(), "-");
                } else {
                    // Try to find if a better path exists
                    int oldDist = dist.get(v);
                    for (Edge e : edges) {
                        if ((e.getSource().equals(u) && e.getTarget().equals(v)) ||
                                (e.getTarget().equals(u) && e.getSource().equals(v))) {
                            int alt = dist.get(u) + e.getWeight();
                            if (alt < oldDist) {
                                dist.put(v, alt);
                                oldDist = alt;
                            }
                        }
                    }
                    row.put(v.getName(), oldDist == Integer.MAX_VALUE ? "inf" : "(" + u.getName() + ", " + oldDist + ")");
                }
            }
            table.add(row);

            // Add neighbors to queue
            for (Edge e : edges) {
                if (e.getSource().equals(u) && !visited.contains(e.getTarget()))
                    pq.add(e.getTarget());
                else if (e.getTarget().equals(u) && !visited.contains(e.getSource()))
                    pq.add(e.getSource());
            }
        }
        return table;
    }
}
