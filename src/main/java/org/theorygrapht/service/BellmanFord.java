package org.theorygrapht.service;

import org.theorygrapht.model.Edge;
import org.theorygrapht.model.Graph;
import org.theorygrapht.model.Vertex;

import java.util.*;

import static org.theorygrapht.util.GraphUtils.searchVertex;
import org.theorygrapht.model.BelmanFordTableLine;

public class BellmanFord {

    public static List<BelmanFordTableLine> getBellmanFordTable(Graph graph, String startingVertexName) {
        Vertex[] vertices = graph.getVertices();
        Edge[] edges = graph.getEdges();

        Vertex start = searchVertex(vertices, startingVertexName);

        Map<Vertex, Integer> dist = new HashMap<>();
        Map<Vertex, Vertex> pred = new HashMap<>();
        for (Vertex v : vertices) {
            dist.put(v, Integer.MAX_VALUE);
            pred.put(v, null);
        }
        dist.put(start, 0);

        // SPFA-like variant with a processing queue L
        Deque<Vertex> queue = new ArrayDeque<>();
        Map<Vertex, Boolean> inQueue = new HashMap<>();
        for (Vertex v : vertices) inQueue.put(v, false);
        queue.add(start);
        inQueue.put(start, true);

        List<BelmanFordTableLine> steps = new ArrayList<>();

        while (!queue.isEmpty()) {
            // Snapshot BEFORE relaxing the chosen vertex (matches the screenshot logic)
            List<String> listSnapshot = new ArrayList<>();
            for (Vertex vv : queue) listSnapshot.add(vv.getName());
            Vertex t = queue.peekFirst();
            Integer choiceDist = dist.get(t) == Integer.MAX_VALUE ? null : dist.get(t);
            steps.add(snapshot(vertices, dist, pred, listSnapshot, t.getName(), choiceDist));

            // Pop and relax
            t = queue.pollFirst();
            inQueue.put(t, false);
            for (Edge e : edges) {
                if (!e.getSource().equals(t)) continue; // only outgoing edges
                Vertex u = t;
                Vertex v = e.getTarget();
                int w = e.getWeight();
                if (dist.get(u) != Integer.MAX_VALUE && dist.get(u) + w < dist.get(v)) {
                    dist.put(v, dist.get(u) + w);
                    pred.put(v, u);
                    if (!inQueue.get(v)) {
                        queue.addLast(v);
                        inQueue.put(v, true);
                    }
                }
            }
        }

        // Final row when queue is empty, with distances AFTER last relaxation
    steps.add(snapshot(vertices, dist, pred, Collections.emptyList(), null, null));

        return steps;
    }

    private static BelmanFordTableLine snapshot(Vertex[] vertices,
                                                Map<Vertex, Integer> dist,
                                                Map<Vertex, Vertex> pred,
                                                List<String> list,
                                                String choiceName,
                                                Integer choiceDistance) {
        Map<String, String> row = new LinkedHashMap<>();
        // Keep a stable order using the current array order
        for (Vertex v : vertices) {
            Integer d = dist.get(v);
            String out = (d == null || d == Integer.MAX_VALUE) ? "∞" : String.valueOf(d);
            String p = pred.get(v) == null ? "*" : pred.get(v).getName();
            row.put(v.getName(), "(" + out + ", " + p + ")");
        }
        return new BelmanFordTableLine(row, list, choiceName, choiceDistance);
    }

    public static List<Edge> getBellmanFordPath(Graph graph, String startName) {

        Vertex[] vertices = graph.getVertices();
        Edge[] edges = graph.getEdges();

        Vertex s = searchVertex(vertices, startName);

        // Initialisations
        Map<Vertex, Integer> dist = new HashMap<>();
        Map<Vertex, Vertex> pere = new HashMap<>();

        for (Vertex v : vertices) {
            dist.put(v, Integer.MAX_VALUE);
            pere.put(v, null);
        }

        dist.put(s, 0);
        Set<Vertex> L = new HashSet<>();
        L.add(s);

    // Boucle principale : tant que L != Ø (directed)

        while (!L.isEmpty()) {

            // Choisir t dans L (on prend n'importe lequel)
            Iterator<Vertex> it = L.iterator();
            Vertex t = it.next();
            it.remove(); // L = L - {t}

            // Pour tout voisin k de t
            for (Edge e : edges) {
                Vertex u = e.getSource();
                Vertex v = e.getTarget();

                if (u.equals(t)) {
                    // relax outgoing edge t -> v
                    relax(u, v, e.getWeight(), dist, pere, L);
                }
            }
        }

        // Reconstruction du chemin : liste d'arêtes
        List<Edge> result = new ArrayList<>();

        for (Vertex v : vertices) {
            if (v.equals(s)) continue;
            if (pere.get(v) == null) continue;

            Vertex cur = v;
            List<Edge> tmp = new ArrayList<>();

            while (pere.get(cur) != null) {
                Vertex p = pere.get(cur);
                for (Edge e : edges) {
                    if (e.getSource().equals(p) && e.getTarget().equals(cur)) {
                        tmp.add(e);
                        break;
                    }
                }
                cur = p;
            }

            Collections.reverse(tmp);
            result.addAll(tmp);
        }

        return result;
    }

    // Relaxation + ajout à L
    private static void relax(Vertex t, Vertex k, int w,
                              Map<Vertex, Integer> dist,
                              Map<Vertex, Vertex> pere,
                              Set<Vertex> L) {

        if (dist.get(t) != Integer.MAX_VALUE && dist.get(k) > dist.get(t) + w) {
            dist.put(k, dist.get(t) + w);
            pere.put(k, t);
            L.add(k);
        }
    }

}
