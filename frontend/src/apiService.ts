// apiService.ts
import type {GraphNode, GraphLink} from "./components/Graph";

const BASE_URL = "http://localhost:8080";

async function fetchJson<T>(url: string, body: unknown): Promise<T> {
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Requête échouée (${res.status})`);
    }
    return res.json() as Promise<T>;
}

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
    vertices?: string[]; // ordre des sommets renvoyé par le serveur
};

// Construit l'adjacence au format attendu par l'API
export function graphToAdjacency(nodes: GraphNode[], links: GraphLink[], directed = false): AdjacencyGraph {
    const adj: AdjacencyGraph = {};
    nodes.forEach(n => (adj[n.id] = []));
    links.forEach(l => {
        const s = typeof l.source === "object" ? l.source.id : l.source;
        const t = typeof l.target === "object" ? l.target.id : l.target;
        adj[s].push({target: t, distance: l.weight});
        // En non orienté: on ajoute aussi l'arête inverse
        if (!directed) {
            adj[t].push({target: s, distance: l.weight});
        }
    });
    return adj;
}

// ---- Appels API ---- //
export async function runBFS(graph: AdjacencyGraph, start: string) {
    return fetchJson(`${BASE_URL}/bfs?startingVertexName=${start}`, graph);
}

export async function runDFS(graph: AdjacencyGraph, start: string) {
    return fetchJson(`${BASE_URL}/dfs?startingVertexName=${start}`, graph);
}

export async function runKruskal(graph: AdjacencyGraph) {
    return fetchJson(`${BASE_URL}/kruskal`, graph);
}

export async function runPrim(graph: AdjacencyGraph, start: string) {
    return fetchJson(`${BASE_URL}/prim?startingVertexName=${start}`, graph);
}

export async function runDijkstra(graph: AdjacencyGraph, start: string, end: string) {
    return fetchJson(`${BASE_URL}/dijkstra?start=${start}&end=${end}`, graph);
}

export async function runFloydWarshall(graph: AdjacencyGraph, start: string, end: string) {
    return fetchJson(`${BASE_URL}/floydWarshall?start=${start}&end=${end}`, graph);
}

export async function runBellmanFord(graph: AdjacencyGraph, start: string) {
    return fetchJson(`${BASE_URL}/bellmanFord?start=${start}`, graph);
}

export async function runBellmanFordTable(graph: AdjacencyGraph, start: string): Promise<BFStep[]> {
    return fetchJson(`${BASE_URL}/bellmanFord/table?start=${start}`, graph);
}

export async function runFloydWarshallMatrices(graph: AdjacencyGraph): Promise<FloydMatrices> {
    return fetchJson(`${BASE_URL}/floydWarshall/matrices`, graph);
}