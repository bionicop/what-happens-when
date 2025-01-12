"use client";

import { useState } from "react";
import { StageVisualizer } from "@/components/stage-visualizer";
import { CompanionGuide } from "@/components/companion-guide";

const stages = [
  {
    id: "browser-input",
    title: "Browser Input",
    companionText: [
      "Welcome to the Browser Journey! Let's start by understanding what happens when you type a URL:",
      "*Address Bar Security*: The browser first checks if the site requires HTTPS. Most modern browsers enforce secure connections by default.",
      "*URL Validation*: The browser validates the input format and checks for potentially malicious characters.",
      "*Protocol Selection*: If no protocol is specified (http:// or https://), the browser adds one automatically.",
      "*History & Autocomplete*: The browser checks your browsing history and bookmarks for quick suggestions.",
      "*HSTS Check*: The browser verifies if the domain is in the HSTS preload list for enforced HTTPS.",
      "*Initial Preparation*: The browser prepares internal data structures for the upcoming request."
    ]
  },
  {
    id: "url-parsing",
    title: "URL Parsing",
    companionText: [
      "Let's break down the URL structure:",
      "*Protocol* (https://): Ensures secure encrypted communication between browser and server",
      "*Domain*: The human-readable address that will be resolved to an IP address",
      "*Port*: Specifies which service to connect to (default: 443 for HTTPS)",
      "*Path*: Indicates the specific resource location on the server",
      "*Query Parameters*: Additional data sent to the server",
      "*Fragment*: Local reference to a specific part of the page"
    ]
  },
  {
    id: "dns-resolution",
    title: "DNS Resolution",
    companionText: [
      "Starting DNS resolution process...",
      "*Browser Cache Check*: First checking browser's local DNS cache for quick lookup",
      "*OS Cache Check*: Looking in operating system's DNS cache",
      "*Local DNS Query*: Asking your ISP's DNS resolver",
      "*Root Server Query*: Contacting global root DNS servers",
      "*TLD Server Query*: Getting information from .com/.org servers",
      "*Return to TLD*: TLD server provides authoritative server info",
      "*Return to Local DNS*: Information flows back to local resolver",
      "*Final Response*: Browser receives the IP address"
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

  const handleStageVisualStep = (step: number) => {
    setCurrentDialog(step);
  };

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <StageVisualizer 
        stage={stages[currentStage].id}
        url={url}
        isSimulating={isSimulating}
        currentDialog={currentDialog}
        stages={stages}
        onUrlChange={setUrl}
        onUrlSubmit={handleUrlSubmit}
        onStageChange={handleStageChange}
        onVisualStepChange={handleStageVisualStep}
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