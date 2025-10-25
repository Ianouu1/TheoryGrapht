import React, { useState, useEffect } from "react";
import baseGraph from "./assets/baseGraph.json";
import bellmanFordGraph from "./assets/bellmanFordGraph.json";
import floydWarshallGraph from "./assets/floydWarshallGraph.json";
import Graph from "./components/Graph";
import type { GraphNode, GraphLink } from "./components/Graph";
import {
    graphToAdjacency,
    runKruskal,
    runPrim,
    runDFS,
    runBFS,
    runDijkstra,
    runFloydWarshall,
} from "./apiService";
import AlgorithmPopup from "./components/AlgorithmPopup";
import "./App.css";
import "./styles/_graph.css";
import "./styles/_popup.css";
import "./styles/_toolbar.css";

function adjacencyToNodesLinks(
    graph: Record<string, { ville: string; distance: number }[]>,
    directed = false
) {
    const nodes: GraphNode[] = Object.keys(graph).map((id) => ({ id }));
    const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));
    const links: GraphLink[] = [];
    const added = new Set<string>();

    for (const from in graph) {
        for (const { ville, distance } of graph[from]) {
            const key = directed ? `${from}_${ville}` : [from, ville].sort().join("_");

            if (!added.has(key)) {
                links.push({
                    source: nodeMap[from],
                    target: nodeMap[ville],
                    weight: distance,
                });
                added.add(key);
            }
        }
    }
    return { nodes, links };
}

const App: React.FC = () => {
    const [nodes, setNodes] = useState<GraphNode[]>([]);
    const [links, setLinks] = useState<GraphLink[]>([]);
    const [highlightEdges, setHighlightEdges] = useState<Record<string, string>>({});
    const [edgeList, setEdgeList] = useState<
        { source: string; target: string; weight: number }[]
    >([]);
    const [selectedAlgo, setSelectedAlgo] = useState<string | null>(null);
    const [startNode, setStartNode] = useState("");
    const [endNode, setEndNode] = useState("");
    const [directed, setDirected] = useState(false);

    useEffect(() => {
        const { nodes, links } = adjacencyToNodesLinks(baseGraph);
        setNodes(nodes);
        setLinks(links);
    }, []);

    async function handleSendGraph(algorithm: string, start?: string, end?: string) {
        const adj = graphToAdjacency(nodes, links);
        let result: any;

        switch (algorithm) {
            case "bfs":
                if (!start) return alert("Choisis un sommet de départ");
                result = await runBFS(adj, start);
                break;
            case "dfs":
                if (!start) return alert("Choisis un sommet de départ");
                result = await runDFS(adj, start);
                break;
            case "kruskal":
                result = await runKruskal(adj);
                break;
            case "prim":
                if (!start) return alert("Choisis un sommet de départ");
                result = await runPrim(adj, start);
                break;
            case "dijkstra":
                if (!start || !end) return alert("Choisis deux sommets");
                result = await runDijkstra(adj, start, end);
                break;
            case "floydwarshall":
                if (!start || !end) return alert("Choisis deux sommets");
                result = await runFloydWarshall(adj, start, end);
                break;
            default:
                return;
        }

        if (result && Array.isArray(result)) {
            setHighlightEdges({});
            setEdgeList([]);

            await new Promise((resolve) => setTimeout(resolve, 100));

            const newColors: Record<string, string> = {};
            const edges = result.filter((e: any) => e.source && e.target);

            const list = edges.map((e: any) => ({
                source: e.source.name || e.source,
                target: e.target.name || e.target,
                weight: e.weight || 0,
            }));
            setEdgeList(list);

            edges.forEach((e: any, i: number) => {
                const s = e.source.name || e.source;
                const t = e.target.name || e.target;
                setTimeout(() => {
                    newColors[`${s}_${t}`] = "#ef1e1e";
                    newColors[`${t}_${s}`] = "#ef1e1e";
                    setHighlightEdges((prev) => ({ ...prev, ...newColors }));
                }, i * 400);
            });
        }
    }

    function handleLaunch() {
        if (!selectedAlgo) return;
        switch (selectedAlgo) {
            case "bfs":
            case "dfs":
            case "prim":
                handleSendGraph(selectedAlgo, startNode);
                break;
            case "dijkstra":
                handleSendGraph(selectedAlgo, startNode, endNode);
                break;
            case "kruskal":
                handleSendGraph("kruskal");
                break;
            case "floydwarshall":
                handleSendGraph(selectedAlgo, startNode, endNode);
                break;
        }
    }

    function resetState() {
        setHighlightEdges({});
        setEdgeList([]);
        setStartNode("");
        setEndNode("");
    }

    function handleAlgoSelect(algo: string) {
        resetState();
        setSelectedAlgo(algo);

        let chosenGraph = baseGraph;
        let isDirected = false;

        if (algo === "bellmanford") {
            // @ts-ignore
            chosenGraph = bellmanFordGraph;
            isDirected = true;
        } else if (algo === "floydwarshall") {
            // @ts-ignore
            chosenGraph = floydWarshallGraph;
            isDirected = true;
        }

        const { nodes, links } = adjacencyToNodesLinks(chosenGraph, isDirected);
        setNodes(nodes);
        setLinks(links);
        setDirected(isDirected);
    }

    return (
        <div className="app">
            <header>
                <h1>TheoryGrapht</h1>
                <div className="toolbar group">
                    <label>Algorithmes</label>
                    <button onClick={() => handleAlgoSelect("bfs")}>BFS</button>
                    <button onClick={() => handleAlgoSelect("dfs")}>DFS</button>
                    <button onClick={() => handleAlgoSelect("prim")}>Prim</button>
                    <button onClick={() => handleAlgoSelect("dijkstra")}>Dijkstra</button>
                    <button onClick={() => handleAlgoSelect("kruskal")}>Kruskal</button>
                    <button onClick={() => handleAlgoSelect("floydwarshall")}>Floyd-Warshall</button>
                </div>
            </header>

            <main>
                <div id="stage">
                    <Graph
                        nodes={nodes}
                        links={links}
                        highlightEdges={highlightEdges}
                        directed={directed}
                    />
                </div>

                <aside>
                    <AlgorithmPopup
                        algo={selectedAlgo ?? ""}
                        nodes={nodes}
                        startNode={startNode}
                        endNode={endNode}
                        setStartNode={setStartNode}
                        setEndNode={setEndNode}
                        onLaunch={handleLaunch}
                        onCancel={() => {
                            setSelectedAlgo(null);
                            resetState();
                        }}
                    />

                    <div className="card">
                        <h2>Résultat {edgeList.length > 0 && `(${edgeList.length} arêtes)`}</h2>
                        {edgeList.length === 0 ? (
                            <p className="hint">Aucun résultat pour le moment.</p>
                        ) : (
                            <>
                                <ul className="hint">
                                    {edgeList.map((e, i) => (
                                        <li key={i}>
                                            {e.source} → {e.target} : <b>{e.weight}</b>
                                        </li>
                                    ))}
                                </ul>

                                <hr
                                    style={{
                                        border: "none",
                                        borderTop: "1px solid var(--border)",
                                        margin: "8px 0",
                                    }}
                                />
                                <p className="hint" style={{ fontWeight: "bold" }}>
                                    Total :{" "}
                                    {edgeList.reduce(
                                        (sum, e) => sum + (Number(e.weight) || 0),
                                        0
                                    )}
                                </p>
                            </>
                        )}
                    </div>
                </aside>
            </main>
        </div>
    );
};

export default App;
