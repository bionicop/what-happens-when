"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Shield, Key, RefreshCw, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoModal } from "@/components/shared/info-modal";

interface Step {
  id: string;
  title: string;
  description: string;
  icon: typeof Lock | typeof Shield | typeof Key | typeof RefreshCw;
  content: string;
  technicalDetails: {
    protocol: string;
    implementation: string;
    security: string;
    performance: string;
  };
  developerGuide: {
    code: string;
    bestPractices: string[];
    commonIssues: string[];
    testing: string;
  };
  conceptual: {
    overview: string;
    importance: string;
    realWorldAnalogy: string;
  };
}

const steps: Step[] = [
  {
    id: "client-hello",
    title: "Client Hello",
    description: "Client initiates secure connection",
    icon: Lock,
    content: `
TLS Version: 1.3
Cipher Suites:
- TLS_AES_128_GCM_SHA256
- TLS_AES_256_GCM_SHA384
Random: d4e7b9f2...
Extensions: [
  supported_versions,
  supported_groups,
  signature_algorithms
]`,
    technicalDetails: {
      protocol: "Client sends supported TLS versions, cipher suites, and a random number for key generation",
      implementation: `const clientHello = {
  version: TLS_1_3,
  random: generateRandomBytes(32),
  cipherSuites: [
    TLS_AES_128_GCM_SHA256,
    TLS_AES_256_GCM_SHA384
  ],
  extensions: [...]
};`,
      security: "Random values ensure unique session keys. Cipher suite list enables forward secrecy.",
      performance: "Modern TLS 1.3 reduces handshake to 1-RTT, improving latency."
    },
    developerGuide: {
      code: `const tls = require('tls');
const socket = tls.connect(443, 'example.com', {
  minVersion: 'TLSv1.3',
  ciphers: 'TLS_AES_128_GCM_SHA256'
});`,
      bestPractices: [
        "Always use TLS 1.3 when possible",
        "Include strong cipher suites",
        "Implement proper error handling"
      ],
      commonIssues: [
        "Outdated TLS versions",
        "Weak cipher suites",
        "Missing error handling"
      ],
      testing: "Use tools like OpenSSL s_client to test handshake and verify cipher selection"
    },
    conceptual: {
      overview: "The Client Hello message is like introducing yourself and stating your communication preferences",
      importance: "Sets the security parameters for the entire connection",
      realWorldAnalogy: "Like presenting your ID and stating which languages you can speak"
    }
  },
  {
    id: "server-hello",
    title: "Server Hello",
    description: "Server responds with chosen parameters",
    icon: Shield,
    content: `
Selected:
- TLS 1.3
- TLS_AES_128_GCM_SHA256
Certificate Chain
Random: a1b2c3d4...
Extensions: [
  key_share,
  supported_versions
]`,
    technicalDetails: {
      protocol: "Server selects TLS version and cipher suite from client's options",
      implementation: `const serverHello = {
  version: TLS_1_3,
  selectedCipher: TLS_AES_128_GCM_SHA256,
  random: generateRandomBytes(32),
  certificate: loadCertificate()
};`,
      security: "Certificate validation is crucial for preventing MITM attacks",
      performance: "Certificate chain optimization reduces payload size"
    },
    developerGuide: {
      code: `const https = require('https');
const server = https.createServer({
  cert: fs.readFileSync('cert.pem'),
  key: fs.readFileSync('key.pem'),
  minVersion: 'TLSv1.3'
});`,
      bestPractices: [
        "Keep certificates up to date",
        "Use strong private keys",
        "Enable OCSP stapling"
      ],
      commonIssues: [
        "Expired certificates",
        "Missing intermediate certificates",
        "Incorrect private key"
      ],
      testing: "Verify certificate chain and OCSP response using OpenSSL"
    },
    conceptual: {
      overview: "Server confirms the security parameters and proves its identity",
      importance: "Establishes trust and sets final security parameters",
      realWorldAnalogy: "Like showing your business license and agreeing on a common language"
    }
  },
  {
    id: "key-exchange",
    title: "Key Exchange",
    description: "Secure key generation",
    icon: Key,
    content: `
Algorithm: X25519
Client Public: 5e6f7a8b...
Server Public: 9a8b7c6d...
Shared Secret: Computed using ECDHE`,
    technicalDetails: {
      protocol: "Uses Elliptic Curve Diffie-Hellman Ephemeral (ECDHE) for key exchange",
      implementation: `const keyPair = crypto.generateKeyPair('x25519');
const sharedSecret = crypto.computeSharedSecret(
  privateKey,
  peerPublicKey
);`,
      security: "Perfect forward secrecy ensures past communications remain secure",
      performance: "X25519 provides excellent performance and security balance"
    },
    developerGuide: {
      code: `const { publicKey, privateKey } = await crypto.subtle.generateKey(
  { name: 'ECDH', namedCurve: 'P-256' },
  true,
  ['deriveKey', 'deriveBits']
);`,
      bestPractices: [
        "Use ephemeral keys",
        "Implement secure key storage",
        "Rotate keys regularly"
      ],
      commonIssues: [
        "Key reuse",
        "Weak random number generation",
        "Improper key storage"
      ],
      testing: "Verify key exchange using Wireshark and test key derivation"
    },
    conceptual: {
      overview: "Both parties contribute to creating a shared secret without revealing it",
      importance: "Enables secure communication without pre-shared secrets",
      realWorldAnalogy: "Like mixing two colors to create a new one that only you both know"
    }
  },
  {
    id: "finished",
    title: "Finished",
    description: "Verify handshake integrity",
    icon: RefreshCw,
    content: `
Verify Handshake:
- Hash all messages
- Confirm integrity
- Begin encrypted session
Status: Complete ✓`,
    technicalDetails: {
      protocol: "Verifies handshake integrity and transitions to encrypted communication",
      implementation: `const verifyHandshake = (messages) => {
  const hash = crypto.createHash('sha256');
  messages.forEach(msg => hash.update(msg));
  return hash.digest();
};`,
      security: "Prevents tampering with handshake messages",
      performance: "Minimal overhead for security guarantee"
    },
    developerGuide: {
      code: `socket.on('secure', () => {
  const protocol = socket.getProtocol();
  const cipher = socket.getCipher();
  console.log('Secure connection established');
});`,
      bestPractices: [
        "Verify handshake completion",
        "Implement session resumption",
        "Monitor connection status"
      ],
      commonIssues: [
        "Incomplete verification",
        "Missing error handling",
        "Protocol downgrade attacks"
      ],
      testing: "Verify handshake completion and cipher selection"
    },
    conceptual: {
      overview: "Final verification that everything was done correctly",
      importance: "Ensures the integrity of the entire handshake process",
      realWorldAnalogy: "Like double-checking all security measures are in place"
    }
  }
];

export function TLSVisualizer() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [userProgress, setUserProgress] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleStepClick = (stepId: string) => {
    const expectedStep = steps[currentStep].id;
    if (stepId === expectedStep) {
      setUserProgress([...userProgress, stepId]);
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setShowSuccess(true);
      }
    } else {
      // Show error feedback
      const button = document.querySelector(`[data-step="${stepId}"]`);
      button?.classList.add("animate-shake");
      setTimeout(() => {
        button?.classList.remove("animate-shake");
      }, 500);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="w-full h-[calc(100vh-7rem)] bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">TLS Handshake Simulation</h2>
              <p className="text-gray-600 mt-1">
                Click the correct steps in sequence to complete the handshake
              </p>
            </div>
            <Button
              variant="outline"
              size="lg"
              className="gap-2"
              onClick={() => setShowInfo(true)}
            >
              <HelpCircle className="w-5 h-5" />
              Learn More
            </Button>
          </div>
        </div>

        <div className="flex-1 p-8 grid grid-cols-2 gap-8 overflow-y-auto custom-scrollbar">
          <div className="bg-gray-50 rounded-xl p-6 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-px h-full bg-gray-200 absolute" />
              <div className="w-full h-px bg-gray-200 absolute" />
            </div>
            
            <div className="relative grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="text-center font-semibold mb-8">Client</div>
                {steps.filter((_, i) => i % 2 === 0).map(step => (
                  <Button
                    key={step.id}
                    data-step={step.id}
                    variant={userProgress.includes(step.id) ? "default" : "outline"}
                    className="w-full justify-start gap-2"
                    onClick={() => handleStepClick(step.id)}
                    disabled={userProgress.includes(step.id)}
                  >
                    <step.icon className="w-4 h-4" />
                    {step.title}
                  </Button>
                ))}
              </div>

              <div className="space-y-4">
                <div className="text-center font-semibold mb-8">Server</div>
                {steps.filter((_, i) => i % 2 === 1).map(step => (
                  <Button
                    key={step.id}
                    data-step={step.id}
                    variant={userProgress.includes(step.id) ? "default" : "outline"}
                    className="w-full justify-start gap-2"
                    onClick={() => handleStepClick(step.id)}
                    disabled={userProgress.includes(step.id)}
                  >
                    <step.icon className="w-4 h-4" />
                    {step.title}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Current Step</h3>
              <div className="flex items-center gap-3 mb-4">
                <currentStepData.icon className="w-6 h-6" />
                <div>
                  <div className="font-medium">{currentStepData.title}</div>
                  <div className="text-sm text-gray-600">{currentStepData.description}</div>
                </div>
              </div>
              <pre className="bg-gray-50 p-4 rounded-lg text-sm custom-scrollbar">
                {currentStepData.content}
              </pre>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="font-medium mb-2">Progress</h4>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${(userProgress.length / steps.length) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600">
                  {userProgress.length} / {steps.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showInfo && (
          <InfoModal
            title={`${currentStepData.title} - Detailed Information`}
            onClose={() => setShowInfo(false)}
            tabs={[
              {
                id: "technical",
                label: "Technical Deep Dive",
                content: (
                  <div className="space-y-6 custom-scrollbar">
                    <div>
                      <h4 className="text-lg font-semibold text-blue-600 mb-3">Protocol Details</h4>
                      <p className="text-gray-700 whitespace-pre-wrap">{currentStepData.technicalDetails.protocol}</p>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-blue-600 mb-3">Implementation</h4>
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto custom-scrollbar">
                        {currentStepData.technicalDetails.implementation}
                      </pre>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-blue-600 mb-3">Security Considerations</h4>
                      <p className="text-gray-700">{currentStepData.technicalDetails.security}</p>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-blue-600 mb-3">Performance Impact</h4>
                      <p className="text-gray-700">{currentStepData.technicalDetails.performance}</p>
                    </div>
                  </div>
                )
              },
              {
                id: "developer",
                label: "Developer Guide",
                content: (
                  <div className="space-y-6 custom-scrollbar">
                    <div>
                      <h4 className="text-lg font-semibold text-green-600 mb-3">Implementation Example</h4>
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto custom-scrollbar">
                        {currentStepData.developerGuide.code}
                      </pre>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-green-600 mb-3">Best Practices</h4>
                      <ul className="list-disc pl-5 space-y-2">
                        {currentStepData.developerGuide.bestPractices.map((practice, i) => (
                          <li key={i} className="text-gray-700">{practice}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-green-600 mb-3">Common Issues</h4>
                      <ul className="list-disc pl-5 space-y-2">
                        {currentStepData.developerGuide.commonIssues.map((issue, i) => (
                          <li key={i} className="text-gray-700">{issue}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-green-600 mb-3">Testing & Debugging</h4>
                      <p className="text-gray-700">{currentStepData.developerGuide.testing}</p>
                    </div>
                  </div>
                )
              },
              {
                id: "conceptual",
                label: "Conceptual Overview",
                content: (
                  <div className="space-y-6 custom-scrollbar">
                    <div>
                      <h4 className="text-lg font-semibold text-purple-600 mb-3">Overview</h4>
                      <p className="text-gray-700">{currentStepData.conceptual.overview}</p>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-purple-600 mb-3">Why It's Important</h4>
                      <p className="text-gray-700">{currentStepData.conceptual.importance}</p>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-purple-600 mb-3">Real-World Analogy</h4>
                      <p className="text-gray-700">{currentStepData.conceptual.realWorldAnalogy}</p>
                    </div>
                  </div>
                )
              }
            ]}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white p-8 rounded-xl max-w-md text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Handshake Complete!</h3>
              <p className="text-gray-600 mb-6">
                You've successfully completed the TLS handshake sequence. The connection is now secure and ready for encrypted communication.
              </p>
                <Button
                  onClick={() => {
                    setShowSuccess(false);
                    setCurrentStep(0);
                    setUserProgress([]);
                  }}
                >
                  Okay!
                </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}