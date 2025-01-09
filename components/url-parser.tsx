"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface URLPart {
  name: string;
  value: string;
  description: string;
  color: string;
}

export function URLParser({ url }: { url: string }) {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  const getParts = (url: string): URLPart[] => {
    // Add https:// if not present
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    try {
      const urlObj = new URL(fullUrl);
      return [
        {
          name: "Protocol",
          value: urlObj.protocol,
          description: "Defines how the browser should communicate with the server",
          color: "bg-blue-100 text-blue-700 border-blue-200"
        },
        {
          name: "Domain",
          value: urlObj.hostname,
          description: "The website's address that will be resolved via DNS",
          color: "bg-green-100 text-green-700 border-green-200"
        },
        {
          name: "Path",
          value: urlObj.pathname || "/",
          description: "Specific location of a resource on the server",
          color: "bg-purple-100 text-purple-700 border-purple-200"
        },
        {
          name: "Query",
          value: urlObj.search,
          description: "Additional parameters sent to the server",
          color: "bg-orange-100 text-orange-700 border-orange-200"
        },
        {
          name: "Fragment",
          value: urlObj.hash,
          description: "Points to a specific section of the webpage",
          color: "bg-pink-100 text-pink-700 border-pink-200"
        }
      ].filter(part => part.value);
    } catch {
      return [];
    }
  };

  const parts = getParts(url);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-2xl font-semibold mb-6">URL Structure Analysis</h2>
      
      <div className="space-y-8">
        <div className="flex flex-wrap gap-1 text-lg font-mono">
          {parts.map((part, index) => (
            <motion.div
              key={part.name}
              className={`relative cursor-help px-3 py-1.5 rounded-md border ${part.color}`}
              onHoverStart={() => setHoveredPart(part.name)}
              onHoverEnd={() => setHoveredPart(null)}
              whileHover={{ scale: 1.05 }}
            >
              {part.value}
              {hoveredPart === part.name && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute left-0 top-full mt-2 w-64 p-3 bg-white rounded-lg shadow-lg z-10"
                >
                  <div className="font-sans">
                    <div className="font-medium mb-1">{part.name}</div>
                    <div className="text-sm text-gray-600">{part.description}</div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Quick Facts</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Protocols (like https://) ensure secure communication</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>Domains are human-readable addresses for IP locations</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span>Paths help organize content on web servers</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}