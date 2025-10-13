package org.theorygrapht;

import org.theorygrapht.model.Edge;
import org.theorygrapht.model.Graph;
import org.theorygrapht.service.Kruskal;
import org.theorygrapht.service.Dijkstra;
import org.theorygrapht.util.DummyGraph;

import java.util.Arrays;
import java.util.List;

public class MainYannis {

    public static void main(String[] args) {
        // Créer le graphe avec DummyGraph
        Graph graph = DummyGraph.create();
        System.out.println("Graphe créé avec succès !");

        // Exécuter Kruskal
//        List<Edge> mst = Kruskal.getKruskal();
//        System.out.println(mst);
//        System.out.println("Résultat de l'algorithme de Kruskal :");
//        Arrays.stream(mst).forEach(System.out::println);
//
//        int totalDistance = Arrays.stream(mst)
//                .mapToInt(s -> {
//                    String[] parts = s.split(": ");
//                    return Integer.parseInt(parts[1]);
//                })
//                .sum();
//        System.out.println("Distance totale Kruskal : " + totalDistance);

        // --------------------------
        // Exécuter Dijkstra
        // --------------------------
//        String[] distances = Dijkstra.getDijkstra();
//        System.out.println("\nRésultat de l'algorithme de Dijkstra (depuis le premier sommet) :");
//        Arrays.stream(distances).forEach(System.out::println);
    }
}
