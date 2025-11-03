import React, {useState, useEffect} from "react";
import baseGraph from "./assets/baseGraph.json";
import Graph from "./components/Graph";
import DirectedGraph from "./components/DirectedGraph";
import type {GraphNode, GraphLink} from "./components/Graph";
import {
    graphToAdjacency,
    runKruskal,
    runPrim,
    runDFS,
    runBFS,
    runDijkstra,
    runFloydWarshall,
    runBellmanFord,
    runBellmanFordTable,
    type BFStep,
} from "./apiService";
import Toolbar from "./components/Toolbar";
import VertexLauncher from "./components/VertexLauncher.tsx";
import Result from "./components/Result";
import GraphJsonEditor from "./components/GraphJsonEditor";
import "./App.css";
import "./styles/_graph.css";
import "./styles/_popup.css";
import "./styles/_toolbar.css";
import "./styles/_editor.css";

const App: React.FC = () => {
    const [nodes, setNodes] = useState<GraphNode[]>([]);
    const [links, setLinks] = useState<GraphLink[]>([]);
    const [highlightEdges, setHighlightEdges] = useState<Record<string, string>>({});
    const [edgeList, setEdgeList] = useState<
        { source: string; target: string; weight: number }[]
    >([]);
    const [bfTable, setBfTable] = useState<BFStep[] | null>(null);
    const [directed, setDirected] = useState(false);
    const [selectedAlgo, setSelectedAlgo] = useState<string | null>(null);
    const [startNode, setStartNode] = useState("");
    const [endNode, setEndNode] = useState("");

    // Initialiser avec baseGraph au chargement
    useEffect(() => {
        const nodes: GraphNode[] = Object.keys(baseGraph).map((id) => ({id}));
        const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));
        const links: GraphLink[] = [];
        const added = new Set<string>();

        for (const from in baseGraph) {
            for (const {target, distance} of baseGraph[from as keyof typeof baseGraph]) {
                const key = [from, target].sort().join("_");

                if (!added.has(key)) {
                    links.push({
                        source: nodeMap[from],
                        target: nodeMap[target],
                        weight: distance,
                    });
                    added.add(key);
                }
            }
        }
        setNodes(nodes);
        setLinks(links);
    }, []);

    // If user switches away from Bellman-Ford, clear any previous BF table
    useEffect(() => {
        if (selectedAlgo !== "bellmanford" && bfTable) {
            setBfTable(null);
        }
    }, [selectedAlgo]);

    async function handleSendGraph(algorithm: string, start?: string, end?: string) {
        // If we're not running Bellman-Ford, ensure any previous BF table is cleared
        if (algorithm !== "bellmanford") {
            setBfTable(null);
        }
        const adj = graphToAdjacency(nodes, links, directed);
        let result: any;

        try {
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
                case "bellmanford":
                    if (!start) return alert("Choisis un sommet de départ");
                    // For BF, fetch BOTH: edges for visualization and table for the side panel
                    const [bfEdges, bfSteps] = await Promise.all([
                        runBellmanFord(adj, start),
                        runBellmanFordTable(adj, start),
                    ]);

                    // Update table
                    setBfTable(bfSteps as BFStep[]);

                    // Clear previous visuals and do the edge highlight animation
                    setHighlightEdges({});
                    setEdgeList([]); // we don't display an edge list for BF

                    await new Promise((resolve) => setTimeout(resolve, 100));

                    const newColorsBF: Record<string, string> = {};
                    const edgesBF = Array.isArray(bfEdges)
                        ? bfEdges.filter((e: any) => e.source && e.target)
                        : [];
                    edgesBF.forEach((e: any, i: number) => {
                        const s = e.source.name || e.source;
                        const t = e.target.name || e.target;
                        setTimeout(() => {
                            newColorsBF[`${s}_${t}`] = "#ef1e1e";
                            newColorsBF[`${t}_${s}`] = "#ef1e1e";
                            setHighlightEdges((prev) => ({ ...prev, ...newColorsBF }));
                        }, i * 400);
                    });
                    return; // handled fully here
                default:
                    return;
            }

            if (result && Array.isArray(result)) {
                // Clear any BF table when algorithms return edges
                setBfTable(null);
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
                        // Toujours poser les deux sens; chaque composant (orienté vs non orienté)
                        // décide de l'interprétation à l'affichage.
                        newColors[`${s}_${t}`] = "#ef1e1e";
                        newColors[`${t}_${s}`] = "#ef1e1e";
                        setHighlightEdges((prev) => ({...prev, ...newColors}));
                    }, i * 400);
                });
            }
        } catch (error: any) {
            alert(error.message || "Une erreur est survenue lors de l'exécution de l'algorithme");
        }
    }

    function resetState() {
        setHighlightEdges({});
        setEdgeList([]);
        setBfTable(null);
    }

    // Reload graph from edited JSON (already converted to nodes/links by child)
    function handleReloadGraph(newNodes: GraphNode[], newLinks: GraphLink[]) {
        setNodes(newNodes);
        setLinks(newLinks);
        // Clear any ongoing highlights/results when reloading graph
        resetState();
    }

    function handleLaunch() {
        if (!selectedAlgo) return;
        switch (selectedAlgo) {
            case "bfs":
            case "dfs":
            case "prim":
            case "bellmanford":
                handleSendGraph(selectedAlgo, startNode);
                break;
            case "dijkstra":
            case "floydwarshall":
                handleSendGraph(selectedAlgo, startNode, endNode);
                break;
            case "kruskal":
                handleSendGraph("kruskal");
                break;
        }
    }

    function handleCancel() {
        setSelectedAlgo(null);
        setStartNode("");
        setEndNode("");
        resetState();
    }

    // @ts-ignore
    return (
        <div className="app">
            <Toolbar
                setNodes={setNodes}
                setLinks={setLinks}
                setDirected={setDirected}
                onReset={resetState}
                setSelectedAlgo={setSelectedAlgo}
                setStartNode={setStartNode}
                setEndNode={setEndNode}
            />

            <main>
                <div id="stage">
                    {directed ? (
                        <DirectedGraph
                            nodes={nodes}
                            links={links}
                            highlightEdges={highlightEdges}
                        />
                    ) : (
                        <Graph
                            nodes={nodes}
                            links={links}
                            highlightEdges={highlightEdges}
                        />
                    )}
                </div>

                <aside>
                    <GraphJsonEditor
                        nodes={nodes}
                        links={links}
                        directed={directed}
                        onReloadGraph={handleReloadGraph}
                    />
                    <VertexLauncher
                        algo={selectedAlgo ?? ""}
                        nodes={nodes}
                        startNode={startNode}
                        endNode={endNode}
                        setStartNode={setStartNode}
                        setEndNode={setEndNode}
                        onLaunch={handleLaunch}
                        onCancel={handleCancel}
                    />

                    <Result edgeList={edgeList} bfTable={bfTable} algo={selectedAlgo ?? ""} startNode={startNode} />
                </aside>
            </main>
        </div>
    );
};

export default App;
