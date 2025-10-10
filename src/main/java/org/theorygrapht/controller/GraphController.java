package org.theorygrapht.controller;

import org.springframework.web.bind.annotation.*;

@RestController
public class GraphController {

    @GetMapping("/hello")
    public String hello() {
        return "Bienvenue sur mon API Spring Boot !";
    }



}
