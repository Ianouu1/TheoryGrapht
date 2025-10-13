package org.theorygrapht.util;

import org.theorygrapht.model.Graph;

public class DummyGraph {
    public static Graph create() {
        return GraphUtils.loadJson("graph.json");
    }

}
