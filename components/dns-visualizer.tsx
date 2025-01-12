"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Server, Globe, Database, Laptop, ArrowRight, ArrowLeft, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DNSNode {
  id: string;
  icon: typeof Server | typeof Globe | typeof Database | typeof Laptop;
  label: string;
  description: string;
  beginnerDetails: string[];
  intermediateDetails: string[];
  advancedDetails: string[];
  color: string;
}

const nodes: DNSNode[] = [
  {
    id: "local",
    icon: Laptop,
    label: "Local DNS Cache",
    description: "Browser & System Cache",
    color: "bg-blue-100 hover:bg-blue-200",
    beginnerDetails: [
      "Your browser and computer store recent DNS lookups to speed up future visits.",
      "Think of it like a phonebook you keep at home for frequently called numbers.",
      "If the address is found here, your browser doesn't need to ask anyone else."
    ],
    intermediateDetails: [
      "Browser Cache: Chrome (chrome://net-internals/#dns), Firefox (about:networking#dns)",
      "OS Cache: Windows (ipconfig /displaydns), Linux (systemd-resolve --statistics)",
      "TTL (Time to Live) determines how long the cache stores the DNS record.",
      "Cache is cleared when you restart your browser or system."
    ],
    advancedDetails: [
      "Memory-based storage for ultra-fast lookups (~0-1ms response time).",
      "Reduces DNS traffic and improves overall browsing speed.",
      "Cache poisoning attacks can exploit poorly secured DNS caches."
    ]
  },
  {
    id: "resolver",
    icon: Server,
    label: "DNS Resolver",
    description: "Recursive Resolver",
    color: "bg-green-100 hover:bg-green-200",
    beginnerDetails: [
      "If your local cache doesn't have the address, your browser asks your ISP's DNS server.",
      "This server acts like a librarian who knows where to find the information.",
      "It keeps its own cache of recent lookups to speed up the process."
    ],
    intermediateDetails: [
      "ISP's DNS server (e.g., 8.8.8.8 for Google DNS).",
      "Handles recursive resolution by querying multiple DNS servers.",
      "Cache duration: Minutes to days, depending on TTL.",
      "Response time: ~5-50ms."
    ],
    advancedDetails: [
      "Uses iterative queries to resolve domain names.",
      "Supports DNSSEC (DNS Security Extensions) for secure lookups.",
      "Can be configured to use public DNS services like Cloudflare or Google DNS."
    ]
  },
  {
    id: "root",
    icon: Globe,
    label: "Root Nameservers",
    description: "DNS Root Zone",
    color: "bg-purple-100 hover:bg-purple-200",
    beginnerDetails: [
      "If the resolver doesn't know the address, it asks the root servers.",
      "These servers are like the 'phonebook of phonebooks' for the internet.",
      "They don't have the exact address but know where to direct the query."
    ],
    intermediateDetails: [
      "13 root nameserver systems (a.root-servers.net to m.root-servers.net).",
      "Operated by 12 organizations worldwide.",
      "Uses anycast routing for high availability.",
      "Response time: ~30-100ms."
    ],
    advancedDetails: [
      "Root servers manage the DNS root zone, which contains information about TLDs.",
      "Anycast routing ensures queries are routed to the nearest server.",
      "Root servers are critical to the internet's infrastructure."
    ]
  },
  {
    id: "tld",
    icon: Database,
    label: "TLD Nameservers",
    description: "Top Level Domains",
    color: "bg-yellow-100 hover:bg-yellow-200",
    beginnerDetails: [
      "The root server directs the query to the TLD server (e.g., .com, .org).",
      "These servers know where to find the authoritative server for the domain.",
      "Think of them as the 'department heads' of the internet."
    ],
    intermediateDetails: [
      "Manages specific TLDs (.com, .org, etc.).",
      "Operated by registry operators (e.g., Verisign for .com).",
      "Contains NS (Name Server) records for domains.",
      "Response time: ~30-100ms."
    ],
    advancedDetails: [
      "TLD servers use delegation to point to authoritative servers.",
      "Supports DNSSEC for secure domain lookups.",
      "TLD operators enforce domain registration policies."
    ]
  },
  {
    id: "auth",
    icon: Server,
    label: "Authoritative DNS",
    description: "Domain's Nameserver",
    color: "bg-orange-100 hover:bg-orange-200",
    beginnerDetails: [
      "The TLD server directs the query to the domain's authoritative server.",
      "This server has the final answer: the IP address of the website.",
      "Think of it as the 'owner' of the domain's address book."
    ],
    intermediateDetails: [
      "Hosted by the domain's DNS provider (e.g., Cloudflare, AWS Route 53).",
      "Contains actual DNS records (A, AAAA, MX, etc.).",
      "Final source of DNS truth for the domain.",
      "Response time: ~30-150ms."
    ],
    advancedDetails: [
      "Supports zone transfers for replication across multiple servers.",
      "Uprises DNSSEC for secure DNS responses.",
      "Can be configured for load balancing and failover."
    ]
  }
];

interface DNSVisualizerProps {
  currentStep: number;
  onStepChange?: (step: number) => void;
  totalSteps: number;
}

export function DNSVisualizer({ currentStep, onStepChange, totalSteps }: DNSVisualizerProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [forwardActive, setForwardActive] = useState(true);
  const [returnPath, setReturnPath] = useState(false);

  useEffect(() => {
    if (currentStep >= 4) {
      setReturnPath(true);
      setForwardActive(false);
    } else {
      setReturnPath(false);
      setForwardActive(true);
    }
  }, [currentStep]);

  useEffect(() => {
    const currentNodeIndex = getCurrentNodeIndex();
    setSelectedNode(nodes[currentNodeIndex].id);
  }, [currentStep]);

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId);
  };

  const getCurrentNodeIndex = () => {
    const cycleLength = nodes.length;
    if (currentStep < cycleLength) {
      return currentStep;
    } else {
      return nodes.length - 1 - (currentStep - cycleLength);
    }
  };

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">DNS Resolution</h2>
          <div className="flex items-center justify-between mt-2">
            <p className="text-gray-600">
              {getDetailedStepDescription(currentStep)}
            </p>
            <div className="text-sm font-mono bg-gray-100 px-3 py-1 rounded">
              {getEstimatedTime(currentStep)}ms
            </div>
          </div>
        </div>

        <div className="flex-1 p-8 bg-gradient-to-b from-gray-50 to-white relative">
          {/* Move cycle indicator to the right side of the progress bar */}
          <div className="flex items-center justify-between gap-4 mb-8">
            <div className="flex-1">
              <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                <span>Query Start</span>
                <span>Resolution Progress</span>
                <span>Response Complete</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <motion.div
                  className="h-full bg-blue-500 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${(currentStep / (nodes.length * 2 - 1)) * 100}%` }}
                />
              </div>
            </div>
            <div className="flex-shrink-0 bg-gray-100 px-3 py-1 rounded-full text-sm whitespace-nowrap">
              Cycle: {Math.floor(currentStep / nodes.length) + 1} • Phase: {currentStep < nodes.length ? 'Query' : 'Response'}
            </div>
          </div>

          <div className="flex justify-between items-center gap-8 px-12 mt-16">
            {nodes.map((node, index) => (
              <div key={node.id} className="relative">
                {index < nodes.length - 1 && (
                  <motion.div
                    className="absolute -right-12 top-1/2 transform -translate-y-1/2"
                    initial={false}
                    animate={{
                      opacity: currentStep < nodes.length && index < getCurrentNodeIndex() ? 1 : 0.2,
                      scale: currentStep < nodes.length && index === getCurrentNodeIndex() - 1 ? [1, 1.2, 1] : 1
                    }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <ArrowRight className="w-6 h-6 text-blue-500" />
                  </motion.div>
                )}

                {index > 0 && (
                  <motion.div
                    className="absolute -left-12 top-1/2 transform -translate-y-1/2"
                    initial={false}
                    animate={{
                      opacity: currentStep >= nodes.length && index <= getCurrentNodeIndex() ? 1 : 0.2,
                      scale: currentStep >= nodes.length && index === getCurrentNodeIndex() + 1 ? [1, 1.2, 1] : 1
                    }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <ArrowLeft className="w-6 h-6 text-green-500" />
                  </motion.div>
                )}

                <motion.div
                  className={`
                    relative p-6 rounded-xl shadow-lg cursor-pointer
                    ${node.color}
                    ${index === getCurrentNodeIndex() ? 'ring-2 ring-blue-500 scale-105' : ''}
                    ${currentStep >= nodes.length && index < getCurrentNodeIndex() ? 'border-2 border-green-500' : ''}
                  `}
                  onClick={() => handleNodeClick(node.id)}
                  whileHover={{ scale: 1.05 }}
                >
                  <node.icon className="w-8 h-8 mb-3" />
                  <div className="font-medium text-center">{node.label}</div>
                  <div className="text-sm text-gray-600 text-center">{node.description}</div>
                  
                  {currentStep >= nodes.length && index <= getCurrentNodeIndex() && (
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
                  )}
                </motion.div>
              </div>
            ))}
          </div>

          <AnimatePresence>
            {selectedNode && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-8 left-8 right-8 bg-white p-6 rounded-xl shadow-lg border border-gray-200"
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
                    <Tabs defaultValue="beginner">
                      <TabsList className="mb-4">
                        <TabsTrigger value="beginner">Beginner</TabsTrigger>
                        <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
                        <TabsTrigger value="advanced">Advanced</TabsTrigger>
                      </TabsList>
                      <TabsContent value="beginner">
                        <ul className="space-y-2">
                          {nodes.find(n => n.id === selectedNode)?.beginnerDetails.map((detail, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
                              <span className="text-gray-600">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </TabsContent>
                      <TabsContent value="intermediate">
                        <ul className="space-y-2">
                          {nodes.find(n => n.id === selectedNode)?.intermediateDetails.map((detail, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2" />
                              <span className="text-gray-600">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </TabsContent>
                      <TabsContent value="advanced">
                        <ul className="space-y-2">
                          {nodes.find(n => n.id === selectedNode)?.advancedDetails.map((detail, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2" />
                              <span className="text-gray-600">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function getDetailedStepDescription(step: number): string {
  const forwardSteps = [
    "Starting DNS resolution process by checking local caches...",
    "Cache miss! Querying recursive resolver (e.g., 8.8.8.8)...",
    "Resolver contacts root nameservers for TLD information...",
    "Root nameserver directs to .com/.org/.net TLD servers...",
    "TLD nameserver locates authoritative DNS server..."
  ];

  const backwardSteps = [
    "Authoritative server responds with IP address...",
    "Response travels back through TLD server...",
    "Root server validates and forwards response...",
    "Resolver caches result for future queries...",
    "Local DNS cache updated, resolution complete!"
  ];

  const cycleLength = 5; // number of nodes
  const isForwardPhase = step < cycleLength;

  return isForwardPhase 
    ? forwardSteps[step] 
    : backwardSteps[step - cycleLength];
}

function getEstimatedTime(step: number): number {
  // Cumulative time estimates in milliseconds
  const times = [1, 20, 50, 100, 150, 200, 220, 250];
  return times[step] || 0;
}