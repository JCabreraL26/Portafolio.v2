import React from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Chatbot } from "./Chatbot";

// Wrapper para el Chatbot con ConvexProvider
export function ChatbotWidget() {
  const convexUrl = import.meta.env.PUBLIC_CONVEX_URL;
  
  if (!convexUrl) {
    console.error("❌ PUBLIC_CONVEX_URL no está configurado");
    return null;
  }
  
  const convex = new ConvexReactClient(convexUrl);
  
  return (
    <ConvexProvider client={convex}>
      <Chatbot />
    </ConvexProvider>
  );
}
