import React, { useMemo } from "react";
import { hierarchy, tree as d3tree } from "d3";
import type { EdgeRow } from "./Result";

export type TreeNode = { name: string; children: TreeNode[] };

type Props = {
  edges: EdgeRow[];
  root?: string;
};

function buildTree(edges: EdgeRow[], root?: string): TreeNode | null {
  if (!Array.isArray(edges) || edges.length === 0) return null;

  const parents = new Map<string, Set<string>>();
  const childrenSet = new Set<string>();
  const nodesSet = new Set<string>();

  edges.forEach((e) => {
    nodesSet.add(e.source);
    nodesSet.add(e.target);
    childrenSet.add(e.target);
    if (!parents.has(e.source)) parents.set(e.source, new Set());
    parents.get(e.source)!.add(e.target);
  });

  let rootName: string | undefined = root && nodesSet.has(root) ? root : undefined;
  if (!rootName) {
    for (const n of nodesSet) { if (!childrenSet.has(n)) { rootName = n; break; } }
  }
  if (!rootName) rootName = edges[0].source;

  const visited = new Set<string>();
  const toNode = (name: string): TreeNode => {
    if (visited.has(name)) return { name, children: [] };
    visited.add(name);
    const childs = Array.from(parents.get(name) ?? [])
      .map((c) => toNode(c));
    return { name, children: childs };
  };

  const rootNode = toNode(rootName);
  // Do not attach synthetic root; assume graph is connected as per requirement
  return rootNode;
}

const TreeDiagram: React.FC<Props> = ({ edges, root }) => {
  const layout = useMemo(() => {
    const data = buildTree(edges, root);
    if (!data) return null;

    const rootH = hierarchy<TreeNode>(data);
    // Smaller spacing for a more compact diagram
    const nodeGapX = 50; // vertical spacing (y-axis in layout)
    const nodeGapY = 40; // horizontal spacing (x-axis in layout)
    const treeLayout = d3tree<TreeNode>().nodeSize([nodeGapY, nodeGapX]);
    const treeRoot = treeLayout(rootH);

    const nodes = treeRoot.descendants();
    const links = treeRoot.links();

  const minX = Math.min(...nodes.map((n) => n.x));
    const maxX = Math.max(...nodes.map((n) => n.x));
    const minY = Math.min(...nodes.map((n) => n.y));
    const maxY = Math.max(...nodes.map((n) => n.y));

    const margin = { top: 20, right: 40, bottom: 12, left: 70 };
    const contentW = maxY - minY;
    const contentH = maxX - minX;
    const width = contentW + margin.left + margin.right + 20;
    const height = contentH + margin.top + margin.bottom + 20;

    const translateX = margin.left - minY + 10;
    const translateY = margin.top - minX + 10;

    return { nodes, links, width, height, translateX, translateY };
  }, [edges, root]);

  if (!layout) return <p className="hint">Pas d'arbre à afficher.</p>;

  return (
    <svg width="100%" viewBox={`0 0 ${layout.width} ${layout.height}`} style={{ maxHeight: 260 }}>
      <g transform={`translate(${layout.translateX},${layout.translateY})`}>
        {layout.links.map((l, i) => {
          const x1 = l.source.x, y1 = l.source.y;
          const x2 = l.target.x, y2 = l.target.y;
          const mx = (y1 + y2) / 2;
          const path = `M${y1},${x1} C ${mx},${x1} ${mx},${x2} ${y2},${x2}`;
          return (
            <path key={i} d={path} fill="none" stroke="#334155" strokeWidth={2} />
          );
        })}

        {layout.nodes.map((n, i) => (
          <g key={i} transform={`translate(${n.y},${n.x})`}>
            <circle r={9} fill="#60a5fa" stroke="#0b1220" strokeWidth={1.5} />
            <text dy={-14} textAnchor="middle" fill="#e2e8f0" fontSize={11} fontWeight={700}>
              {n.data.name}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
};

export default TreeDiagram;
