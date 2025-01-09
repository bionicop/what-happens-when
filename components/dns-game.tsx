"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, Server, Laptop, Globe, CheckCircle2, AlertCircle } from "lucide-react";

interface DNSNode {
  id: string;
  type: "client" | "local" | "root" | "tld" | "authoritative";
  label: string;
  description: string;
  position: { x: number; y: number };
}

interface Connection {
  from: string;
  to: string;
  isActive: boolean;
  isCorrect: boolean;
}

const nodes: DNSNode[] = [
  {
    id: "client",
    type: "client",
    label: "Your Browser",
    description: "Starts the DNS lookup",
    position: { x: 100, y: 300 }
  },
  {
    id: "local",
    type: "local",
    label: "Local DNS",
    description: "Your ISP's resolver",
    position: { x: 300, y: 300 }
  },
  {
    id: "root",
    type: "root",
    label: "Root Server",
    description: "Directs to TLD",
    position: { x: 500, y: 150 }
  },
  {
    id: "tld",
    type: "tld",
    label: "TLD Server",
    description: ".com, .org, etc.",
    position: { x: 500, y: 300 }
  },
  {
    id: "auth",
    type: "authoritative",
    label: "Authoritative",
    description: "Has the IP address",
    position: { x: 500, y: 450 }
  }
];

const correctSequence = [
  ["client", "local"],
  ["local", "root"],
  ["root", "tld"],
  ["tld", "auth"],
  ["auth", "tld"],
  ["tld", "local"],
  ["local", "client"]
];

export function DNSGame() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  const isConnectionValid = (from: string, to: string) => {
    const step = correctSequence[currentStep];
    return (step[0] === from && step[1] === to) || (step[1] === from && step[0] === to);
  };

  const handleNodeClick = (nodeId: string) => {
    if (!selectedNode) {
      setSelectedNode(nodeId);
      setError(null);
    } else if (selectedNode === nodeId) {
      setSelectedNode(null);
    } else {
      if (isConnectionValid(selectedNode, nodeId)) {
        const newConnection = {
          from: selectedNode,
          to: nodeId,
          isActive: true,
          isCorrect: true
        };
        setConnections(prev => [...prev, newConnection]);
        setCurrentStep(prev => prev + 1);
        setError(null);
      } else {
        setError("Incorrect connection! Try following the DNS resolution sequence.");
        setTimeout(() => setError(null), 2000);
      }
      setSelectedNode(null);
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "client": return <Laptop className="w-8 h-8" />;
      case "local": return <Server className="w-8 h-8" />;
      case "root": return <Globe className="w-8 h-8" />;
      case "tld": return <Database className="w-8 h-8" />;
      case "authoritative": return <Server className="w-8 h-8" />;
      default: return <Server className="w-8 h-8" />;
    }
  };

  const renderNode = (node: DNSNode) => {
    const isSelected = selectedNode === node.id;
    const isConnected = connections.some(
      conn => conn.from === node.id || conn.to === node.id
    );

    return (
      <motion.div
        key={node.id}
        className={`absolute cursor-pointer transition-all duration-200 ${
          isSelected ? "ring-4 ring-blue-500" : ""
        } ${isConnected ? "opacity-100" : "opacity-80"}`}
        style={{ left: node.position.x, top: node.position.y }}
        whileHover={{ scale: 1.05 }}
        onClick={() => handleNodeClick(node.id)}
      >
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            {getNodeIcon(node.type)}
            <div>
              <div className="font-semibold">{node.label}</div>
              <div className="text-xs text-gray-500">{node.description}</div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderConnection = (connection: Connection) => {
    const fromNode = nodes.find(n => n.id === connection.from)!;
    const toNode = nodes.find(n => n.id === connection.to)!;

    const dx = toNode.position.x - fromNode.position.x;
    const dy = toNode.position.y - fromNode.position.y;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    const length = Math.sqrt(dx * dx + dy * dy);

    return (
      <motion.div
        key={`${connection.from}-${connection.to}`}
        className={`absolute h-1 origin-left ${
          connection.isCorrect ? "bg-green-500" : "bg-red-500"
        }`}
        style={{
          left: fromNode.position.x + 50,
          top: fromNode.position.y + 25,
          width: length,
          transform: `rotate(${angle}deg)`
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
      />
    );
  };

  return (
    <div className="relative w-full h-[600px] bg-gray-50 rounded-lg p-8">
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 gap-4 pointer-events-none">
        {Array.from({ length: 72 }).map((_, i) => (
          <div key={i} className="border border-gray-100" />
        ))}
      </div>

      {connections.map(renderConnection)}
      {nodes.map(renderNode)}

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-700 px-4 py-2 rounded-full flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg">
        <div className="text-sm font-medium mb-2">
          Progress: {currentStep} / {correctSequence.length} steps
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-sm text-blue-500 hover:underline"
          >
            {showHint ? "Hide Hint" : "Need a hint?"}
          </button>
        </div>
        {showHint && (
          <div className="mt-2 text-sm text-gray-600">
            Start from your browser and connect to the Local DNS first.
            Follow the DNS hierarchy up through Root, TLD, and Authoritative servers.
          </div>
        )}
      </div>
    </div>
  );
}