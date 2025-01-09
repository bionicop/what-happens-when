"use client";

import { useState } from "react";
import { StageVisualizer } from "@/components/stage-visualizer";
import { CompanionGuide } from "@/components/companion-guide";

const stages = [
  {
    id: "browser-input",
    title: "Browser Input",
    companionText: [
      "The browser's address bar is your gateway to the web. When you enter a URL:",
      "*Security*: Modern browsers automatically add 'https://' for encrypted connections",
      "*Input Processing*: Special characters are percent-encoded (e.g., space becomes %20)",
      "*HSTS*: Browsers maintain a preload list of HTTPS-only domains",
      "*Cache Check*: Browser checks its cache for previous visits"
    ]
  },
  {
    id: "url-parsing",
    title: "URL Parsing",
    companionText: [
      "*Protocol* (https://): Defines how data should be transmitted",
      "*Domain* (example.com): The website's address",
      "*Path* (/page): Specific resource location",
      "*Query* (?key=value): Additional parameters",
      "*Fragment* (#section): Specific section on the page",
      "*Punycode*: International domain names are converted to ASCII",
      "*Normalization*: URLs are standardized (e.g., removing default ports)"
    ]
  },
  {
    id: "dns-resolution",
    title: "DNS Resolution",
    companionText: [
      "DNS resolution follows a hierarchical process:",
      "*Browser Cache*: First checks the browser's DNS cache",
      "*OS Cache*: Then checks the operating system's DNS cache",
      "*Hosts File*: System checks local hosts file for static entries",
      "*Resolver*: Local DNS resolver initiates recursive query",
      "*Root Servers*: 13 sets of root nameservers worldwide",
      "*Security*: DNSSEC provides cryptographic authentication"
    ]
  },
  {
    id: "tcp-handshake",
    title: "TCP Handshake",
    companionText: [
      "*Socket Creation*: OS creates a network socket",
      "*Port Selection*: Client picks an ephemeral port (1024-65535)",
      "*SYN Flood Protection*: SYN cookies prevent DoS attacks",
      "*Window Scaling*: Negotiates optimal packet sizes",
      "*TCP Fast Open*: Allows data in SYN packet for faster connections",
      "*Congestion Control*: Initial window size is determined"
    ]
  },
  {
    id: "tls-handshake",
    title: "TLS Handshake",
    companionText: [
      "*ClientHello*: Browser sends supported TLS versions and ciphers",
      "*ServerHello*: Server selects TLS version and cipher suite",
      "*Certificate*: Server sends its X.509 certificate chain",
      "*Key Exchange*: Uses algorithms like ECDHE for perfect forward secrecy",
      "*Session Resumption*: TLS 1.3 enables 0-RTT connections",
      "*OCSP Stapling*: Efficient certificate revocation checking"
    ]
  },
  {
    id: "http-request",
    title: "HTTP Request",
    companionText: [
      "*Method Selection*: GET, POST, etc. based on action",
      "*Headers*: User-Agent, Accept, Cookie, etc.",
      "*Compression*: Accept-Encoding negotiates compression",
      "*Caching*: If-Modified-Since, ETag for cache validation",
      "*Security Headers*: CORS, CSP protect against attacks",
      "*HTTP/2*: Multiplexing and header compression",
      "*HTTP/3*: QUIC protocol for improved performance"
    ]
  },
  {
    id: "server-processing",
    title: "Server Processing",
    companionText: [
      "*Load Balancing*: Geographic and load-based distribution",
      "*TLS Termination*: Decryption at edge servers",
      "*CDN*: Content delivery networks cache static content",
      "*Application Logic*: Server processes the request",
      "*Database Queries*: Data retrieval and processing",
      "*Microservices*: Distributed system communication",
      "*Caching Layers*: Redis/Memcached for performance"
    ]
  },
  {
    id: "browser-rendering",
    title: "Browser Rendering",
    companionText: [
      "*HTML Parsing*: Builds Document Object Model (DOM)",
      "*CSS Processing*: Creates CSS Object Model (CSSOM)",
      "*JavaScript*: Parser-blocking vs async/defer execution",
      "*Layout*: Computes geometry of all elements",
      "*Paint*: Converts layout to pixels on screen",
      "*Composite*: Layer management for animations",
      "*Web APIs*: ServiceWorker, WebAssembly, WebGL"
    ]
  }
];

export default function BrowserJourney() {
  const [url, setUrl] = useState("");
  const [currentStage, setCurrentStage] = useState(0);
  const [currentDialog, setCurrentDialog] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleNext = () => {
    if (currentDialog < stages[currentStage].companionText.length - 1) {
      setCurrentDialog(prev => prev + 1);
    } else if (currentStage < stages.length - 1) {
      setCurrentStage(prev => prev + 1);
      setCurrentDialog(0);
    }
  };

  const handlePrev = () => {
    if (currentDialog > 0) {
      setCurrentDialog(prev => prev - 1);
    } else if (currentStage > 0) {
      setCurrentStage(prev => prev - 1);
      setCurrentDialog(stages[currentStage - 1].companionText.length - 1);
    }
  };

  const handleUrlSubmit = () => {
    if (url && currentStage === 0) {
      setCurrentStage(1);
      setCurrentDialog(0);
    }
  };

  const handleStageChange = (index: number) => {
    setCurrentStage(index);
    setCurrentDialog(0);
  };

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <StageVisualizer 
        stage={stages[currentStage].id}
        url={url}
        isSimulating={isSimulating}
        stages={stages}
        onUrlChange={setUrl}
        onUrlSubmit={handleUrlSubmit}
        onStageChange={handleStageChange}
      />

      <CompanionGuide
        text={stages[currentStage].companionText[currentDialog]}
        onNext={handleNext}
        onPrev={handlePrev}
        canGoNext={currentDialog < stages[currentStage].companionText.length - 1 || currentStage < stages.length - 1}
        canGoPrev={currentDialog > 0 || currentStage > 0}
        stage={stages[currentStage].id}
      />
    </div>
  );
}