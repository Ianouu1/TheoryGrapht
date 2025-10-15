package org.theorygrapht;

import org.theorygrapht.model.Edge;
import org.theorygrapht.model.Graph;
import org.theorygrapht.model.Vertex;
import org.theorygrapht.util.DummyGraph;

import java.util.List;
import java.util.Map;

import static org.theorygrapht.service.BFS.getBFS;
import static org.theorygrapht.service.DFS.getDFS;
import static org.theorygrapht.service.Kruskal.getKruskal;
import static org.theorygrapht.service.Prim.getPrim;
import static org.theorygrapht.service.Dijkstra.getDijkstra;
import static org.theorygrapht.service.Dijkstra.getDijkstraFinalMatrix;
import static org.theorygrapht.service.BellmanFord.getBellmanFord;
import static org.theorygrapht.service.FloydWarshall.getFloydWarshall;



public class MainFlorian {
    public static void main(String[] args) {
        Graph graph = DummyGraph.create();

        System.out.println("Algo de Kruskal :");
        List<Edge> Kruskal = getKruskal(graph);
        System.out.println(Kruskal);
        System.out.println("-----\n");

        System.out.println("Algo de Prim :");
        List<Edge> prim = getPrim(graph, "Paris");
        System.out.println(prim);
        System.out.println("-----\n");

        System.out.println("Algo de Dijkstra :");
        Map<String, Integer> Dijkstra2 = getDijkstraFinalMatrix(graph, "Bordeaux");
        System.out.println(Dijkstra2);
        System.out.println("-----\n");

        System.out.println("Algo de Dijkstra Plus Court Chemin:");
        List<Edge> Djikstra = getDijkstra(graph, "Bordeaux", "Lille");
        System.out.println(Djikstra);
        System.out.println("-----\n");

        System.out.println("Algo de BFS (largeur): <!> On traite ici directement les données sous forme de sommets");
        List<Edge> BFS = getBFS(graph, "Rennes");
        System.out.println(BFS);
        System.out.println("-----\n");

        System.out.println("Algo de DFS (profondeur) : <!> On traite ici directement les données sous forme de sommets");
        List<Edge> DFS = getDFS(graph, "Rennes");
        System.out.println(DFS);
        System.out.println("-----\n");

        System.out.println("Algo de Bellman-Ford :");
        Map<Vertex, Integer> BellmanFord = getBellmanFord(graph,"Bordeaux");
        System.out.println(BellmanFord);
        System.out.println("-----\n");

        System.out.println("Algo de Floyd-Warshall :");
        List<Edge> FloydWarshall = getFloydWarshall(graph, "Grenoble", "Rennes");
        System.out.println(FloydWarshall);
        System.out.println("-----\n");
    }
}
