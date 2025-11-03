package org.theorygrapht.service;

import org.theorygrapht.model.Edge;
import org.theorygrapht.model.Graph;
import org.theorygrapht.model.Vertex;

import java.util.*;

public class FloydWarshall {

    public static class FloydResult {
        public final Map<String, Map<String, Integer>> dist;
        public final Map<String, Map<String, String>> next;
        public final List<String> vertices;

        public FloydResult(Map<String, Map<String, Integer>> dist,
                           Map<String, Map<String, String>> next,
                           List<String> vertices) {
            this.dist = dist;
            this.next = next;
            this.vertices = vertices;
        }
    }

    public static FloydResult getMatrices(Graph graph) {
        Vertex[] vertices = graph.getVertices();
        Edge[] edges = graph.getEdges();

        // Vertex order
        List<String> order = new ArrayList<>();
        for (Vertex v : vertices) order.add(v.getName());

        Map<String, Map<String, Integer>> dist = new LinkedHashMap<>();
        Map<String, Map<String, String>> next = new LinkedHashMap<>();

        // Init matrices
        for (String u : order) {
            Map<String, Integer> distRow = new LinkedHashMap<>();
            Map<String, String> nextRow = new LinkedHashMap<>();
            for (String v : order) {
                distRow.put(v, u.equals(v) ? 0 : Integer.MAX_VALUE);
                nextRow.put(v, null);
            }
            dist.put(u, distRow);
            next.put(u, nextRow);
        }

        for (Edge e : edges) {
            String u = e.getSource().getName();
            String v = e.getTarget().getName();
            int w = e.getWeight();
            dist.get(u).put(v, w);
            next.get(u).put(v, v);
        }

        // Core FW
        for (String k : order) {
            for (String i : order) {
                for (String j : order) {
                    int dik = dist.get(i).get(k);
                    int dkj = dist.get(k).get(j);
                    int dij = dist.get(i).get(j);

                    if (dik != Integer.MAX_VALUE && dkj != Integer.MAX_VALUE &&
                            dik + dkj < dij) {
                        dist.get(i).put(j, dik + dkj);
                        next.get(i).put(j, next.get(i).get(k));
                    }
                }
            }
        }

        return new FloydResult(dist, next, order);
    }


    public static List<Edge> getFloydWarshall(Graph graph, String startName, String endName) {
        FloydResult result = getMatrices(graph);
        Map<String, Map<String, String>> next = result.next;
        Edge[] edges = graph.getEdges();

        if (next.get(startName).get(endName) == null) return Collections.emptyList();

        List<Edge> pathEdges = new ArrayList<>();
        String current = startName;

        while (!current.equals(endName)) {
            String nxt = next.get(current).get(endName);
            if (nxt == null) break;

            for (Edge e : edges) {
                if (e.getSource().getName().equals(current) && e.getTarget().getName().equals(nxt)) {
                    pathEdges.add(e);
                    break;
                }
            }

            current = nxt;
        }

        return pathEdges;
    }
}
