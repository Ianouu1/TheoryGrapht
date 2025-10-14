package org.theorygrapht.controller;

import org.springframework.web.bind.annotation.*;

import org.theorygrapht.model.Edge;
import org.theorygrapht.model.Graph;
import org.theorygrapht.model.GraphInput;
import org.theorygrapht.model.Vertex;
import org.theorygrapht.util.GraphUtils;

import java.util.List;
import java.util.Map;

import static org.theorygrapht.service.BFS.getBFS;
import static org.theorygrapht.service.DFS.getDFS;
import static org.theorygrapht.service.Dijkstra.getDijkstra;
import static org.theorygrapht.service.Kruskal.getKruskal;
import static org.theorygrapht.service.Prim.getPrim;

@RestController
public class GraphController {

    @GetMapping("/hello")
    public String hello() {
        return "Bienvenue sur mon API Spring Boot !";
    }

    @PostMapping("/prim")
    public Map<String, Object> prim(@RequestBody(required = false) Map<String, List<GraphInput.Neighbor>> graphJson,
                                    @RequestParam String startingVertexName) {
        Graph graph = GraphUtils.fromMap(graphJson);
        return getPrim(graph, startingVertexName);
    }

    @PostMapping("/kruskal")
    public Map<String, Object> kruskal(@RequestBody(required = false) Map<String, List<GraphInput.Neighbor>> graphJson) {
        Graph graph = GraphUtils.fromMap(graphJson);
        return getKruskal(graph);
    }

    @PostMapping("/dijkstra")
    public List<Edge> dijkstra(@RequestBody(required = false) Map<String, List<GraphInput.Neighbor>> graphJson,
                               @RequestParam String start,
                               @RequestParam String end) {
        Graph graph = GraphUtils.fromMap(graphJson);
        return getDijkstra(graph, start, end);
    }

    @PostMapping("/bfs")
    public List<Vertex> bfs(@RequestBody(required = false) Map<String, List<GraphInput.Neighbor>> graphJson,
                            @RequestParam String startingVertexName) {
        Graph graph = GraphUtils.fromMap(graphJson);
        return getBFS(graph, startingVertexName);
    }

    @PostMapping("/dfs")
    public List<Vertex> dfs(@RequestBody(required = false) Map<String, List<GraphInput.Neighbor>> graphJson,
                            @RequestParam String startingVertexName) {
        Graph graph = GraphUtils.fromMap(graphJson);
        return getDFS(graph, startingVertexName);
    }
}
