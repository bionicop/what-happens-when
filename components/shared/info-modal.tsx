"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface InfoModalProps {
  title: string;
  onClose: () => void;
  tabs: {
    id: string;
    label: string;
    content: React.ReactNode;
  }[];
}

export function InfoModal({ title, onClose, tabs }: InfoModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-lg p-8 max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col"
      >
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-bold">{title}</h3>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <Tabs defaultValue={tabs[0].id} className="flex-1 overflow-hidden">
          <TabsList className="mb-4">
            {tabs.map(tab => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map(tab => (
            <TabsContent 
              key={tab.id} 
              value={tab.id}
              className="flex-1 overflow-auto"
            >
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>
    </motion.div>
  );
}