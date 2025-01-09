"use client";

import BrowserJourney from "@/app/journey/page";
import { motion } from "framer-motion";
import { ArrowRight, Globe, Terminal } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-screen text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 max-w-3xl"
        >
          <Globe className="w-16 h-16 mx-auto text-primary mb-8" />
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            What Happens When You Type{" "}
            <span className="text-primary">google.com</span>?
          </h1>
          <p className="text-xl text-muted-foreground">
            An interactive journey through the internet&apos;s infrastructure,
            from your browser to Google&apos;s servers and back.
          </p>

          <div className="flex justify-center gap-4 pt-8">
            <Link href = "/journey" 
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-full text-lg font-medium transition-colors"
            >
              Start Journey <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}