package org.theorygrapht.service;

import org.theorygrapht.model.Edge;
import org.theorygrapht.model.Graph;
import org.theorygrapht.model.Vertex;

import java.util.*;

import static org.theorygrapht.util.GraphUtils.searchVertex;

/**
 * Algorithme de Dijkstra (chemins les plus courts avec poids non négatifs).
 */
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
                    pq.remove(neighbor);
                    pq.add(neighbor);
                }
            }
        }

        return new DijkstraResult(dist, prev);
    }

    /**
     * Renvoie un plus court chemin entre deux sommets avec Dijkstra.
     *
     * @param graph     graphe d'entrée
     * @param startName nom du sommet de départ
     * @param endName   nom du sommet d'arrivée
     * @return liste d'arêtes dans l'ordre du chemin (vide si inatteignable)
     */
    public static List<Edge> getDijkstra(Graph graph, String startName, String endName) {
        DijkstraResult res = computeDijkstra(graph, startName);
        Vertex[] vertices = graph.getVertices();
        Edge[] edges = graph.getEdges();

        Vertex end = searchVertex(vertices, endName);
        List<Edge> path = new ArrayList<>();
        Vertex current = end;

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

    /**
     * Donne les distances finales depuis une source.
     *
     * @param graph     graphe d'entrée
     * @param startName nom du sommet de départ
     * @return map sommet -> distance (Integer.MAX_VALUE si inatteignable)
     */
    public static Map<String, Integer> getDijkstraFinalMatrix(Graph graph, String startName) {
        DijkstraResult res = computeDijkstra(graph, startName);

        Map<String, Integer> result = new HashMap<>();
        for (Vertex v : res.dist.keySet()) {
            result.put(v.getName(), res.dist.get(v));
        }
        return result;
    }

    /**
     * Produit une table d'exécution de Dijkstra, itération par itération.
     * Chaque ligne indique le sommet choisi et la meilleure distance connue pour tous les sommets.
     *
     * @param graph     graphe d'entrée
     * @param startName nom du sommet de départ
     * @return liste de lignes (colonnes -> valeurs)
     */
    public static List<Map<String, String>> getDijkstraTable(Graph graph, String startName) {
        Vertex[] vertices = graph.getVertices();
        Edge[] edges = graph.getEdges();
        Vertex start = searchVertex(vertices, startName);

        Map<Vertex, Integer> dist = new HashMap<>();
        Set<Vertex> visited = new HashSet<>();

        for (Vertex v : vertices) dist.put(v, Integer.MAX_VALUE);
        dist.put(start, 0);

        PriorityQueue<Vertex> pq = new PriorityQueue<>(Comparator.comparingInt(dist::get));
        pq.add(start);

        List<Map<String, String>> table = new ArrayList<>();

        while (!pq.isEmpty()) {
            Vertex u = pq.poll();
            if (visited.contains(u)) continue;
            visited.add(u);

            Map<String, String> row = new LinkedHashMap<>();
            row.put("C", u.getName() + ", " + dist.get(u));

            for (Vertex v : vertices) {
                if (v.equals(u)) {
                    row.put(v.getName(), "(" + u.getName() + ", " + dist.get(u) + ")");
                } else if (visited.contains(v)) {
                    row.put(v.getName(), "-");
                } else {
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
