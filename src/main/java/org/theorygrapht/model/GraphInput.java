package org.theorygrapht.model;

import java.util.List;
import java.util.Map;

public class GraphInput {
    private Map<String, List<Neighbor>> graph;

    public Map<String, List<Neighbor>> getGraph() {
        return graph;
    }

    public void setGraph(Map<String, List<Neighbor>> graph) {
        this.graph = graph;
    }

    public static class Neighbor {
        private String ville;
        private int distance;

        public String getVille() {
            return ville;
        }

        public void setVille(String ville) {
            this.ville = ville;
        }

        public int getDistance() {
            return distance;
        }

        public void setDistance(int distance) {
            this.distance = distance;
        }
    }
}
