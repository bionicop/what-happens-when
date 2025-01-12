"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bot, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from 'react-markdown';
import { useState, useRef } from "react";
import { useDrag } from "react-use-gesture";

interface CompanionGuideProps {
  text: string;
  onNext: () => void;
  onPrev: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
  stage: string;
}

export function CompanionGuide({ text, onNext, onPrev, canGoNext, canGoPrev, stage }: CompanionGuideProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const guideRef = useRef<HTMLDivElement>(null);

  const bind = useDrag(({ offset: [x, y] }) => {
    setPosition({ x, y });
  });

  if (!isVisible) {
    return (
      <Button
        className="fixed bottom-24 right-8 rounded-full p-3"
        onClick={() => setIsVisible(true)}
      >
        <Bot className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <motion.div
      className="fixed z-50"
      style={{ bottom: '24px', right: '8px', transform: `translate(${position.x}px, ${position.y}px)` }}
      {...bind()}
    >
      <div className="flex items-end gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="max-w-sm"
          ref={guideRef}
        >
          <div className="bg-white rounded-3xl p-4 shadow-lg relative">
            <button
              onClick={() => setIsVisible(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="absolute w-3 h-3 bg-white rotate-45 right-[-6px] bottom-4" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={text}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="prose prose-sm max-w-none mb-4 text-sm"
              >
                <ReactMarkdown
                  components={{
                    em: ({ children }) => (
                      <span className="font-semibold text-blue-600">{children}</span>
                    ),
                  }}
                >
                  {text}
                </ReactMarkdown>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onPrev}
                disabled={!canGoPrev}
                className="px-2"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onNext}
                disabled={!canGoNext}
                className="px-2"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
        <div className="bg-primary text-primary-foreground p-3 rounded-full shadow-lg">
          <Bot className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
}