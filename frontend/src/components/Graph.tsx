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
            .selectAll("line")
            .data(links)
            .enter()
            .append("line")
            .attr("stroke", "#8b9bb4")
            .attr("stroke-opacity", 0.8)
            .attr("stroke-width", (d) => Math.max(1.5, Math.sqrt(d.weight || 1)));

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
            link
                .attr("x1", (d) => (d.source as GraphNode).x || 0)
                .attr("y1", (d) => (d.source as GraphNode).y || 0)
                .attr("x2", (d) => (d.target as GraphNode).x || 0)
                .attr("y2", (d) => (d.target as GraphNode).y || 0)
                .attr("stroke", (d) => {
                    const key1 = `${(d.source as GraphNode).id}_${(d.target as GraphNode).id}`;
                    const key2 = `${(d.target as GraphNode).id}_${(d.source as GraphNode).id}`;
                    return highlightEdges?.[key1] || highlightEdges?.[key2] || "#8b9bb4";
                });

            label
                .attr("x", (d) => ((d.source as GraphNode).x! + (d.target as GraphNode).x!) / 2)
                .attr("y", (d) => ((d.source as GraphNode).y! + (d.target as GraphNode).y!) / 2)
                .attr("fill", (d) => {
                    const key1 = `${(d.source as GraphNode).id}_${(d.target as GraphNode).id}`;
                    const key2 = `${(d.target as GraphNode).id}_${(d.source as GraphNode).id}`;
                    return (highlightEdges?.[key1] || highlightEdges?.[key2] || "#cbd5e1");
                });

            node.attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
        }

        return () => sim.stop();
    }, [nodes, links]);

    // --- Met à jour uniquement les couleurs sans tout redessiner ---
    useEffect(() => {
        const svg = d3.select(svgRef.current);

        svg.selectAll("line").attr("stroke", (d: any) => {
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
