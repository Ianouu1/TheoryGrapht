// apiService.ts
import type {GraphNode, GraphLink} from "./components/Graph";

const BASE_URL = "http://localhost:8080";

export type Neighbor = { target: string; distance: number };
export type AdjacencyGraph = Record<string, Neighbor[]>;
export type BFStep = {
    states: Record<string, string>; // vertex -> "(d, p)"
    list?: string[]; // Liste L (order matters)
    choiceName?: string | null; // Choix (sommet)
    choiceDistance?: number | null; // distance du choix
};

export type FloydMatrices = {
    dist: Record<string, Record<string, number>>;
    next: Record<string, Record<string, string | null>>;
    vertices?: string[]; // server-provided stable order
};

// Convertit nodes/links → format attendu par ton backend
export function graphToAdjacency(nodes: GraphNode[], links: GraphLink[], directed = false): AdjacencyGraph {
    const adj: AdjacencyGraph = {};
    nodes.forEach(n => (adj[n.id] = []));
    links.forEach(l => {
        const s = typeof l.source === "object" ? l.source.id : l.source;
        const t = typeof l.target === "object" ? l.target.id : l.target;
        adj[s].push({target: t, distance: l.weight});
        // Pour les graphes non dirigés, on ajoute aussi dans l'autre sens
        if (!directed) {
            adj[t].push({target: s, distance: l.weight});
        }
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

export async function runFloydWarshall(graph: AdjacencyGraph, start: string, end: string) {
    const response = await fetch(`${BASE_URL}/floydWarshall?start=${start}&end=${end}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(graph),
    });
    return response.json();
}

export async function runBellmanFord(graph: AdjacencyGraph, start: string) {
    const res = await fetch(`${BASE_URL}/bellmanFord?start=${start}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(graph),
    });
    return res.json();
}

export async function runBellmanFordTable(graph: AdjacencyGraph, start: string): Promise<BFStep[]> {
    const res = await fetch(`${BASE_URL}/bellmanFord/table?start=${start}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(graph),
    });
    return res.json();
}

export async function runFloydWarshallMatrices(graph: AdjacencyGraph): Promise<FloydMatrices> {
    const response = await fetch(`${BASE_URL}/floydWarshall/matrices`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(graph),
    });
    return response.json();
}