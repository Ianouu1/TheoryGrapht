package org.theorygrapht;

import org.theorygrapht.model.Edge;
import org.theorygrapht.model.Graph;
import org.theorygrapht.model.Vertex;
import org.theorygrapht.service.Prim;
import org.theorygrapht.util.DummyGraph;

import java.util.List;
import java.util.Map;

import static org.theorygrapht.service.BFS.getBFS;
import static org.theorygrapht.service.Kruskal.getKruskal;
import static org.theorygrapht.service.Prim.getPrim;
import static org.theorygrapht.service.Dijkstra.getDijkstra;
import static org.theorygrapht.service.DFS.getDFS;


public class MainFlorian {
    public static void main(String[] args) {
        System.out.println("Algo de Kruskal :");
        Map<String, Object> Kruskal = getKruskal();
        System.out.println(Kruskal);
        System.out.println("-----\n");

        System.out.println("Algo de Prim :");
        Map<String, Object> prim = getPrim("Paris");
        System.out.println(prim);
        System.out.println("-----\n");

        System.out.println("Algo de Dijkstra :");
        List<Edge> Djikstra = getDijkstra("Bordeaux", "Lille");
        System.out.println(Djikstra);
        System.out.println("-----\n");


        System.out.println("Algo de BFS (largeur): <!> On traite ici directement les données sous forme de sommets");
        List<Vertex> BFS = getBFS("Rennes");
        System.out.println(BFS);
        System.out.println("-----\n");

        System.out.println("Algo de DFS (profondeur) : <!> On traite ici directement les données sous forme de sommets");
        List<Vertex> DFS = getDFS("Rennes");
        System.out.println(DFS);
        System.out.println("-----\n");

    }
}
