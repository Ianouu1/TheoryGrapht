import React, {useEffect, useState} from "react";
import type {GraphNode, GraphLink} from "./Graph";
import type {AdjacencyGraph} from "../apiService";

type Props = {
    nodes: GraphNode[];
    links: GraphLink[];
    directed: boolean;
    onReloadGraph: (nodes: GraphNode[], links: GraphLink[]) => void;
};

// Construit l'adjacence à partir des nodes/links
function nodesLinksToAdjacency(
    nodes: GraphNode[],
    links: GraphLink[],
    directed: boolean
): AdjacencyGraph {
    const adj: AdjacencyGraph = {};
    nodes.forEach((n) => (adj[n.id] = []));

    links.forEach((l) => {
        const s = typeof l.source === "object" ? l.source.id : l.source;
        const t = typeof l.target === "object" ? l.target.id : l.target;
        const w = l.weight ?? 0;
        adj[s].push({target: t, distance: w});
        if (!directed) {
            // En non orienté, on ajoute l'arête inverse pour la lecture/édition
            adj[t].push({target: s, distance: w});
        }
    });
    return adj;
}

// Conversion du JSON vers nodes/links
function adjacencyToNodesLinksUndirected(
    graph: Record<string, { target: string; distance: number }[]>
): { nodes: GraphNode[]; links: GraphLink[] } {
    const nodes: GraphNode[] = Object.keys(graph).map((id) => ({id}));
    const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));
    const links: GraphLink[] = [];
    const added = new Set<string>();

    for (const from in graph) {
        const neighbors = graph[from];
        if (!Array.isArray(neighbors)) continue;
        for (const nb of neighbors) {
            if (!nb || !nb.target) continue;
            const key = [from, nb.target].sort().join("_");
            if (!added.has(key)) {
                links.push({source: nodeMap[from], target: nodeMap[nb.target], weight: nb.distance ?? 0});
                added.add(key);
            }
        }
    }
    return {nodes, links};
}

function adjacencyToNodesLinksDirected(
    graph: Record<string, { target: string; distance: number }[]>
): { nodes: GraphNode[]; links: GraphLink[] } {
    const nodes: GraphNode[] = Object.keys(graph).map((id) => ({id}));
    const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));
    const links: GraphLink[] = [];

    for (const from in graph) {
        const neighbors = graph[from];
        if (!Array.isArray(neighbors)) continue;
        for (const nb of neighbors) {
            if (!nb || !nb.target) continue;
            links.push({source: nodeMap[from], target: nodeMap[nb.target], weight: nb.distance ?? 0});
        }
    }
    return {nodes, links};
}

const GraphJsonEditor: React.FC<Props> = ({nodes, links, directed, onReloadGraph}) => {
    const [text, setText] = useState<string>("{}");
    const [error, setError] = useState<string>("");

    // Keep textarea in sync with current graph
    useEffect(() => {
        const adj = nodesLinksToAdjacency(nodes, links, directed);
        setText(JSON.stringify(adj, null, 2));
        setError("");
    }, [nodes, links, directed]);

    function handleReload() {
        try {
            setError("");
            const parsed = JSON.parse(text);
            if (!parsed || typeof parsed !== "object") throw new Error("JSON invalide");

            const graph: Record<string, { target: string; distance: number }[]> = parsed;
            const converter = directed ? adjacencyToNodesLinksDirected : adjacencyToNodesLinksUndirected;
            const {nodes: newNodes, links: newLinks} = converter(graph);

            if (newNodes.length === 0) throw new Error("Aucun sommet dans le graphe");
            onReloadGraph(newNodes, newLinks);
        } catch (e: any) {
            setError(e?.message || "Erreur lors du parsing du JSON");
        }
    }

    return (
        <section className="json-editor-box">
            <div className="json-editor-header">
                <strong>Graphe (JSON)</strong>
                <span className="json-editor-mode">{directed ? "orienté" : "non orienté"}</span>
            </div>
            <textarea
                className="json-editor"
                spellCheck={false}
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={12}
            />
            {error && <div className="json-editor-error">{error}</div>}
            <div className="json-editor-actions">
                <button onClick={handleReload}>Recharger</button>
            </div>
            <div className="json-editor-note hint" style={{marginTop: 6}}>
                {!directed ? (
                    <>
                        <b>Mode non orienté :</b> VEILLEZ À BIEN AVOIR LES ARÊTES DANS LES DEUX SENS DANS LE JSON.
                    </>
                ) : (
                    <>
                        <b>Mode orienté :</b> les arêtes sont considérées comme dirigées.
                    </>
                )}
            </div>
        </section>
    );
};

export default GraphJsonEditor;
