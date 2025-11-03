package org.theorygrapht.service;

import org.theorygrapht.model.Edge;
import org.theorygrapht.model.Graph;
import org.theorygrapht.model.Vertex;

import java.util.ArrayList;
import java.util.List;

import static org.theorygrapht.util.GraphUtils.searchVertex;

/**
 * Algorithme de Prim pour l'arbre couvrant de poids minimal (MST).
 */
public class Prim {
    /**
     * Calcule un MST avec Prim en partant d'un sommet donné.
     *
     * @param graph               graphe non orienté et connexe
     * @param startingVertexName  nom du sommet de départ
     * @return liste d'arêtes qui composent le MST
     * @throws IllegalArgumentException si le graphe est déconnecté
     */
    public static List<Edge> getPrim(Graph graph, String startingVertexName) {
        Vertex[] vertices = graph.getVertices();
        Edge[] edges = graph.getEdges();

        Vertex start = searchVertex(vertices, startingVertexName);

        List<Vertex> visitedVertices = new ArrayList<>();
        List<Edge> visitedEdges = new ArrayList<>();

        visitedVertices.add(start);

        while (visitedVertices.size() != vertices.length) {
            Edge closestEdge = null;
            closestEdge = getClosestEdge(edges, visitedVertices, closestEdge);

            if (closestEdge == null) {
                throw new IllegalArgumentException("This is a disconnected graph");
            }
            visitedEdges.add(closestEdge);
            if (!visitedVertices.contains(closestEdge.getTarget())) {
                visitedVertices.add(closestEdge.getTarget());
            }
        }
        return visitedEdges;
    }



    private static Edge getClosestEdge(Edge[] edges, List<Vertex> visited, Edge closestEdge) {
        for (Edge edge : edges) {
            Vertex source = edge.getSource();
            Vertex target = edge.getTarget();

            boolean visitedSource = visited.contains(source);
            boolean visitedTarget = visited.contains(target);

            if (visitedSource && !visitedTarget) {
                if (closestEdge == null || edge.getWeight() < closestEdge.getWeight()) {
                    closestEdge = edge;
                }
            }
        }
        return closestEdge;
    }
}
