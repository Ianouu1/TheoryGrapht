// apiService.ts
import type {GraphNode, GraphLink} from "./components/Graph";

const BASE_URL = "http://localhost:8080";

export type Neighbor = { ville: string; distance: number };
export type AdjacencyGraph = Record<string, Neighbor[]>;

// Convertit nodes/links → format attendu par ton backend
export function graphToAdjacency(nodes: GraphNode[], links: GraphLink[]): AdjacencyGraph {
    const adj: AdjacencyGraph = {};
    nodes.forEach(n => (adj[n.id] = []));
    links.forEach(l => {
        const s = typeof l.source === "object" ? l.source.id : l.source;
        const t = typeof l.target === "object" ? l.target.id : l.target;
        adj[s].push({ville: t, distance: l.weight});
        adj[t].push({ville: s, distance: l.weight});
    });
    return adj;
}

// ---- Appels API ---- //
export async function runBFS(graph: AdjacencyGraph, start: string) {
    const res = await fetch(`${BASE_URL}/bfs?startingVertexName=${start}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(graph),
    });
    return res.json(); // tableau de Vertex
}

export async function runDFS(graph: AdjacencyGraph, start: string) {
    const res = await fetch(`${BASE_URL}/dfs?startingVertexName=${start}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(graph),
    });
    return res.json();
}

export async function runKruskal(graph: AdjacencyGraph) {
    const res = await fetch(`${BASE_URL}/kruskal`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(graph),
    });
    return res.json(); // renvoie {edges: ...}
}

export async function runPrim(graph: AdjacencyGraph, start: string) {
    const res = await fetch(`${BASE_URL}/prim?startingVertexName=${start}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(graph),
    });
    return res.json();
}

export async function runDijkstra(graph: AdjacencyGraph, start: string, end: string) {
    const res = await fetch(`${BASE_URL}/dijkstra?start=${start}&end=${end}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(graph),
    });
    return res.json();
}

export async function runFloydWarshall(graph: any, start: string, end: string) {
    const response = await fetch(`${BASE_URL}/floydWarshall?start=${start}&end=${end}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(graph),
    });
    return response.json();
}
