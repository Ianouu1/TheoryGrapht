package org.theorygrapht.service;

import org.theorygrapht.model.Edge;
import org.theorygrapht.model.Graph;
import org.theorygrapht.model.Vertex;
import org.theorygrapht.util.DummyGraph;

import java.util.*;

import static org.theorygrapht.util.GraphUtils.searchVertex;

public class Dijkstra {

    public static List<Edge> getDijkstra(Graph graph, String startingVertexName, String endingVertexName) {
        Vertex[] vertices = graph.getVertices();
        Edge[] edges = graph.getEdges();

        Vertex start = searchVertex(vertices, startingVertexName);
        Vertex end = searchVertex(vertices, endingVertexName);

        // Initialization
        Map<Vertex, Integer> dist = new HashMap<>();
        Map<Vertex, Vertex> prev = new HashMap<>();
        for (Vertex v : vertices) {
            dist.put(v, Integer.MAX_VALUE);
        }
        dist.put(start, 0);

        PriorityQueue<Vertex> pq = new PriorityQueue<>(Comparator.comparingInt(dist::get));
        pq.add(start);

        // Main loop
        while (!pq.isEmpty()) {
            Vertex u = pq.poll();

            // Stop early if destination is reached
            if (u.equals(end)) break;

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

        // Reconstruct shortest path from starting vertice to ending vertice
        List<Edge> shortestPathEdges = new ArrayList<>();
        Vertex current = end;

        while (prev.containsKey(current)) {
            Vertex predecessor = prev.get(current);
            for (Edge e : edges) {
                if ((e.getSource().equals(predecessor) && e.getTarget().equals(current)) ||
                        (e.getSource().equals(current) && e.getTarget().equals(predecessor))) {
                    shortestPathEdges.add(e);
                    break;
                }
            }
            current = predecessor;
        }

        // Reverse the path to start from the source
        Collections.reverse(shortestPathEdges);
        return shortestPathEdges;
    }
}
