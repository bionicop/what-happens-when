"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, Layers, Paintbrush, Cpu, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RenderingStep {
  id: string;
  title: string;
  description: string;
  icon: typeof Code | typeof Layers | typeof Paintbrush | typeof Cpu;
  details: string[];
  code?: string;
}

const steps: RenderingStep[] = [
  {
    id: "html-parsing",
    title: "HTML Parsing",
    description: "Building the DOM tree",
    icon: Code,
    details: [
      "Parse HTML into DOM nodes",
      "Handle script tags (blocking vs async)",
      "Process meta tags and links",
      "Create document structure"
    ],
    code: `<!DOCTYPE html>
<html>
  <head>
    <title>Example</title>
  </head>
  <body>
    <div class="container">
      <h1>Hello World</h1>
    </div>
  </body>
</html>`
  },
  {
    id: "css-processing",
    title: "CSS Processing",
    description: "Creating the CSSOM",
    icon: Layers,
    details: [
      "Parse CSS rules",
      "Build CSSOM tree",
      "Handle media queries",
      "Process animations"
    ],
    code: `.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: #333;
  font-size: 2rem;
  font-weight: bold;
}`
  },
  {
    id: "layout",
    title: "Layout Calculation",
    description: "Computing element positions",
    icon: Paintbrush,
    details: [
      "Calculate element dimensions",
      "Determine element positions",
      "Handle flexbox/grid layouts",
      "Process margin and padding"
    ],
    code: `// Layout tree calculation
{
  "container": {
    "width": "1200px",
    "height": "auto",
    "children": [{
      "type": "h1",
      "width": "100%",
      "height": "38px"
    }]
  }
}`
  },
  {
    id: "paint",
    title: "Paint & Composite",
    description: "Final rendering steps",
    icon: Cpu,
    details: [
      "Paint elements to layers",
      "Handle z-index stacking",
      "Apply visual effects",
      "Composite layers together"
    ],
    code: `// Paint commands
drawBackground(container);
drawBorder(container);
drawText(h1, "Hello World");
composite([
  layer1, // Background
  layer2  // Content
]);`
  }
];

export function BrowserRendering() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCompleted([...completed, steps[currentStep].id]);
      setCurrentStep(currentStep + 1);
    } else {
      setCompleted([...completed, steps[currentStep].id]);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setCompleted([]);
  };

  return (
    <div className="w-full h-[calc(100vh-7rem)] bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="p-8 border-b flex-shrink-0">
          <h2 className="text-2xl font-bold mb-4">Browser Rendering Pipeline</h2>
          <p className="text-gray-600">
            Explore how your browser transforms HTML, CSS, and JavaScript into
            pixels on the screen.
          </p>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-8 p-8 bg-gray-50 overflow-hidden">
          {/* Steps section with scroll */}
          <div className="space-y-6 overflow-y-auto pr-4 max-h-[calc(100vh-15rem)] custom-scrollbar">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = completed.includes(step.id);

              return (
                <motion.div
                  key={step.id}
                  className={`p-6 rounded-xl border-2 transition-colors ${
                    isActive
                      ? "border-blue-500 bg-blue-50"
                      : isCompleted
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200"
                  }`}
                  animate={{
                    scale: isActive ? 1.02 : 1,
                    opacity: index > currentStep ? 0.5 : 1
                  }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`p-2 rounded-lg ${
                        isActive
                          ? "bg-blue-100"
                          : isCompleted
                          ? "bg-green-100"
                          : "bg-gray-100"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{step.title}</h3>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                    {isCompleted && (
                      <CheckCircle2 className="w-6 h-6 text-green-500 ml-auto" />
                    )}
                  </div>
                  {(isActive || isCompleted) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4 mt-4"
                    >
                      <ul className="space-y-2 ml-12">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm"> ```
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                      {step.code && (
                        <div className="bg-gray-900 rounded-lg p-4 mt-4">
                          <pre className="text-sm text-gray-300">
                            <code>{step.code}</code>
                          </pre>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Fixed status panel */}
          <div className="space-y-6 h-fit">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Rendering Progress</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span>
                    Steps Completed: {completed.length} / {steps.length}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span>
                    {completed.length === steps.length
                      ? "Rendering Complete! 🎉"
                      : `Current Step: ${steps[currentStep].title}`}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleNext}
                disabled={completed.length === steps.length}
                className="flex-1"
              >
                {completed.length === steps.length ? "Completed" : "Next Step"}
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={completed.length === 0}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}