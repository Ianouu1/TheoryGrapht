import React, { useState } from "react";
import type { GraphNode, GraphLink } from "./Graph";
import AlgorithmPopup from "./AlgorithmPopup";

interface ToolbarProps {
    nodes: GraphNode[];
    links: GraphLink[];
    setNodes: React.Dispatch<React.SetStateAction<GraphNode[]>>;
    setLinks: React.Dispatch<React.SetStateAction<GraphLink[]>>;
    onSendGraph: (algorithm: string, start?: string, end?: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ nodes, onSendGraph }) => {
    const [selectedAlgo, setSelectedAlgo] = useState<string | null>(null);
    const [startNode, setStartNode] = useState("");
    const [endNode, setEndNode] = useState("");

    // Sélection d’un algorithme
    function handleAlgoClick(algo: string) {
        setSelectedAlgo(algo);
        setStartNode("");
        setEndNode("");
    }

    // Validation
    function handleLaunch() {
        if (!selectedAlgo) return;

        switch (selectedAlgo) {
            case "bfs":
            case "dfs":
            case "prim":
                if (!startNode) return alert("Choisis un sommet de départ");
                onSendGraph(selectedAlgo, startNode);
                break;
            case "dijkstra":
                if (!startNode || !endNode)
                    return alert("Choisis un sommet de départ et d’arrivée");
                onSendGraph(selectedAlgo, startNode, endNode);
                break;
            case "kruskal":
                onSendGraph("kruskal");
                break;
            default:
                break;
        }
    }

    return (
        <div className="toolbar">
            <div className="group">
                <label>Algorithmes</label>
                <button onClick={() => handleAlgoClick("bfs")}>BFS</button>
                <button onClick={() => handleAlgoClick("dfs")}>DFS</button>
                <button onClick={() => handleAlgoClick("prim")}>Prim</button>
                <button onClick={() => handleAlgoClick("dijkstra")}>Dijkstra</button>
                <button onClick={() => handleAlgoClick("kruskal")}>Kruskal</button>
            </div>

            {/* Popup toujours visible */}
            <AlgorithmPopup
                algo={selectedAlgo ?? ""}
                nodes={nodes}
                startNode={startNode}
                endNode={endNode}
                setStartNode={setStartNode}
                setEndNode={setEndNode}
                onLaunch={handleLaunch}
                onCancel={() => setSelectedAlgo(null)}
            />
        </div>
    );
};

export default Toolbar;
