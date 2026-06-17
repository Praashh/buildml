"use client";

import { useEffect, useRef } from "react";

interface Node {
	x: number;
	y: number;
	vx: number;
	vy: number;
	color: "white" | "red" | "yellow";
	size: number;
}

interface Edge {
	from: number;
	to: number;
}

export function NeuralNetwork() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const nodesRef = useRef<Node[]>([]);
	const edgesRef = useRef<Edge[]>([]);
	const animationRef = useRef<number>(0);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const resizeCanvas = () => {
			canvas.width = canvas.offsetWidth * 2;
			canvas.height = canvas.offsetHeight * 2;
			ctx.scale(2, 2);
		};

		resizeCanvas();
		window.addEventListener("resize", resizeCanvas);

		// Initialize nodes
		const nodeCount = 35;
		const nodes: Node[] = [];
		const colors: ("white" | "red" | "yellow")[] = ["white", "red", "yellow"];

		for (let i = 0; i < nodeCount; i++) {
			nodes.push({
				x: Math.random() * canvas.offsetWidth * 0.8 + canvas.offsetWidth * 0.1,
				y:
					Math.random() * canvas.offsetHeight * 0.8 + canvas.offsetHeight * 0.1,
				vx: (Math.random() - 0.5) * 0.3,
				vy: (Math.random() - 0.5) * 0.3,
				color: colors[Math.floor(Math.random() * 3)] ?? "white",
				size: Math.random() * 4 + 4,
			});
		}
		nodesRef.current = nodes;

		const edges: Edge[] = [];
		for (let i = 0; i < nodes.length; i++) {
			const nodeA = nodes[i];
			if (!nodeA) continue;
			for (let j = i + 1; j < nodes.length; j++) {
				const nodeB = nodes[j];
				if (!nodeB) continue;
				const dx = nodeA.x - nodeB.x;
				const dy = nodeA.y - nodeB.y;
				const dist = Math.sqrt(dx * dx + dy * dy);
				if (dist < 120) {
					edges.push({ from: i, to: j });
				}
			}
		}
		edgesRef.current = edges;

		const animate = () => {
			ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

			// Update node positions
			for (const node of nodesRef.current) {
				node.x += node.vx;
				node.y += node.vy;

				// Bounce off walls
				if (node.x < 20 || node.x > canvas.offsetWidth - 20) {
					node.vx *= -1;
					node.x = Math.max(20, Math.min(canvas.offsetWidth - 20, node.x));
				}
				if (node.y < 20 || node.y > canvas.offsetHeight - 20) {
					node.vy *= -1;
					node.y = Math.max(20, Math.min(canvas.offsetHeight - 20, node.y));
				}
			}

			// Recalculate edges based on proximity
			edgesRef.current = [];
			for (let i = 0; i < nodesRef.current.length; i++) {
				for (let j = i + 1; j < nodesRef.current.length; j++) {
					const nodeA = nodesRef.current[i]!;
					const nodeB = nodesRef.current[j]!;
					const dx = nodeA.x - nodeB.x;
					const dy = nodeA.y - nodeB.y;
					const dist = Math.sqrt(dx * dx + dy * dy);
					if (dist < 100) {
						edgesRef.current.push({ from: i, to: j });
					}
				}
			}

			// Draw edges
			ctx.strokeStyle = "rgba(100, 100, 100, 0.6)";
			ctx.lineWidth = 1;
			for (const edge of edgesRef.current) {
				const fromNode = nodesRef.current[edge.from];
				const toNode = nodesRef.current[edge.to];
				if (fromNode && toNode) {
					ctx.beginPath();
					ctx.moveTo(fromNode.x, fromNode.y);
					ctx.lineTo(toNode.x, toNode.y);
					ctx.stroke();
				}
			}

			// Draw nodes
			for (const node of nodesRef.current) {
				ctx.beginPath();
				ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);

				if (node.color === "white") {
					ctx.fillStyle = "#ffffff";
				} else if (node.color === "red") {
					ctx.fillStyle = "#f59e0b"; // amber-500
				} else {
					ctx.fillStyle = "#eab308"; // yellow-500
				}

				ctx.fill();

				// Add glow effect
				ctx.shadowColor =
					node.color === "white"
						? "#ffffff"
						: node.color === "red"
							? "#f59e0b"
							: "#eab308";
				ctx.shadowBlur = 10;
				ctx.fill();
				ctx.shadowBlur = 0;
			}

			animationRef.current = requestAnimationFrame(animate);
		};

		animate();

		return () => {
			window.removeEventListener("resize", resizeCanvas);
			cancelAnimationFrame(animationRef.current);
		};
	}, []);

	return (
		<canvas
			className="h-full w-full"
			ref={canvasRef}
			style={{ display: "block" }}
		/>
	);
}
