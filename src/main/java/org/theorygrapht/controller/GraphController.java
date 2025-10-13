package org.theorygrapht.controller;

import org.springframework.web.bind.annotation.*;

import org.theorygrapht.model.Edge;

import java.util.List;

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
    public List<Edge> prim(@RequestParam String startingVertexName) { // todo Voir pour injecter un json de graph plus tard
        return getPrim(startingVertexName);
    }

    @PostMapping("/kruskal")
    public List<Edge> kruskal() {
        return getKruskal();
    }

    @PostMapping("/dijkstra")
    public List<Edge> dijkstra(@RequestParam String start, @RequestParam String end) {
        return getDijkstra(start,end);
    }
}
