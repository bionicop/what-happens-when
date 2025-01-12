"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

interface URLParserProps {
  url: string;
  step: number;
}

export function URLParser({ url, step }: URLParserProps) {
  const [urlParts, setUrlParts] = useState<URL | null>(null);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (url && !url.startsWith('http')) {
        const fullUrl = `https://${url}`;
        new URL(fullUrl);
        setUrlParts(new URL(fullUrl));
        setError(null);
      } else if (url) {
        new URL(url);
        setUrlParts(new URL(url));
        setError(null);
      } else {
        setUrlParts(null);
        setError(null);
      }
    } catch (e) {
      setUrlParts(null);
      setError("Please enter a valid URL");
    }
  }, [url]);

  // Auto-scroll to the active step
  useEffect(() => {
    if (containerRef.current && step >= 0) {
      const activeElement = containerRef.current.children[step] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [step]);

  const elements = [
    {
      label: "Protocol",
      value: urlParts?.protocol || "https://",
      color: "bg-blue-100 border-blue-500",
      description: "Defines how the browser should communicate (https for secure)",
      glow: step === 0
    },
    {
      label: "Domain",
      value: urlParts?.hostname || "example.com",
      color: "bg-green-100 border-green-500",
      description: "The website's address that will be resolved to an IP",
      glow: step === 1
    },
    {
      label: "Port",
      value: urlParts?.port || "443",
      color: "bg-purple-100 border-purple-500",
      description: "Network port for the connection (443 is default for HTTPS)",
      glow: step === 2
    },
    {
      label: "Path",
      value: urlParts?.pathname || "/",
      color: "bg-orange-100 border-orange-500",
      description: "Location of the specific resource on the server",
      glow: step === 3
    },
    {
      label: "Query",
      value: urlParts?.search || "",
      color: "bg-red-100 border-red-500",
      description: "Additional parameters sent to the server",
      glow: step === 4
    },
    {
      label: "Fragment",
      value: urlParts?.hash || "",
      color: "bg-yellow-100 border-yellow-500",
      description: "Points to a specific section on the page",
      glow: step === 5
    }
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex-none p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">URL Structure Analysis</h2>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <p className="text-gray-600">
              {url ? `Analyzing the components of: ${urlParts?.href || url}` : 'Enter a URL to analyze'}
            </p>
          )}
          <p className="text-sm text-gray-500 mt-2">Use the companion guide to learn more about each component.</p>
        </div>
      </div>

      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar"
      >
        <div className="grid gap-6">
          {elements.map((element, index) => (
            <motion.div
              key={element.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: index <= step ? 1 : 0.5,
                y: 0 
              }}
              className={`p-4 rounded-lg border-2 ${element.color} ${
                element.glow ? "ring-4 ring-opacity-50 ring-blue-500" : ""
              } transition-all duration-300`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{element.label}</h3>
                <code className="bg-white px-2 py-1 rounded">
                  {element.value || "<none>"}
                </code>
              </div>
              <p className="text-sm text-gray-600">{element.description}</p>
              
              {/* Show real example for google.com */}
              {url.includes('google.com') && (
                <div className="mt-2 text-sm bg-gray-50 p-2 rounded">
                  <span className="font-medium">Google Example: </span>
                  {getGoogleExample(element.label)}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getGoogleExample(part: string): string {
  switch(part) {
    case "Protocol":
      return "Google enforces HTTPS for security";
    case "Domain":
      return "www.google.com uses global DNS load balancing";
    case "Port":
      return "443 for secure HTTPS traffic";
    case "Path":
      return "/search is Google's main search endpoint";
    case "Query":
      return "?q=search+term defines the search parameters";
    case "Fragment":
      return "#results jumps to search results section";
    default:
      return "";
  }
}