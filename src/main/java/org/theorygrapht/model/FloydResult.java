package org.theorygrapht.model;

import java.util.List;
import java.util.Map;

public class FloydResult {
    public final Map<String, Map<String, Integer>> dist;
    public final Map<String, Map<String, String>> next;
    public final List<String> vertices;

    public FloydResult(
            Map<String, Map<String, Integer>> dist,
            Map<String, Map<String, String>> next,
            List<String> vertices
    ) {
        this.dist = dist;
        this.next = next;
        this.vertices = vertices;
    }
}
