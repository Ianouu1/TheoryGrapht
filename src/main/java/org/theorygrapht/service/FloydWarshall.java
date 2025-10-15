package org.theorygrapht.service;

import org.theorygrapht.model.Edge;
import org.theorygrapht.model.Graph;
import org.theorygrapht.model.Vertex;

import java.util.*;

public class FloydWarshall {

    private static class FloydResult {
        Map<String, Map<String, Integer>> dist;
        Map<String, Map<String, String>> next;

        FloydResult(Map<String, Map<String, Integer>> dist, Map<String, Map<String, String>> next) {
            this.dist = dist;
            this.next = next;
        }
    }

    private static FloydResult compute(Graph graph) {
        Vertex[] vertices = graph.getVertices();
        Edge[] edges = graph.getEdges();

        Map<String, Map<String, Integer>> dist = new HashMap<>();
        Map<String, Map<String, String>> next = new HashMap<>();

        // Initialize matrices
        for (Vertex u : vertices) {
            Map<String, Integer> distRow = new HashMap<>();
            Map<String, String> nextRow = new HashMap<>();
            for (Vertex v : vertices) {
                distRow.put(v.getName(), u.equals(v) ? 0 : Integer.MAX_VALUE);
                nextRow.put(v.getName(), null);
            }
            dist.put(u.getName(), distRow);
            next.put(u.getName(), nextRow);
        }

        // Initialize edges (undirected)
        for (Edge e : edges) {
            String u = e.getSource().getName();
            String v = e.getTarget().getName();
            int w = e.getWeight();
            dist.get(u).put(v, w);
            dist.get(v).put(u, w);
            next.get(u).put(v, v);
            next.get(v).put(u, u);
        }

        // Core algorithm
        for (Vertex k : vertices) {
            for (Vertex i : vertices) {
                for (Vertex j : vertices) {
                    int distIK = dist.get(i.getName()).get(k.getName());
                    int distKJ = dist.get(k.getName()).get(j.getName());
                    int distIJ = dist.get(i.getName()).get(j.getName());

                    if (distIK != Integer.MAX_VALUE && distKJ != Integer.MAX_VALUE &&
                            distIK + distKJ < distIJ) {
                        dist.get(i.getName()).put(j.getName(), distIK + distKJ);
                        next.get(i.getName()).put(j.getName(), next.get(i.getName()).get(k.getName()));
                    }
                }
            }
        }

        return new FloydResult(dist, next);
    }

    public static Map<String, Map<String, Integer>> getDistanceMatrix(Graph graph) {
        return compute(graph).dist;
    }

    public static List<Edge> getFloydWarshall(Graph graph, String startName, String endName) {
        FloydResult result = compute(graph);
        Map<String, Map<String, String>> next = result.next;
        Edge[] edges = graph.getEdges();

        if (next.get(startName).get(endName) == null) return Collections.emptyList();

        List<Edge> pathEdges = new ArrayList<>();
        String current = startName;

        while (!current.equals(endName)) {
            String nextVertex = next.get(current).get(endName);
            if (nextVertex == null) break;

            for (Edge e : edges) {
                if ((e.getSource().getName().equals(current) && e.getTarget().getName().equals(nextVertex)) ||
                        (e.getSource().getName().equals(nextVertex) && e.getTarget().getName().equals(current))) {
                    pathEdges.add(e);
                    break;
                }
            }
            current = nextVertex;
        }

        return pathEdges;
    }
}
