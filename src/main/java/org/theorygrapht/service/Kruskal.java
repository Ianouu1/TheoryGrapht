package org.theorygrapht.service;

import org.theorygrapht.model.Edge;
import org.theorygrapht.model.Graph;
import org.theorygrapht.model.Vertex;

import java.util.*;

/**
 * Algorithme de Kruskal pour l'arbre couvrant de poids minimal (MST).
 */
public class Kruskal {
    /**
     * Calcule un arbre couvrant minimal avec Kruskal.
     *
     * @param graph graphe non orienté et connexe
     * @return liste d'arêtes qui composent le MST
     */
    public static List<Edge> getKruskal(Graph graph) {
        List<Edge> edges = new ArrayList<>(Arrays.asList(graph.getEdges()));
        edges.sort(Comparator.comparingInt(Edge::getWeight));
        Map<Vertex, Vertex> parent = new HashMap<>();
        for (Vertex v : graph.getVertices()) {
            parent.put(v, v);
        }

        List<Edge> mst = new ArrayList<>();
        for (Edge e : edges) {
            Vertex root1 = find(parent, e.getSource());
            Vertex root2 = find(parent, e.getTarget());
            if (!root1.equals(root2)) {
                mst.add(e);
                parent.put(root1, root2);
            }
        }
        return mst;
    }

    private static Vertex find(Map<Vertex, Vertex> parent, Vertex v) {
        if (!parent.get(v).equals(v)) {
            parent.put(v, find(parent, parent.get(v)));
        }
        return parent.get(v);
    }
}
