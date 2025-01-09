"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Server, Database, Globe, Network, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProcessingStep {
  id: string;
  title: string;
  description: string;
  icon: typeof Server | typeof Database | typeof Globe | typeof Network;
  details: string[];
  metrics?: {
    label: string;
    value: string;
    color: string;
  }[];
}

const steps: ProcessingStep[] = [
  {
    id: "load-balancing",
    title: "Load Balancing",
    description: "Request distribution",
    icon: Network,
    details: [
      "Geographic routing (closest server)",
      "Health check verification",
      "Load distribution algorithm",
      "SSL/TLS termination"
    ],
    metrics: [
      { label: "Response Time", value: "45ms", color: "bg-green-500" },
      { label: "Server Load", value: "42%", color: "bg-blue-500" },
      { label: "Active Connections", value: "1.2k", color: "bg-purple-500" }
    ]
  },
  {
    id: "application",
    title: "Application Logic",
    description: "Business logic processing",
    icon: Server,
    details: [
      "Request validation",
      "Authentication check",
      "Business rules application",
      "Data transformation"
    ],
    metrics: [
      { label: "Processing Time", value: "120ms", color: "bg-yellow-500" },
      { label: "Memory Usage", value: "64%", color: "bg-red-500" },
      { label: "Cache Hit Rate", value: "89%", color: "bg-green-500" }
    ]
  },
  {
    id: "database",
    title: "Database Operations",
    description: "Data retrieval and storage",
    icon: Database,
    details: [
      "Query optimization",
      "Transaction management",
      "Data consistency checks",
      "Cache layer interaction"
    ],
    metrics: [
      { label: "Query Time", value: "35ms", color: "bg-blue-500" },
      { label: "Rows Processed", value: "1.5k", color: "bg-purple-500" },
      { label: "Index Usage", value: "95%", color: "bg-green-500" }
    ]
  },
  {
    id: "response",
    title: "Response Preparation",
    description: "Format and optimize response",
    icon: Globe,
    details: [
      "Data serialization",
      "Compression",
      "Cache headers",
      "Content optimization"
    ],
    metrics: [
      { label: "Response Size", value: "24kb", color: "bg-orange-500" },
      { label: "Compression Ratio", value: "68%", color: "bg-blue-500" },
      { label: "Total Time", value: "215ms", color: "bg-green-500" }
    ]
  }
];

export function ServerProcessing() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCompleted([...completed, steps[currentStep].id]);
      setCurrentStep(currentStep + 1);
    } else {
      setCompleted([...completed, steps[currentStep].id]);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setCompleted([]);
  };

  return (
    <div className="w-full h-[calc(100vh-7rem)] bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="p-8 border-b flex-shrink-0">
          <h2 className="text-2xl font-bold mb-4">Server-Side Processing</h2>
          <p className="text-gray-600">
            Explore how your request is processed through various server components
            before sending back a response.
          </p>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-8 p-8 bg-gray-50 overflow-hidden">
          {/* Steps section with scroll */}
          <div className="space-y-6 overflow-y-auto pr-4 max-h-[calc(100vh-15rem)] custom-scrollbar">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = completed.includes(step.id);

              return (
                <motion.div
                  key={step.id}
                  className={`p-6 rounded-xl border-2 transition-colors ${
                    isActive
                      ? "border-blue-500 bg-blue-50"
                      : isCompleted
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200"
                  }`}
                  animate={{
                    scale: isActive ? 1.02 : 1,
                    opacity: index > currentStep ? 0.5 : 1
                  }}>
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`p-2 rounded-lg ${
                        isActive
                          ? "bg-blue-100"
                          : isCompleted
                          ? "bg-green-100"
                          : "bg-gray-100"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{step.title}</h3>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                    {isCompleted && (
                      <CheckCircle2 className="w-6 h-6 text-green-500 ml-auto" />
                    )}
                  </div>
                  {(isActive || isCompleted) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4 mt-4"
                    >
                      <ul className="space-y-2 ml-12">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                      {step.metrics && (
                        <div className="grid grid-cols-3 gap-4 mt-4">
                          {step.metrics.map((metric, i) => (
                            <div
                              key={i}
                              className="bg-white p-3 rounded-lg border text-center"
                            >
                              <div className="text-sm text-gray-600 mb-1">
                                {metric.label}
                              </div>
                              <div className="flex items-center justify-center gap-2">
                                <div
                                  className={`w-2 h-2 rounded-full ${metric.color}`}
                                />
                                <span className="font-medium">{metric.value}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Fixed status panel */}
          <div className="space-y-6 h-fit">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Processing Status</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span>
                    Steps Completed: {completed.length} / {steps.length}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span>
                    {completed.length === steps.length
                      ? "Processing Complete! 🎉"
                      : `Current Step: ${steps[currentStep].title}`}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleNext}
                disabled={completed.length === steps.length}
                className="flex-1"
              >
                {completed.length === steps.length ? "Completed" : "Next Step"}
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={completed.length === 0}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}