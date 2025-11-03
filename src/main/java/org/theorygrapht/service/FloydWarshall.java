package org.theorygrapht.service;

import org.theorygrapht.model.Edge;
import org.theorygrapht.model.FloydResult;
import org.theorygrapht.model.Graph;
import org.theorygrapht.model.Vertex;

import java.util.*;

/**
 * Floyd–Warshall : calcul des plus courts chemins pour toutes les paires de sommets.
 * On renvoie les matrices (distances et "next/père") et on propose aussi
 * une méthode utilitaire pour reconstruire un chemin entre deux sommets.
 */
public class FloydWarshall {

    /**
     * Calcule les matrices de Floyd–Warshall pour un graphe.
     *
     * @param graph graphe d'entrée
     * @return FloydResult avec la matrice des distances, la matrice des "next" et l'ordre stable des sommets
     */
    public static FloydResult getMatrices(Graph graph) {
        Vertex[] vertices = graph.getVertices();
        Edge[] edges = graph.getEdges();

        List<String> order = new ArrayList<>();
        for (Vertex v : vertices) order.add(v.getName());

        Map<String, Map<String, Integer>> dist = new LinkedHashMap<>();
        Map<String, Map<String, String>> next = new LinkedHashMap<>();

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

    /**
     * Reconstruit un plus court chemin entre deux sommets à partir de la matrice "next".
     *
     * @param graph     graphe d'entrée
     * @param startName nom du sommet de départ
     * @param endName   nom du sommet d'arrivée
     * @return liste d'arêtes dans l'ordre du chemin (vide s'il n'y a pas de chemin)
     */
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
