package org.theorygrapht.controller;
import org.springframework.web.bind.annotation.*;

import org.theorygrapht.model.Edge;
import org.theorygrapht.model.Graph;
import org.theorygrapht.model.GraphInput;
import org.theorygrapht.util.GraphUtils;

import java.util.List;
import java.util.Map;

import static org.theorygrapht.service.BFS.getBFS;
import static org.theorygrapht.service.BellmanFord.getBellmanFordPath;
import static org.theorygrapht.service.BellmanFord.getBellmanFordTable;
import org.theorygrapht.model.BelmanFordTableLine;
import static org.theorygrapht.service.DFS.getDFS;
import static org.theorygrapht.service.Dijkstra.getDijkstra;
import static org.theorygrapht.service.FloydWarshall.getFloydWarshall;
import static org.theorygrapht.service.FloydWarshall.getMatrices;
import org.theorygrapht.service.FloydWarshall.FloydResult;
import static org.theorygrapht.service.Kruskal.getKruskal;
import static org.theorygrapht.service.Prim.getPrim;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class GraphController {

    @GetMapping("/hello")
    public String hello() {
        return "Bienvenue sur mon API Spring Boot !";
    }

    @PostMapping("/prim")
    public List<Edge> prim(@RequestBody Map<String, List<GraphInput.Neighbor>> graphJson,
                           @RequestParam String startingVertexName) {
        Graph graph = GraphUtils.fromMap(graphJson);
        return getPrim(graph, startingVertexName);
    }

    @PostMapping("/kruskal")
    public List<Edge> kruskal(@RequestBody Map<String, List<GraphInput.Neighbor>> graphJson) {
        Graph graph = GraphUtils.fromMap(graphJson);
        return getKruskal(graph);
    }

    @PostMapping("/dijkstra")
    public List<Edge> dijkstra(@RequestBody Map<String, List<GraphInput.Neighbor>> graphJson,
                               @RequestParam String start,
                               @RequestParam String end) {
        Graph graph = GraphUtils.fromMap(graphJson);
        return getDijkstra(graph, start, end);
    }

    @PostMapping("/bfs")
    public List<Edge> bfs(@RequestBody Map<String, List<GraphInput.Neighbor>> graphJson,
                          @RequestParam String startingVertexName) {
        Graph graph = GraphUtils.fromMap(graphJson);
        return getBFS(graph, startingVertexName);
    }

    @PostMapping("/dfs")
    public List<Edge> dfs(@RequestBody Map<String, List<GraphInput.Neighbor>> graphJson,
                          @RequestParam String startingVertexName) {
        Graph graph = GraphUtils.fromMap(graphJson);
        return getDFS(graph, startingVertexName);
    }

    @PostMapping("/floydWarshall")
    public List<Edge> FloydWarshall(@RequestBody Map<String, List<GraphInput.Neighbor>> graphJson,
                                    @RequestParam String start,
                                    @RequestParam String end) {
        Graph graph = GraphUtils.fromMap(graphJson);
        return getFloydWarshall(graph, start, end);
    }

    @PostMapping("/floydWarshall/matrices")
    public FloydResult floydWarshallMatrices(@RequestBody Map<String, List<GraphInput.Neighbor>> graphJson) {
        Graph graph = GraphUtils.fromMap(graphJson);
        return getMatrices(graph);
    }

    @PostMapping("/bellmanFord")
    public List<Edge> bellmanFord(@RequestBody Map<String, List<GraphInput.Neighbor>> graphJson,
                                  @RequestParam String start) {
        Graph graph = GraphUtils.fromMap(graphJson);
        return getBellmanFordPath(graph, start);
    }

    @PostMapping("/bellmanFord/table")
    public List<BelmanFordTableLine> bellmanFordTable(
            @RequestBody Map<String, List<GraphInput.Neighbor>> graphJson,
            @RequestParam String start) {
        Graph graph = GraphUtils.fromMap(graphJson);
        return getBellmanFordTable(graph, start);
    }
}
