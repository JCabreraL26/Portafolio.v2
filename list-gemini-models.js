// Script para listar modelos disponibles de Gemini
import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFileSync } from 'fs';

async function listModels() {
  // Leer .env.local
  let apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    try {
      const envContent = readFileSync('.env.local', 'utf-8');
      const match = envContent.match(/GEMINI_API_KEY=(.+)/);
      if (match) {
        apiKey = match[1].trim();
      }
    } catch (e) {
      console.log("No se pudo leer .env.local");
    }
  }
  
  if (!apiKey) {
    console.error("❌ GEMINI_API_KEY no está configurada");
    console.log("Configúrala en .env.local");
    process.exit(1);
  }

  console.log("🔍 API Key encontrada:", apiKey.substring(0, 10) + "...");
  console.log("\n📋 Listando modelos disponibles de Google Generative AI...\n");
  
  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    // Intentar obtener modelos
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    
    const data = await response.json();
    
    if (data.error) {
      console.error("❌ Error:", data.error);
      return;
    }
    
    if (data.models) {
      console.log(`✅ ${data.models.length} modelos encontrados:\n`);
      
      data.models.forEach((model, index) => {
        console.log(`${index + 1}. ${model.name}`);
        console.log(`   Nombre corto: ${model.name.split('/').pop()}`);
        console.log(`   Descripción: ${model.displayName || 'N/A'}`);
        console.log(`   Soporta generateContent: ${model.supportedGenerationMethods?.includes('generateContent') ? '✅' : '❌'}`);
        
        if (model.supportedGenerationMethods) {
          console.log(`   Métodos: ${model.supportedGenerationMethods.join(', ')}`);
        }
        
        console.log("");
      });
      
      // Filtrar modelos con soporte de generateContent
      const contentModels = data.models.filter(m => 
        m.supportedGenerationMethods?.includes('generateContent')
      );
      
      console.log("\n🎯 Modelos recomendados para generateContent:");
      contentModels.forEach(m => {
        const shortName = m.name.split('/').pop();
        console.log(`   - ${shortName}`);
      });
      
    } else {
      console.log("⚠️ No se encontraron modelos");
      console.log("Respuesta:", JSON.stringify(data, null, 2));
    }
    
  } catch (error) {
    console.error("❌ Error al listar modelos:", error.message);
    console.error(error);
  }
}

listModels();
