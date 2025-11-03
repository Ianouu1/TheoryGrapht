package org.theorygrapht.service;

import org.theorygrapht.model.Edge;
import org.theorygrapht.model.Graph;
import org.theorygrapht.model.Vertex;

import java.util.*;

import static org.theorygrapht.util.GraphUtils.searchVertex;

/**
 * Parcours en largeur (BFS).
 *
 * Version simple qui parcourt le graphe couche par couche
 * et construit un arbre de parcours.
 */
public class BFS {
    /**
     * Calcule l'arbre de BFS sous forme d'une liste d'arêtes de parcours,
     * orientées du sommet déjà connu vers le nouveau sommet découvert.
     *
     * @param graph              graphe d'entrée
     * @param startingVertexName nom du sommet de départ
     * @return liste des arêtes qui forment l'arbre de BFS
     */
    public static List<Edge> getBFS(Graph graph, String startingVertexName) {
        Vertex[] vertices = graph.getVertices();
        Vertex start = searchVertex(vertices, startingVertexName);

        Set<Vertex> visited = new HashSet<>();
        Queue<Vertex> queue = new LinkedList<>();
        List<Edge> traversalEdges = new ArrayList<>();

        visited.add(start);
        queue.add(start);

        while (!queue.isEmpty()) {
            Vertex current = queue.poll();

            for (Edge edge : graph.getAdjacencyList().get(current)) {
                Vertex neighbor = edge.getSource().equals(current)
                        ? edge.getTarget()
                        : edge.getSource();

                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    queue.add(neighbor);
                    traversalEdges.add(new Edge(current, neighbor, edge.getWeight()));
                }
            }
        }

        return traversalEdges;
    }
}
