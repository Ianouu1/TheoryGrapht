import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

export type GraphNode = {
    id: string;
    x?: number;
    y?: number;
    vx?: number;
    vy?: number;
    fx?: number | null;
    fy?: number | null;
};

export type GraphLink = {
    source: GraphNode | string;
    target: GraphNode | string;
    weight: number;
};

interface GraphProps {
    nodes: GraphNode[];
    links: GraphLink[];
    highlightEdges?: Record<string, string>;
    directed?: boolean;
}

const Graph: React.FC<GraphProps> = ({ nodes, links, highlightEdges, directed = false }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const simRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null);

    // @ts-ignore
    useEffect(() => {
        if (!svgRef.current) return;

        const width = svgRef.current.clientWidth;
        const height = svgRef.current.clientHeight;
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const gZoom = svg.append("g");
        const linkLayer = gZoom.append("g");
        const labelLayer = gZoom.append("g");
        const nodeLayer = gZoom.append("g");
        if (directed) {
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
        }

        // --- Zoom/Pan ---
        const zoom = d3
            .zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.5, 3])
            .on("zoom", (event) => gZoom.attr("transform", event.transform));
        svg.call(zoom);

        // --- Positionnement initial circulaire centré ---
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2.5;
        nodes.forEach((n, i) => {
            const angle = (2 * Math.PI * i) / nodes.length;
            n.x = centerX + radius * Math.cos(angle);
            n.y = centerY + radius * Math.sin(angle);
        });

        // --- Simulation ---
        const sim = d3
            .forceSimulation<GraphNode>(nodes)
            .force(
                "link",
                d3
                    .forceLink<GraphNode, GraphLink>(links)
                    .id((d) => d.id)
                    .distance(50)
                    .strength(0.1)
            )
            .force("charge", d3.forceManyBody().strength(-600))
            .force("center", d3.forceCenter(centerX, centerY))
            .force("collision", d3.forceCollide().radius(40))
            .on("tick", ticked);

        simRef.current = sim;

        const link = linkLayer
            .selectAll("path")
            .data(links)
            .enter()
            .append("path")
            .attr("stroke", "#8b9bb4")
            .attr("stroke-opacity", 0.8)
            .attr("stroke-width", 2)
            .attr("fill", "none")
            .attr("marker-end", directed ? "url(#arrowhead)" : null);


        const label = labelLayer
            .selectAll("text.edgeLabel")
            .data(links)
            .enter()
            .append("text")
            .attr("class", "edgeLabel")
            .attr("font-size", 15)
            .attr("text-anchor", "middle")
            .attr("dy", -4)
            .text((d) => d.weight)
            .attr("fill", (d) => {
                const key1 = `${(d.source as GraphNode).id}_${(d.target as GraphNode).id}`;
                const key2 = `${(d.target as GraphNode).id}_${(d.source as GraphNode).id}`;
                const color = highlightEdges?.[key1] || highlightEdges?.[key2];
                if (color === "#ef1e1e") return "#b31212"; // rouge plus profond
                return color || "#cbd5e1"; // couleur par défaut
            })
            .style("paint-order", "stroke")
            .attr("stroke", "#0b1220")
            .attr("stroke-width", 2);

        const node = nodeLayer
            .selectAll("g.node")
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
            .attr('font-weight', 'bold')
            .attr("fill", "#4f88cf")
            .text((d) => d.id);

        function ticked() {
            link.attr("d", (d) => {
                const sx = (d.source as GraphNode).x || 0;
                const sy = (d.source as GraphNode).y || 0;
                const tx = (d.target as GraphNode).x || 0;
                const ty = (d.target as GraphNode).y || 0;

                // Vérifie si une arête inverse existe
                const hasReverse = links.some(
                    (l) =>
                        (l.source as GraphNode).id === (d.target as GraphNode).id &&
                        (l.target as GraphNode).id === (d.source as GraphNode).id
                );

                if (hasReverse && directed) {
                    const dx = tx - sx;
                    const dy = ty - sy;
                    const dr = Math.sqrt(dx * dx + dy * dy);
                    const curveOffset = 25;

                    const nx = dy / dr;
                    const ny = -dx / dr;

                    // 🔁 Calcul stable du sens de courbure :
                    // Si (source + target) a une somme de codes ASCII paire => courbe d'un côté
                    // sinon de l'autre
                    const sumCharCodes = (
                        (d.source as GraphNode).id.charCodeAt(0) +
                        (d.target as GraphNode).id.charCodeAt(0)
                    );
                    const reverse = sumCharCodes % 2 === 0 ? 1 : -1;

                    const cx = (sx + tx) / 2 + nx * curveOffset * reverse;
                    const cy = (sy + ty) / 2 + ny * curveOffset * reverse;

                    return `M${sx},${sy} Q${cx},${cy} ${tx},${ty}`;
                } else {
                    return `M${sx},${sy} L${tx},${ty}`;
                }
            });

            label
                .attr("x", (d) => {
                    const sx = (d.source as GraphNode).x || 0;
                    const tx = (d.target as GraphNode).x || 0;
                    const sy = (d.source as GraphNode).y || 0;
                    const ty = (d.target as GraphNode).y || 0;

                    const hasReverse = links.some(
                        (l) =>
                            (l.source as GraphNode).id === (d.target as GraphNode).id &&
                            (l.target as GraphNode).id === (d.source as GraphNode).id
                    );

                    if (hasReverse && directed) {
                        const dx = tx - sx;
                        const dy = ty - sy;
                        const dr = Math.sqrt(dx * dx + dy * dy);
                        const nx = dy / dr;

                        const sumCharCodes =
                            (d.source as GraphNode).id.charCodeAt(0) +
                            (d.target as GraphNode).id.charCodeAt(0);
                        const reverse = sumCharCodes % 2 === 0 ? 1 : -1;
                        const offset = 15; // distance entre les labels opposés

                        return (sx + tx) / 2 + nx * offset * reverse;
                    }
                    return (sx + tx) / 2;
                })
                .attr("y", (d) => {
                    const sx = (d.source as GraphNode).x || 0;
                    const tx = (d.target as GraphNode).x || 0;
                    const sy = (d.source as GraphNode).y || 0;
                    const ty = (d.target as GraphNode).y || 0;

                    const hasReverse = links.some(
                        (l) =>
                            (l.source as GraphNode).id === (d.target as GraphNode).id &&
                            (l.target as GraphNode).id === (d.source as GraphNode).id
                    );

                    if (hasReverse && directed) {
                        const dx = tx - sx;
                        const dy = ty - sy;
                        const dr = Math.sqrt(dx * dx + dy * dy);
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
                    const key2 = `${(d.target as GraphNode).id}_${(d.source as GraphNode).id}`;
                    return highlightEdges?.[key1] || highlightEdges?.[key2] || "#cbd5e1";
                });


            node.attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
        }

        return () => sim.stop();
    }, [nodes, links]);

    // --- Met à jour uniquement les couleurs sans tout redessiner ---
    useEffect(() => {
        const svg = d3.select(svgRef.current);

        svg.selectAll<SVGPathElement, any>("path").attr("stroke", (d) => {
            const key1 = `${d.source.id}_${d.target.id}`;
            const key2 = `${d.target.id}_${d.source.id}`;
            return highlightEdges?.[key1] || highlightEdges?.[key2] || "#8b9bb4";
        });

        // labels d'arêtes
        svg.selectAll<SVGTextElement, any>("text.edgeLabel")
            .attr("fill", (d: any) => {
                const key1 = `${d.source.id}_${d.target.id}`;
                const key2 = `${d.target.id}_${d.source.id}`;
                return highlightEdges?.[key1] || highlightEdges?.[key2] || "#cbd5e1";
            });
    }, [highlightEdges]);


    return <svg ref={svgRef} width="100%" height="100%" />;
};

export default Graph;
