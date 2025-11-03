import React from "react";
import type { GraphNode, GraphLink } from "./Graph";
import baseGraph from "../assets/baseGraph.json";
import bellmanFordGraph from "../assets/bellmanFordGraph.json";
import floydWarshallGraph from "../assets/floydWarshallGraph.json";

// Conversion pour graphes non dirigés (bidirectionnels)
function adjacencyToNodesLinksUndirected(
    graph: Record<string, { target: string; distance: number }[]>
) {
    const nodes: GraphNode[] = Object.keys(graph).map((id) => ({ id }));
    const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));
    const links: GraphLink[] = [];
    const added = new Set<string>();

    for (const from in graph) {
        const neighbors = graph[from];
        if (!neighbors || !Array.isArray(neighbors)) continue;

        for (const neighbor of neighbors) {
            if (!neighbor || !neighbor.target) continue;

            const { target, distance } = neighbor;
            // Pour les graphes non dirigés, on utilise une clé symétrique
            const key = [from, target].sort().join("_");

            if (!added.has(key)) {
                links.push({
                    source: nodeMap[from],
                    target: nodeMap[target],
                    weight: distance || 0,
                });
                added.add(key);
            }
        }
    }
    return { nodes, links };
}

// Conversion pour graphes dirigés (unidirectionnels)
function adjacencyToNodesLinksDirected(
    graph: Record<string, { target: string; distance: number }[]>
) {
    const nodes: GraphNode[] = Object.keys(graph).map((id) => ({ id }));
    const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));
    const links: GraphLink[] = [];
    const added = new Set<string>();

    for (const from in graph) {
        const neighbors = graph[from];
        if (!neighbors || !Array.isArray(neighbors)) continue;

        for (const neighbor of neighbors) {
            if (!neighbor || !neighbor.target) continue;

            const { target, distance } = neighbor;
            // Pour les graphes dirigés, on utilise une clé directionnelle
            const key = `${from}_${target}`;

            if (!added.has(key)) {
                links.push({
                    source: nodeMap[from],
                    target: nodeMap[target],
                    weight: distance || 0,
                });
                added.add(key);
            }
        }
    }
    return { nodes, links };
}

interface ToolbarProps {
    setNodes: React.Dispatch<React.SetStateAction<GraphNode[]>>;
    setLinks: React.Dispatch<React.SetStateAction<GraphLink[]>>;
    setDirected: React.Dispatch<React.SetStateAction<boolean>>;
    onReset: () => void;
    setSelectedAlgo: React.Dispatch<React.SetStateAction<string | null>>;
    setStartNode: React.Dispatch<React.SetStateAction<string>>;
    setEndNode: React.Dispatch<React.SetStateAction<string>>;
}

const Toolbar: React.FC<ToolbarProps> = ({
    setNodes,
    setLinks,
    setDirected,
    onReset,
    setSelectedAlgo,
    setStartNode,
    setEndNode,
}) => {

    // Sélection d'un algorithme et chargement du graph approprié
    function handleAlgoClick(algo: string) {
        try {
            setSelectedAlgo(algo);
            setStartNode("");
            setEndNode("");
            onReset();

            let chosenGraph: Record<string, { target: string; distance: number }[]> = baseGraph as Record<string, { target: string; distance: number }[]>;
            let isDirected = false;
            let newNodes: GraphNode[] = [];
            let newLinks: GraphLink[] = [];

            if (algo === "bellmanford") {
                chosenGraph = bellmanFordGraph as Record<string, { target: string; distance: number }[]>;
                isDirected = true;
                const result = adjacencyToNodesLinksDirected(chosenGraph);
                newNodes = result.nodes;
                newLinks = result.links;
            } else if (algo === "floydwarshall") {
                chosenGraph = floydWarshallGraph as Record<string, { target: string; distance: number }[]>;
                isDirected = true;
                const result = adjacencyToNodesLinksDirected(chosenGraph);
                newNodes = result.nodes;
                newLinks = result.links;
            } else {
                // BFS, DFS, Prim, Dijkstra, Kruskal utilisent baseGraph (non dirigé)
                chosenGraph = baseGraph as Record<string, { target: string; distance: number }[]>;
                isDirected = false;
                const result = adjacencyToNodesLinksUndirected(chosenGraph);
                newNodes = result.nodes;
                newLinks = result.links;
            }

            setNodes(newNodes);
            setLinks(newLinks);
            setDirected(isDirected);
        } catch (error) {
            console.error("Erreur lors du chargement du graphe:", error);
            alert("Erreur lors du chargement du graphe. Voir la console pour plus de détails.");
        }
    }


    return (
        <header>
            <h1>TheoryGrapht</h1>
            <div className="toolbar">
                <div className="group">
                    <label>Algorithmes</label>
                    <button onClick={() => handleAlgoClick("bfs")}>Parcours en largeur (BFS)</button>
                    <button onClick={() => handleAlgoClick("dfs")}>Parcours en profondeur (DFS)</button>
                    <button onClick={() => handleAlgoClick("prim")}>Prim</button>
                    <button onClick={() => handleAlgoClick("kruskal")}>Kruskal</button>
                    <button onClick={() => handleAlgoClick("dijkstra")}>Dijkstra</button>
                    <button onClick={() => handleAlgoClick("bellmanford")}>Bellman-Ford</button>
                    <button onClick={() => handleAlgoClick("floydwarshall")}>
                        Floyd-Warshall
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Toolbar;
