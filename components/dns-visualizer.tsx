"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Server, Globe, Database, Laptop, ArrowRight, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DNSNode {
  id: string;
  icon: typeof Server | typeof Globe | typeof Database | typeof Laptop;
  label: string;
  description: string;
  details: string[];
  color: string;
}

const nodes: DNSNode[] = [
  {
    id: "browser",
    icon: Laptop,
    label: "Your Browser",
    description: "Starts the DNS lookup process",
    color: "bg-blue-100 hover:bg-blue-200",
    details: [
      "Initiates the DNS resolution process",
      "Sends the domain name query to Local DNS",
      "Caches DNS responses for future use",
      "Handles final IP address for connection"
    ]
  },
  {
    id: "local",
    icon: Server,
    label: "Local DNS",
    description: "Your ISP's DNS resolver",
    color: "bg-green-100 hover:bg-green-200",
    details: [
      "Managed by your Internet Service Provider",
      "Acts as a recursive resolver",
      "Maintains a cache of recent queries",
      "Communicates with other DNS servers"
    ]
  },
  {
    id: "root",
    icon: Globe,
    label: "Root Server",
    description: "Knows about top-level domains",
    color: "bg-purple-100 hover:bg-purple-200",
    details: [
      "13 sets of root servers worldwide",
      "Manages top-level domain information",
      "Critical internet infrastructure",
      "Operated by various organizations"
    ]
  },
  {
    id: "tld",
    icon: Database,
    label: "TLD Server",
    description: "Manages .com, .org, etc.",
    color: "bg-orange-100 hover:bg-orange-200",
    details: [
      "Manages specific top-level domains",
      "Examples: .com, .org, .net, etc.",
      "Directs to authoritative servers",
      "Operated by domain registries"
    ]
  },
  {
    id: "auth",
    icon: Server,
    label: "Authoritative",
    description: "Has the actual IP address",
    color: "bg-pink-100 hover:bg-pink-200",
    details: [
      "Contains actual DNS records",
      "Managed by domain owners",
      "Provides final IP resolution",
      "Can include subdomains"
    ]
  }
];

export function DNSVisualizer() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId === selectedNode ? null : nodeId);
  };

  const handleNextStep = () => {
    setCurrentStep((prev) => (prev < nodes.length - 1 ? prev + 1 : prev));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <div className="w-full h-[calc(100vh-7rem)] bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="p-8 border-b">
          <h2 className="text-2xl font-bold mb-4">DNS Resolution Journey</h2>
          <p className="text-gray-600">
            Watch how your browser finds a website's IP address through the DNS system.
            Click on any server to learn more about its role.
          </p>
        </div>

        <div className="flex-1 p-8 bg-gray-50 relative overflow-hidden">
          {/* Progress Bar */}
          <div className="w-full h-2 bg-gray-200 rounded-full mb-8 relative">
            <motion.div
              className="h-full bg-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / (nodes.length - 1)) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* DNS Nodes with Arrows */}
          <div className="flex justify-between items-center gap-4 mb-12 relative">
            {nodes.map((node, index) => {
              const Icon = node.icon;
              const isSelected = selectedNode === node.id;
              const isActive = index === currentStep;
              const isNext = index === currentStep + 1;

              return (
                <div key={node.id} className="flex items-center">
                  <motion.div
                    className={`relative ${node.color} p-6 rounded-xl shadow-lg cursor-pointer transition-all
                      ${isSelected ? 'ring-2 ring-blue-500 scale-105' : ''}
                      ${isActive ? 'border-2 border-blue-500' : ''}
                      ${isNext ? 'border-2 border-blue-300' : ''}
                    `}
                    onClick={() => handleNodeClick(node.id)}
                    whileHover={{ scale: 1.05 }}
                    animate={{ scale: isSelected ? 1.05 : 1 }}
                  >
                    <Icon className="w-8 h-8 mb-3" />
                    <div className="font-medium mb-1">{node.label}</div>
                    <div className="text-sm text-gray-600">{node.description}</div>
                  </motion.div>

                  {index < nodes.length - 1 && (
                    <motion.div
                      className="mx-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isActive ? 1 : 0.3 }}
                      transition={{ duration: 0.5 }}
                    >
                      <ArrowRight className="w-6 h-6 text-gray-400" />
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Node Details Panel */}
          <AnimatePresence>
            {selectedNode && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-24 left-8 right-8 bg-white p-6 rounded-xl shadow-lg border border-gray-200"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${nodes.find(n => n.id === selectedNode)?.color}`}>
                    {(() => {
                      const Icon = nodes.find(n => n.id === selectedNode)?.icon || Info;
                      return <Icon className="w-6 h-6" />;
                    })()}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">
                      {nodes.find(n => n.id === selectedNode)?.label}
                    </h3>
                    <ul className="grid grid-cols-2 gap-4">
                      {nodes.find(n => n.id === selectedNode)?.details.map((detail, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          <span className="text-gray-600">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step Navigation Buttons */}
          <div className="absolute bottom-8 left-8 right-8 flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevStep}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={handleNextStep}
              disabled={currentStep === nodes.length - 1}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}