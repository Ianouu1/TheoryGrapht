import type { BFStep, FloydMatrices } from "../apiService";
import TreeDiagram from "./TreeDiagram";

export type EdgeRow = { source: string; target: string; weight: number };

type ResultProps = {
  edgeList: EdgeRow[];
  bfTable?: BFStep[] | null;
  fwMatrices?: FloydMatrices | null;
  algo?: string; // to detect BFS/DFS
  startNode?: string; // root for BFS/DFS tree
};

// formatting is now done on the backend; no helper needed here

// tree helpers moved to TreeDiagram component

export default function Result({ edgeList, bfTable, fwMatrices, algo, startNode }: ResultProps) {
  // Si matrices FW présentes, on affiche d'abord distances + pères
  if (fwMatrices) {
    const verts = (fwMatrices.vertices && fwMatrices.vertices.length > 0)
      ? fwMatrices.vertices
      : Object.keys(fwMatrices.dist || {});
    const isInf = (v: number) => v === 2147483647 || v === Number.POSITIVE_INFINITY as any;
    return (
      <div className="card">
        <h2>Floyd–Warshall</h2>
        <h3 style={{ marginTop: 8 }}>Matrice des distances</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
          <tr>
            <th style={{ textAlign: "left", padding: 6 }}></th>
            {verts.map((v) => (
              <th key={`d-h-${v}`} style={{ textAlign: "center", padding: 6 }}>{v}</th>
            ))}
          </tr>
          </thead>
          <tbody>
          {verts.map((i) => (
            <tr key={`d-r-${i}`}>
              <th style={{ textAlign: "left", padding: 6 }}>{i}</th>
              {verts.map((j) => {
                const val = fwMatrices.dist?.[i]?.[j];
                const text = val == null ? "–" : (isInf(val) ? "∞" : String(val));
                return <td key={`d-c-${i}-${j}`} style={{ textAlign: "center", padding: 6, borderBottom: "1px solid var(--border)" }}>{text}</td>;
              })}
            </tr>
          ))}
          </tbody>
        </table>

        <h3 style={{ marginTop: 12 }}>Matrice des pères</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
          <tr>
            <th style={{ textAlign: "left", padding: 6 }}></th>
            {verts.map((v) => (
              <th key={`n-h-${v}`} style={{ textAlign: "center", padding: 6 }}>{v}</th>
            ))}
          </tr>
          </thead>
          <tbody>
          {verts.map((i) => (
            <tr key={`n-r-${i}`}>
              <th style={{ textAlign: "left", padding: 6 }}>{i}</th>
              {verts.map((j) => {
                const val = fwMatrices.next?.[i]?.[j];
                const text = val == null ? "–" : String(val);
                return <td key={`n-c-${i}-${j}`} style={{ textAlign: "center", padding: 6, borderBottom: "1px solid var(--border)" }}>{text}</td>;
              })}
            </tr>
          ))}
          </tbody>
        </table>

  {/* On peut aussi afficher le chemin demandé en-dessous */}
        {edgeList?.length > 0 && (
          <>
            <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "8px 0" }} />
            <h3 style={{ marginTop: 8 }}>Chemin demandé</h3>
            <ul className="hint">
              {edgeList.map((e, i) => (
                <li key={i}>
                  {e.source} → {e.target} : <b>{e.weight}</b>
                </li>
              ))}
            </ul>
            <p className="hint" style={{ fontWeight: 700 }}>
              Total : {edgeList.reduce((sum, e) => sum + (Number(e.weight) || 0), 0)}
            </p>
          </>
        )}
      </div>
    );
  }
  // Sinon, si on a la table BF
  if (bfTable && bfTable.length > 0) {
    const vertices = Object.keys(bfTable[0].states);
    const first = bfTable[0];
    const last = bfTable[bfTable.length - 1];
    const startName = first.choiceName ?? vertices[0];

  // Reconstruit les plus courts chemins à partir de la dernière ligne
    const parseCell = (val?: string): { dist: number | null; pred: string | null } => {
      if (!val) return { dist: null, pred: null };
      const m = val.match(/^\((.*?),\s*(.*?)\)$/);
      if (!m) return { dist: null, pred: null };
      const dRaw = m[1].trim();
      const pRaw = m[2].trim();
      const dist = dRaw === "∞" || dRaw === "Infinity" ? null : Number(dRaw);
      const pred = pRaw === "*" || pRaw === "null" ? null : pRaw;
      return { dist: Number.isFinite(dist as number) ? (dist as number) : null, pred };
    };

    const paths: { to: string; cost: number | null; seq: string[] }[] = vertices
      .map((v) => {
        const { dist, pred } = parseCell(last.states[v]);
        if (v === startName) return { to: v, cost: 0, seq: [startName] };
        if (dist === null) return { to: v, cost: null, seq: [] };
        const seq: string[] = [v];
        let curPred = pred;
  // On remonte via les prédécesseurs jusqu'à la source
        let guard = 0;
        while (curPred && curPred !== startName && guard < 1000) {
          seq.push(curPred);
          const next = parseCell(last.states[curPred]).pred;
          curPred = next;
          guard++;
        }
        if (curPred === startName) seq.push(startName);
        seq.reverse();
        return { to: v, cost: dist, seq };
      })
      .filter((p) => p.to !== startName);

    return (
      <div className="card">
        <h2>Table Bellman-Ford</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: 6, borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.25)" }}>Liste</th>
                <th style={{ textAlign: "left", padding: 6, borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.25)" }}>Choix</th>
                {vertices.map((v) => (
                  <th key={v} style={{ textAlign: "center", padding: 6, borderBottom: "1px solid var(--border)" }}>{v}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bfTable.map((step, rowIdx) => (
                <tr key={rowIdx}>
                  <td style={{ padding: 6, borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.25)" }}>
                    {step.list && step.list.length > 0 ? `{${step.list.join(", ")}}` : "∅"}
                  </td>
                  <td style={{ padding: 6, borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.25)" }}>
                    {step.choiceName ? `${step.choiceName}, ${step.choiceDistance ?? "∞"}` : "–"}
                  </td>
                  {vertices.map((v) => {
                    const text = step.states[v] ?? "-";
                    const isChoice = step.choiceName && v === step.choiceName;
                    return (
                      <td
                        key={v}
                        style={{
                          textAlign: "center",
                          padding: 6,
                          borderBottom: "1px solid var(--border)",
                          color: isChoice ? "#ef1e1e" : undefined,
                          fontWeight: isChoice ? 700 : 400,
                        }}
                      >
                        {text}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 12 }}>
            <h3 style={{ margin: 0, fontSize: 16 }}>Chemins les plus courts</h3>
            <ul className="hint" style={{ marginTop: 6 }}>
              {paths.map((p, i) => (
                <li key={i}>
                  {startName} → {p.to}: {p.cost === null ? <b>non atteint</b> : (<><b>{p.cost}</b> via {p.seq.join(" → ")}</>)}
                </li>
              ))}
            </ul>
          </div>
      </div>
    );
  }

  // Par défaut: on liste les arêtes; pour BFS/DFS on ajoute le petit arbre
  return (
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
          {(algo === "bfs" || algo === "dfs") && (
            <div style={{ marginTop: 10 }}>
              <h3 style={{ margin: 0, fontSize: 16 }}>Arbre {algo?.toUpperCase()}</h3>
              <TreeDiagram edges={edgeList} root={startNode} />
            </div>
          )}
          <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "8px 0" }} />
          <p className="hint" style={{ fontWeight: "bold" }}>
            Total : {edgeList.reduce((sum, e) => sum + (Number(e.weight) || 0), 0)}
          </p>
        </>
      )}
    </div>
  );
}
