package org.theorygrapht;

import org.theorygrapht.model.Graph;
import org.theorygrapht.util.DummyGraph;

import java.util.List;
import java.util.Map;

import static org.theorygrapht.service.Dijkstra.getDijkstraFinalMatrix;
import static org.theorygrapht.service.Dijkstra.getDijkstraTable;

public class MainYannis {

    public static void main(String[] args) {
        // Créer le graphe avec DummyGraph
        Graph graph = DummyGraph.create();
        System.out.println("Graphe créé avec succès !");

        System.out.println("Algo de Dijkstra :");
        List<Map<String, String>> Dijkstra2 = getDijkstraTable(graph, "Bordeaux");
        for (Map<String, String> map : Dijkstra2) {
            System.out.println(map);
        }
        System.out.println("-----\n");

        System.out.println(getDijkstraFinalMatrix(graph, "Bordeaux"));

    }
}
