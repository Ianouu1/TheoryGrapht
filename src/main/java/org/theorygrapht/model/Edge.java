package org.theorygrapht.model;

public class Edge {
	private Vertex source;
	private Vertex target;
	private int weight;

	public Edge(Vertex source, Vertex target, int distance) {
		this.source = source;
		this.target = target;
		this.weight = distance;
	}

	public Vertex getSource() {
		return source;
	}

	public Vertex getTarget() {
		return target;
	}

	public int getWeight() {
		return weight;
	}

	@Override
	public String toString() {
		return source.getName() + " - " + target.getName() + " (" + weight + ")\n";
	}

}
