package org.theorygrapht.service;

import org.theorygrapht.model.Edge;
import org.theorygrapht.model.Graph;
import org.theorygrapht.model.Vertex;

import java.util.*;

import static org.theorygrapht.util.GraphUtils.searchVertex;

/**
 * Parcours en profondeur (DFS) en version itérative.
 */
public class DFS {

    /**
     * Calcule un arbre de DFS sous forme d'arêtes de parcours,
     * orientées du sommet courant vers le voisin découvert.
     * On utilise une pile et un index par sommet pour vraiment plonger
     * jusqu'au bout avant de revenir en arrière.
     *
     * @param graph              graphe d'entrée
     * @param startingVertexName nom du sommet de départ
     * @return liste d'arêtes représentant l'arbre de DFS
     */
    public static List<Edge> getDFS(Graph graph, String startingVertexName) {
        Vertex[] vertices = graph.getVertices();
        Vertex start = searchVertex(vertices, startingVertexName);
        if (start == null) return Collections.emptyList();

        Set<Vertex> visited = new HashSet<>();
        Deque<Vertex> stack = new ArrayDeque<>();
        List<Edge> traversalEdges = new ArrayList<>();
        Map<Vertex, Integer> nextIndex = new HashMap<>();

        visited.add(start);
        stack.push(start);
        nextIndex.put(start, 0);

        while (!stack.isEmpty()) {
            Vertex current = stack.peek();

            List<Edge> edges = graph.getAdjacencyList().getOrDefault(current, Collections.emptyList());
            int i = nextIndex.getOrDefault(current, 0);
            boolean dived = false;

            for (; i < edges.size(); i++) {
                Edge edge = edges.get(i);
                Vertex neighbor = edge.getSource().equals(current) ? edge.getTarget() : edge.getSource();

                if (!visited.contains(neighbor)) {
                    nextIndex.put(current, i + 1);

                    visited.add(neighbor);
                    traversalEdges.add(new Edge(current, neighbor, edge.getWeight()));

                    stack.push(neighbor);
                    nextIndex.put(neighbor, 0);
                    dived = true;
                    break;
                }
            }

            if (!dived) {
                stack.pop();
            }
        }

        return traversalEdges;
    }
}
