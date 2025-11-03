package org.theorygrapht.service;

import org.theorygrapht.model.Edge;
import org.theorygrapht.model.Graph;
import org.theorygrapht.model.Vertex;

import java.util.*;

import static org.theorygrapht.util.GraphUtils.searchVertex;

public class DFS {

    public static List<Edge> getDFS(Graph graph, String startingVertexName) {
        Vertex[] vertices = graph.getVertices();
        Vertex start = searchVertex(vertices, startingVertexName);
        if (start == null) return Collections.emptyList(); // sécurité

        Set<Vertex> visited = new HashSet<>();
        Deque<Vertex> stack = new ArrayDeque<>();
        List<Edge> traversalEdges = new ArrayList<>();
        // mémorise l'index du prochain voisin à explorer pour chaque sommet
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
                    // on reprendra à l'index suivant quand on reviendra sur "current"
                    nextIndex.put(current, i + 1);

                    visited.add(neighbor);
                    // crée une arête orientée current -> neighbor pour le parcours
                    traversalEdges.add(new Edge(current, neighbor, edge.getWeight()));

                    stack.push(neighbor);
                    nextIndex.put(neighbor, 0);
                    dived = true;
                    break;
                }
            }

            if (!dived) {
                // plus de voisins à explorer depuis "current" => on remonte
                stack.pop();
            }
        }

        return traversalEdges;
    }
}
