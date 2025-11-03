import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { GraphNode, GraphLink } from "./Graph";

type DirectedGraphProps = {
    nodes: GraphNode[];
    links: GraphLink[];
    highlightEdges?: Record<string, string>;
};

// Graphe orienté (flèches, courbes si arêtes inverses)
const DirectedGraph: React.FC<DirectedGraphProps> = ({ nodes, links, highlightEdges }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const simRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null);

    useEffect(() => {
        if (!svgRef.current) return;
        if (!nodes || nodes.length === 0) return;

        try {
            const width = svgRef.current.clientWidth || 800;
            const height = svgRef.current.clientHeight || 600;
            if (width === 0 || height === 0) return;

            const svg = d3.select(svgRef.current);
            svg.selectAll("*").remove();

            const gZoom = svg.append("g");
            const linkLayer = gZoom.append("g");
            const labelLayer = gZoom.append("g");
            const nodeLayer = gZoom.append("g");

            // Définition des flèches
            svg.append("defs")
                .append("marker")
                .attr("id", "arrowhead")
                .attr("viewBox", "-0 -5 10 10")
                .attr("refX", 20)
                .attr("refY", 0)
                .attr("orient", "auto")
                .attr("markerWidth", 6)
                .attr("markerHeight", 6)
                .append("path")
                .attr("d", "M0,-5L10,0L0,5")
                .attr("fill", "#8b9bb4");

            // Zoom / Pan
            const zoom = d3
                .zoom<SVGSVGElement, unknown>()
                .scaleExtent([0.5, 3])
                .on("zoom", (event) => gZoom.attr("transform", event.transform));
            svg.call(zoom);

            // Placement initial
            const centerX = width / 2;
            const centerY = height / 2;
            const radius = Math.min(width, height) / 2.5;
            nodes.forEach((n, i) => {
                const angle = nodes.length > 0 ? (2 * Math.PI * i) / nodes.length : 0;
                n.x = centerX + radius * Math.cos(angle);
                n.y = centerY + radius * Math.sin(angle);
            });

            // Simulation
            const sim = d3
                .forceSimulation<GraphNode>(nodes)
                .force(
                    "link",
                    d3
                        .forceLink<GraphNode, GraphLink>(links || [])
                        .id((d) => d.id)
                        .distance(250)
                        .strength(0.5)
                )
                .force("charge", d3.forceManyBody().strength(-300))
                .force("center", d3.forceCenter(centerX, centerY))
                .force("collision", d3.forceCollide().radius(50))
                .on("tick", ticked);

            simRef.current = sim;

            const link = linkLayer
                .selectAll<SVGPathElement, GraphLink>("path")
                .data(links || [])
                .enter()
                .append("path")
                .attr("stroke", "#8b9bb4")
                .attr("stroke-opacity", 0.8)
                .attr("stroke-width", 2)
                .attr("fill", "none")
                .attr("marker-end", "url(#arrowhead)");

            const label = labelLayer
                .selectAll<SVGTextElement, GraphLink>("text.edgeLabel")
                .data(links || [])
                .enter()
                .append("text")
                .attr("class", "edgeLabel")
                .attr("font-size", 15)
                .attr("text-anchor", "middle")
                .attr("dy", -4)
                .text((d) => d.weight)
                .style("paint-order", "stroke")
                .attr("stroke", "#0b1220")
                .attr("stroke-width", 2)
                .attr("fill", (d) => {
                    const key1 = `${(d.source as GraphNode).id}_${(d.target as GraphNode).id}`;
                    const color = highlightEdges?.[key1];
                    if (color === "#ef1e1e") return "#b31212";
                    return color || "#cbd5e1";
                });

            const node = nodeLayer
                .selectAll<SVGGElement, GraphNode>("g.node")
                .data(nodes)
                .enter()
                .append("g")
                .attr("class", "node");

            node
                .append("circle")
                .attr("r", 14)
                .attr("fill", "#60a5fa")
                .attr("stroke", "#1f2937")
                .attr("stroke-width", 1.5);

            node
                .append("text")
                .classed("vertexName", true)
                .attr("y", 25)
                .attr("font-weight", "bold")
                .attr("fill", "#4f88cf")
                .text((d: any) => d.id);

            function ticked() {
                link.attr("d", (d) => {
                    const sx = (d.source as GraphNode).x || 0;
                    const sy = (d.source as GraphNode).y || 0;
                    const tx = (d.target as GraphNode).x || 0;
                    const ty = (d.target as GraphNode).y || 0;

                    const hasReverse = links.some(
                        (l) =>
                            (l.source as GraphNode).id === (d.target as GraphNode).id &&
                            (l.target as GraphNode).id === (d.source as GraphNode).id
                    );

                    if (hasReverse) {
                        const dx = tx - sx;
                        const dy = ty - sy;
                        const dr = Math.sqrt(dx * dx + dy * dy) || 1;
                        const curveOffset = 25;
                        const nx = dy / dr;
                        const ny = -dx / dr;

                        const sumCharCodes =
                            (d.source as GraphNode).id.charCodeAt(0) +
                            (d.target as GraphNode).id.charCodeAt(0);
                        const reverse = sumCharCodes % 2 === 0 ? 1 : -1;

                        const cx = (sx + tx) / 2 + nx * curveOffset * reverse;
                        const cy = (sy + ty) / 2 + ny * curveOffset * reverse;

                        return `M${sx},${sy} Q${cx},${cy} ${tx},${ty}`;
                    }
                    return `M${sx},${sy} L${tx},${ty}`;
                });

                label
                    .attr("x", (d) => {
                        const sx = (d.source as GraphNode).x || 0;
                        const tx = (d.target as GraphNode).x || 0;

                        const hasReverse = links.some(
                            (l) =>
                                (l.source as GraphNode).id === (d.target as GraphNode).id &&
                                (l.target as GraphNode).id === (d.source as GraphNode).id
                        );
                        if (hasReverse) {
                            const sy = (d.source as GraphNode).y || 0;
                            const ty = (d.target as GraphNode).y || 0;
                            const dx = tx - sx;
                            const dy = ty - sy;
                            const dr = Math.sqrt(dx * dx + dy * dy) || 1;
                            const nx = dy / dr;
                            const sumCharCodes =
                                (d.source as GraphNode).id.charCodeAt(0) +
                                (d.target as GraphNode).id.charCodeAt(0);
                            const reverse = sumCharCodes % 2 === 0 ? 1 : -1;
                            const offset = 25;
                            return (sx + tx) / 2 + nx * offset * reverse;
                        }
                        return (sx + tx) / 2;
                    })
                    .attr("y", (d) => {
                        const sy = (d.source as GraphNode).y || 0;
                        const ty = (d.target as GraphNode).y || 0;

                        const hasReverse = links.some(
                            (l) =>
                                (l.source as GraphNode).id === (d.target as GraphNode).id &&
                                (l.target as GraphNode).id === (d.source as GraphNode).id
                        );
                        if (hasReverse) {
                            const sx = (d.source as GraphNode).x || 0;
                            const tx = (d.target as GraphNode).x || 0;
                            const dx = tx - sx;
                            const dy = ty - sy;
                            const dr = Math.sqrt(dx * dx + dy * dy) || 1;
                            const ny = -dx / dr;
                            const sumCharCodes =
                                (d.source as GraphNode).id.charCodeAt(0) +
                                (d.target as GraphNode).id.charCodeAt(0);
                            const reverse = sumCharCodes % 2 === 0 ? 1 : -1;
                            const offset = 15;
                            return (sy + ty) / 2 + ny * offset * reverse;
                        }
                        return (sy + ty) / 2;
                    })
                    .attr("fill", (d) => {
                        const key1 = `${(d.source as GraphNode).id}_${(d.target as GraphNode).id}`;
                        return highlightEdges?.[key1] || "#cbd5e1";
                    });

                node.attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
            }

            return () => {
                if (simRef.current) simRef.current.stop();
            };
        } catch (e) {
            console.error("Erreur lors du rendu du graphe orienté:", e);
        }
    }, [nodes, links]);

    // Mise à jour des couleurs
    useEffect(() => {
        if (!svgRef.current) return;
        try {
            const svg = d3.select(svgRef.current);
            svg.selectAll<SVGPathElement, any>("path").attr("stroke", (d: any) => {
                const key1 = `${d.source.id}_${d.target.id}`;
                return highlightEdges?.[key1] || "#8b9bb4";
            });
            svg.selectAll<SVGTextElement, any>("text.edgeLabel").attr("fill", (d: any) => {
                const key1 = `${d.source.id}_${d.target.id}`;
                return highlightEdges?.[key1] || "#cbd5e1";
            });
        } catch (e) {
            console.error("Erreur lors de la mise à jour des couleurs (oriented):", e);
        }
    }, [highlightEdges]);

    return <svg ref={svgRef} width="100%" height="100%" />;
};

export default DirectedGraph;
