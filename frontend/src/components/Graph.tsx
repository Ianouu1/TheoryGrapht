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
}

const Graph: React.FC<GraphProps> = ({ nodes, links, highlightEdges }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const simRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null);

    useEffect(() => {
        if (!svgRef.current) return;
    if (!nodes || nodes.length === 0) return;

        try {
            const width = svgRef.current.clientWidth || 800;
            const height = svgRef.current.clientHeight || 600;
            
            if (width === 0 || height === 0) {
                console.warn("Graph container has zero dimensions");
                return;
            }

            const svg = d3.select(svgRef.current);
            svg.selectAll("*").remove();

            const gZoom = svg.append("g");
            const linkLayer = gZoom.append("g");
            const labelLayer = gZoom.append("g");
            const nodeLayer = gZoom.append("g");

            // Zoom / Pan
            const zoom = d3
                .zoom<SVGSVGElement, unknown>()
                .scaleExtent([0.5, 3])
                .on("zoom", (event) => gZoom.attr("transform", event.transform));
            svg.call(zoom);

            // Placement initial circulaire
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
                        .distance(50)
                        .strength(0.1)
                )
                .force("charge", d3.forceManyBody().strength(-600))
                .force("center", d3.forceCenter(centerX, centerY))
                .force("collision", d3.forceCollide().radius(40))
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
                ;

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
                    .attr("x", (d) => {
                        const sx = (d.source as GraphNode).x || 0;
                        const tx = (d.target as GraphNode).x || 0;
                        return (sx + tx) / 2;
                    })
                    .attr("y", (d) => {
                        const sy = (d.source as GraphNode).y || 0;
                        const ty = (d.target as GraphNode).y || 0;
                        return (sy + ty) / 2;
                    })
                ;

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
                .attr('font-weight', 'bold')
                .attr("fill", "#4f88cf")
                .text((d: any) => d.id);

            function ticked() {
                link.attr("d", (d) => {
                    const sx = (d.source as GraphNode).x || 0;
                    const sy = (d.source as GraphNode).y || 0;
                    const tx = (d.target as GraphNode).x || 0;
                    const ty = (d.target as GraphNode).y || 0;
                    return `M${sx},${sy} L${tx},${ty}`;
                });

                label
                    .attr("x", (d) => {
                        const sx = (d.source as GraphNode).x || 0;
                        const tx = (d.target as GraphNode).x || 0;
                        return (sx + tx) / 2;
                    })
                    .attr("y", (d) => {
                        const sy = (d.source as GraphNode).y || 0;
                        const ty = (d.target as GraphNode).y || 0;
                        return (sy + ty) / 2;
                    })
                    .attr("fill", (d) => {
                        const key1 = `${(d.source as GraphNode).id}_${(d.target as GraphNode).id}`;
                        const key2 = `${(d.target as GraphNode).id}_${(d.source as GraphNode).id}`;
                        return highlightEdges?.[key1] || highlightEdges?.[key2] || "#cbd5e1";
                    });

                node.attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
            }

            return () => {
                if (simRef.current) {
                    simRef.current.stop();
                }
            };
        } catch (error) {
            console.error("Erreur lors du rendu du graphe:", error);
        }
    }, [nodes, links]);

    // Met à jour uniquement les couleurs
    useEffect(() => {
        if (!svgRef.current) return;
        
        try {
            const svg = d3.select(svgRef.current);

            svg.selectAll<SVGPathElement, any>("path").attr("stroke", (d: any) => {
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
        } catch (error) {
            console.error("Erreur lors de la mise à jour des couleurs:", error);
        }
    }, [highlightEdges]);


    return <svg ref={svgRef} width="100%" height="100%" />;
};

export default Graph;
