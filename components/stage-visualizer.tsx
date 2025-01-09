"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, Globe, Lock, ArrowLeft, ArrowRight, RotateCw
} from "lucide-react";
import { DNSVisualizer } from "./dns-visualizer";
import { TCPGame } from "./tcp-game";
import { URLParser } from "./url-parser";
import { TLSVisualizer } from "./tls-visualizer";
import { HTTPVisualizer } from "./http-visualizer";
import { ServerProcessing } from "./server-processing";
import { BrowserRendering } from "./browser-rendering";

interface Stage {
  id: string;
  title: string;
  companionText: string[];
}

interface StageVisualizerProps {
  stage: string;
  url: string;
  isSimulating: boolean;
  stages: Stage[];
  onUrlChange: (url: string) => void;
  onUrlSubmit: () => void;
  onStageChange: (index: number) => void;
}

export function StageVisualizer({ 
  stage, 
  url, 
  isSimulating, 
  stages,
  onUrlChange, 
  onUrlSubmit,
  onStageChange 
}: StageVisualizerProps) {
  const renderBrowserChrome = (content: React.ReactNode) => (
    <div className="w-full h-full max-w-6xl mx-auto">
      <motion.div 
        className="bg-white rounded-lg shadow-xl overflow-hidden h-[calc(100vh-7rem)]"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="bg-gray-100 p-2 flex gap-2 items-center">
          <div className="flex gap-1.5">
            {["bg-red-500", "bg-yellow-500", "bg-green-500"].map((color, i) => (
              <div key={i} className={`w-3 h-3 rounded-full ${color}`} />
            ))}
          </div>
          <div className="flex gap-2 px-2">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 flex gap-2 items-center bg-white rounded-md px-3 py-1.5">
            <Lock className="h-4 w-4 text-green-600" />
            <Input
              value={url}
              onChange={(e) => onUrlChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onUrlSubmit()}
              placeholder="Type a website (e.g., google.com)"
              className="border-0 focus-visible:ring-0 px-0 py-0 h-auto"
            />
          </div>
        </div>
        <div className="p-4 h-[calc(100%-3.5rem)] overflow-auto">
          {content}
        </div>
      </motion.div>
    </div>
  );

  const renderStage = () => {
    switch (stage) {
      case "browser-input":
        return renderBrowserChrome(
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <Globe className="w-16 h-16 mx-auto text-gray-400" />
              <h2 className="text-2xl font-semibold text-gray-700">Enter a website address above to begin</h2>
              <p className="text-gray-500">Try typing "google.com" in the address bar!</p>
            </div>
          </div>
        );

      case "url-parsing":
        return renderBrowserChrome(
          <URLParser url={url} />
        );

      case "dns-resolution":
        return (
          <div className="h-full">
            <DNSVisualizer />
          </div>
        );

      case "tcp-handshake":
        return (
          <div className="h-full">
            <TCPGame />
          </div>
        );

      case "tls-handshake":
        return (
          <div className="h-full">
            <TLSVisualizer />
          </div>
        );

      case "http-request":
        return (
          <div className="h-full">
            <HTTPVisualizer />
          </div>
        );

      case "server-processing":
        return (
          <div className="h-full">
            <ServerProcessing />
          </div>
        );

      case "browser-rendering":
        return (
          <div className="h-full">
            <BrowserRendering />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="w-full h-full"
          >
            {renderStage()}
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="h-16 bg-white border-t shadow-lg fixed bottom-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto h-full">
          <div className="flex items-center justify-between h-full px-8">
            {stages.map((s, index) => (
              <button
                key={s.id}
                onClick={() => onStageChange(index)}
                className={`relative flex flex-col items-center ${
                  stage === s.id ? 'text-blue-600' : 'text-gray-400'
                } hover:text-blue-500 transition-colors`}
              >
                <div className={`w-3 h-3 rounded-full ${
                  stage === s.id ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
                <div className="text-xs mt-1 font-medium">{s.title}</div>
                {index < stages.length - 1 && (
                  <div className="absolute left-[calc(100%+0.5rem)] top-1.5 w-[calc(100%-1rem)] h-px bg-gray-200" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}