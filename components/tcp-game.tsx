"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Network, Server, ArrowRight, CheckCircle2, XCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Step {
  id: string;
  name: string;
  from: "client" | "server";
  to: "client" | "server";
  flags: string[];
  seq?: string;
  ack?: string;
  description: string;
  details: string[];
  code: string;
}

const steps: Step[] = [
  {
    id: "syn",
    name: "SYN",
    from: "client",
    to: "server",
    flags: ["SYN"],
    seq: "x",
    description: "Client initiates connection",
    details: [
      "Initial sequence number (ISN) is randomly generated",
      "SYN flag indicates connection request",
      "No data transfer occurs in this step",
      "Client enters SYN-SENT state"
    ],
    code: `socket.connect((host, port), () => {
  // Send SYN packet
  const isn = generateRandomSequence();
  sendTCPPacket({
    flags: { SYN: true },
    seq: isn
  });
});`
  },
  {
    id: "syn-ack",
    name: "SYN-ACK",
    from: "server",
    to: "client",
    flags: ["SYN", "ACK"],
    seq: "y",
    ack: "x + 1",
    description: "Server acknowledges & responds",
    details: [
      "Server generates its own sequence number",
      "Acknowledges client's sequence number",
      "Both SYN and ACK flags are set",
      "Server enters SYN-RECEIVED state"
    ],
    code: `server.on('connection', (socket) => {
  // Receive SYN, send SYN-ACK
  socket.on('SYN', (clientSeq) => {
    const serverSeq = generateRandomSequence();
    sendTCPPacket({
      flags: { SYN: true, ACK: true },
      seq: serverSeq,
      ack: clientSeq + 1
    });
  });
});`
  },
  {
    id: "ack",
    name: "ACK",
    from: "client",
    to: "server",
    flags: ["ACK"],
    ack: "y + 1",
    description: "Client confirms connection",
    details: [
      "Acknowledges server's sequence number",
      "Connection is now established",
      "Both sides enter ESTABLISHED state",
      "Data transfer can begin"
    ],
    code: `socket.on('SYN-ACK', (serverSeq, serverAck) => {
  // Send final ACK
  sendTCPPacket({
    flags: { ACK: true },
    ack: serverSeq + 1
  });
  // Connection established!
  socket.state = 'ESTABLISHED';
});`
  }
];

export function TCPGame() {
  const [currentStep, setCurrentStep] = useState(0);
  const [userStep, setUserStep] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const handleStepClick = (index: number) => {
    if (index === currentStep) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
        setUserStep(null);
      } else {
        setShowSuccess(true);
      }
    } else {
      setUserStep(index);
    }
  };

  return (
    <div className="w-full h-[calc(100vh-7rem)] bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="p-8 border-b">
          <h2 className="text-2xl font-bold mb-4">TCP Three-Way Handshake</h2>
          <p className="text-gray-600">
            Establish a TCP connection by selecting the correct sequence of steps.
            Each step must be chosen in the right order to complete the handshake.
          </p>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-8 p-8 bg-gray-50 overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            {steps.map((step, index) => (
              <motion.button
                key={step.id}
                className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                  userStep === index && index !== currentStep
                    ? "border-red-500 bg-red-50"
                    : index < currentStep
                    ? "border-green-500 bg-green-50"
                    : index === currentStep
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                    : "border-gray-200 hover:border-blue-200"
                }`}
                onClick={() => handleStepClick(index)}
                whileHover={{ scale: 1.02 }}
                disabled={index < currentStep}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xl font-semibold">{step.name}</div>
                  {index < currentStep && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                </div>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {step.flags.map(flag => (
                      <span key={flag} className="px-2 py-1 bg-white rounded-md text-sm font-medium">
                        {flag}
                      </span>
                    ))}
                  </div>
                  {(step.seq || step.ack) && (
                    <div className="grid grid-cols-2 gap-4">
                      {step.seq && (
                        <div className="bg-blue-50 p-2 rounded-md">
                          <span className="text-blue-600 font-medium">SEQ = </span>
                          {step.seq}
                        </div>
                      )}
                      {step.ack && (
                        <div className="bg-green-50 p-2 rounded-md">
                          <span className="text-green-600 font-medium">ACK = </span>
                          {step.ack}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="text-sm text-gray-600">{step.description}</div>
                </div>
              </motion.button>
            ))}
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Current Step Details</h3>
              <ul className="space-y-2">
                {steps[currentStep].details.map((detail, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
                    <span className="text-gray-600">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-900 p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Implementation Example</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                  onClick={() => setShowCode(!showCode)}
                >
                  {showCode ? "Hide Code" : "Show Code"}
                </Button>
              </div>
              {showCode && (
                <pre className="text-sm text-gray-300 overflow-x-auto custom-scrollbar">
                  <code>{steps[currentStep].code}</code>
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white p-8 rounded-xl max-w-md"
            >
              <div className="text-center">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4">Connection Established! 🎉</h3>
                <p className="text-gray-600 mb-6">
                  Congratulations! You've successfully completed the TCP three-way handshake.
                  The connection is now ready for secure data transfer.
                </p>
                <Button
                  onClick={() => {
                    setShowSuccess(false);
                    setCurrentStep(0);
                    setUserStep(null);
                    setShowCode(false);
                  }}
                  className="w-full"
                  size="lg"
                >
                  Try Again
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}