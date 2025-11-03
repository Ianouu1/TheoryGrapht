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
        private String target;
        private int distance;

        public String getTarget() {
            return target;
        }

        public void setTarget(String target) {
            this.target = target;
        }

        public int getDistance() {
            return distance;
        }

        public void setDistance(int distance) {
            this.distance = distance;
        }
    }
}
