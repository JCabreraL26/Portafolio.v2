import React from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { QualifyingFunnel } from "./QualifyingFunnel";

export function QualifyingFunnelWidget() {
  const convexUrl = import.meta.env.PUBLIC_CONVEX_URL;
  
  if (!convexUrl) {
    console.error("❌ PUBLIC_CONVEX_URL no está configurada");
    return (
      <div className="text-center p-8 text-red-600">
        Error: Configuración de Convex no encontrada
      </div>
    );
  }

  const convex = new ConvexReactClient(convexUrl);
  
  return (
    <ConvexProvider client={convex}>
      <QualifyingFunnel />
    </ConvexProvider>
  );
}
