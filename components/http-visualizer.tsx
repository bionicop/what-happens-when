"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Code, FileJson, AlertCircle, HelpCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HTTPRequest {
  method: string;
  path: string;
  headers: Record<string, string>;
  body?: any;
}

interface HTTPResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: any;
}

const methods = ["GET", "POST", "PUT", "DELETE", "PATCH"];
const commonHeaders = {
  "Content-Type": ["application/json", "text/plain"],
  "Accept": ["*/*", "application/json"],
  "Authorization": ["Bearer token"],
  "Cache-Control": ["no-cache", "max-age=3600"]
};

const methodInfo: {
  [key: string]: {
    description: string;
    usage: string;
    example: string;
    hasBody: boolean;
  };
} = {
  GET: {
    description: "Retrieve data from the server",
    usage: "Used when you want to read or fetch data",
    example: "Getting a user's profile, fetching a list of products",
    hasBody: false
  },
  POST: {
    description: "Create new data on the server",
    usage: "Used when you want to submit new information",
    example: "Creating a new user account, submitting a form",
    hasBody: true
  },
  PUT: {
    description: "Update existing data on the server",
    usage: "Used when you want to modify an entire resource",
    example: "Updating all fields of a user profile",
    hasBody: true
  },
  DELETE: {
    description: "Remove data from the server",
    usage: "Used when you want to delete a resource",
    example: "Deleting a user account, removing a post",
    hasBody: false
  },
  PATCH: {
    description: "Partially update existing data",
    usage: "Used when you want to modify specific fields",
    example: "Updating just the email in a user profile",
    hasBody: true
  }
};

const headerInfo = {
  "Content-Type": {
    description: "Specifies the format of the data being sent",
    usage: "Tells the server how to interpret the request body",
    example: "application/json for JSON data"
  },
  "Accept": {
    description: "Indicates what type of response you can handle",
    usage: "Tells the server what format you want the response in",
    example: "application/json to receive JSON data"
  },
  "Authorization": {
    description: "Contains credentials for authentication",
    usage: "Provides security tokens or credentials",
    example: "Bearer eyJhbGciOiJIUzI1NiIs..."
  },
  "Cache-Control": {
    description: "Directives for caching mechanisms",
    usage: "Controls how the response is cached",
    example: "max-age=3600 for one hour caching"
  }
};

export function HTTPVisualizer() {
  const [request, setRequest] = useState<HTTPRequest>({
    method: "GET",
    path: "/api/users",
    headers: {
      "Content-Type": "application/json",
      "Accept": "*/*",
      "Authorization": "Bearer token",
      "Cache-Control": "no-cache"
    },
    body: null
  });
  
  const [response, setResponse] = useState<HTTPResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(true);
  const [showMethodInfo, setShowMethodInfo] = useState(false);
  const [showHeaderInfo, setShowHeaderInfo] = useState(false);

  const simulateRequest = () => {
    setLoading(true);
    setError(null);

    setTimeout(() => {
      try {
        // Create a dynamic response based on the request
        const simulatedResponse: HTTPResponse = {
          status: 200,
          statusText: "OK",
          headers: {
            // Include the headers from the request
            ...request.headers,
          },
          body: {
            data: {
              message: "Success",
              requestDetails: {
                method: request.method,
                path: request.path,
                headers: request.headers,
                body: request.body
              }
            }
          }
        };
        setResponse(simulatedResponse);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="w-full h-[calc(100vh-10rem)] bg-white rounded-lg shadow-md overflow-hidden relative">
      {/* Introduction Guide */}
      <AnimatePresence>
        {showGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-lg p-8 max-w-2xl"
            >
              <h3 className="text-2xl font-bold mb-4">Welcome to HTTP Request Builder!</h3>
              <div className="prose prose-sm">
                <p className="mb-4">
                  HTTP (Hypertext Transfer Protocol) is how web browsers and servers communicate.
                  This tool helps you understand how HTTP requests and responses work.
                </p>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      1
                    </div>
                    <p>Choose an HTTP method (GET, POST, etc.) to determine what kind of request you're making</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      2
                    </div>
                    <p>Set headers to provide additional information about your request</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      3
                    </div>
                    <p>Add a request body for POST/PUT requests to send data to the server</p>
                  </div>
                </div>
                <Button
                  onClick={() => setShowGuide(false)}
                  className="w-full"
                >
                  Start Building Requests
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-full flex">
        {/* Request Builder */}
        <div className="w-96 border-r bg-gray-50 p-6 overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Request Builder</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowGuide(true)}
            >
              <HelpCircle className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Method Selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                HTTP Method
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMethodInfo(true)}
              >
                <HelpCircle className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {methods.map(method => (
                <Button
                  key={method}
                  variant={request.method === method ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRequest(prev => ({ ...prev, method }))}
                >
                  {method}
                </Button>
              ))}
            </div>
          </div>

          {/* Path */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Request Path
            </label>
            <input
              type="text"
              value={request.path}
              onChange={e => setRequest(prev => ({ ...prev, path: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder="/api/endpoint"
            />
          </div>

          {/* Headers */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Headers
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHeaderInfo(true)}
              >
                <HelpCircle className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {Object.entries(commonHeaders).map(([key, values]) => (
                <div key={key} className="flex gap-2">
                  <select
                    className="flex-1 px-3 py-1.5 border rounded-md text-sm"
                    onChange={e => {
                      const newHeaders = { ...request.headers };
                      if (e.target.value) {
                        newHeaders[key] = e.target.value;
                      } else {
                        delete newHeaders[key];
                      }
                      setRequest(prev => ({ ...prev, headers: newHeaders }));
                    }}
                    value={request.headers[key] || ""}
                  >
                    <option value="">{key}</option>
                    {values.map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Body (for POST/PUT) */}
          {(request.method === "POST" || request.method === "PUT" || request.method === "PATCH") && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Request Body
              </label>
              <textarea
                className="w-full px-3 py-2 border rounded-md text-sm font-mono"
                rows={4}
                placeholder="{ }"
                onChange={e => {
                  try {
                    const body = JSON.parse(e.target.value);
                    setRequest(prev => ({ ...prev, body }));
                    setError(null);
                  } catch {
                    setError("Invalid JSON");
                  }
                }}
              />
            </div>
          )}

          <Button 
            onClick={simulateRequest}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Sending..." : "Send Request"}
          </Button>
        </div>

        {/* Response Viewer */}
        <div className="flex-1 flex flex-col">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Response</h2>
          </div>

          <div className="flex-1 p-6 overflow-auto">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center h-full"
                >
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
                </motion.div>
              ) : response ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-lg font-medium mb-2">
                      Status: {response.status} {response.statusText}
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Headers</h4>
                        <pre className="bg-white p-3 rounded border text-sm">
                          {JSON.stringify(response.headers, null, 2)}
                        </pre>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Body</h4>
                        <pre className="bg-white p-3 rounded border text-sm">
                          {JSON.stringify(response.body, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Send a request to see the response
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Method Info Modal */}
      <AnimatePresence>
        {showMethodInfo && (
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
              className="bg-white rounded-lg p-8 max-w-2xl w-full"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold">HTTP Methods Explained</h3>
                <button onClick={() => setShowMethodInfo(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                {methods.map(method => (
                  <div key={method} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-blue-600 mb-2">{method}</h4>
                    <div className="space-y-2">
                      <p><span className="font-medium">What it does:</span> {methodInfo[method].description}</p>
                      <p><span className="font-medium">When to use it:</span> {methodInfo[method].usage}</p>
                      <p><span className="font-medium">Example:</span> {methodInfo[method].example}</p>
                      <p><span className="font-medium">Has body:</span> {methodInfo[method].hasBody ? "Yes" : "No"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Info Modal */}
      <AnimatePresence>
        {showHeaderInfo && (
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
              className="bg-white rounded-lg p-8 max-w-2xl w-full"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold">HTTP Headers Explained</h3>
                <button onClick={() => setShowHeaderInfo(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                {Object.entries(headerInfo).map(([header, info]) => (
                  <div key={header} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-blue-600 mb-2">{header}</h4>
                    <div className="space-y-2">
                      <p><span className="font-medium">What it does:</span> {info.description}</p>
                      <p><span className="font-medium">When to use it:</span> {info.usage}</p>
                      <p><span className="font-medium">Example:</span> {info.example}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}