import React from "react";
import type { GraphNode } from "./Graph";

interface VertexLauncher {
    algo: string;
    nodes: GraphNode[];
    startNode: string;
    endNode: string;
    setStartNode: (v: string) => void;
    setEndNode: (v: string) => void;
    onLaunch: () => void;
    onCancel: () => void;
}

const VertexLauncher: React.FC<VertexLauncher> = ({
                                                           algo,
                                                           nodes,
                                                           startNode,
                                                           endNode,
                                                           setStartNode,
                                                           setEndNode,
                                                           onLaunch,
                                                           onCancel,
                                                       }) => (
    <div className="popup-card">
        <h3>
            Algo choisi :{" "}
            <span style={{ color: "var(--accent)", textTransform: "uppercase" }}>
        {algo || "aucun"}
      </span>
        </h3>

        {algo && (
            <>
                {(algo === "bfs" || algo === "dfs" || algo === "prim" || algo === "dijkstra" || algo === "floydwarshall" || algo === "bellmanford") && (
                    <div className="row">
                        <label>Sommet de départ :</label>
                        <select
                            value={startNode}
                            onChange={(e) => setStartNode(e.target.value)}
                        >
                            <option value="">--</option>
                            {nodes.map((n) => (
                                <option key={n.id} value={n.id}>
                                    {n.id}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {(algo === "dijkstra" || algo === "floydwarshall") && (
                    <div className="row">
                        <label>Sommet d'arrivée :</label>
                        <select
                            value={endNode}
                            onChange={(e) => setEndNode(e.target.value)}
                        >
                            <option value="">--</option>
                            {nodes.map((n) => (
                                <option key={n.id} value={n.id}>
                                    {n.id}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div
                    className="row"
                    style={{ flexDirection: "row", justifyContent: "space-between" }}
                >
                    <button className="lancer" onClick={onLaunch}>
                        Lancer
                    </button>
                    <button className="reinitialiser" onClick={onCancel}>
                        Réinitialiser
                    </button>
                </div>
            </>
        )}
    </div>
);

export default VertexLauncher;
