import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.GOOGLE_GENAI_API_KEY) {
      return NextResponse.json(
        { error: "Error de servidor: Falta configurar la variable GOOGLE_GENAI_API_KEY." },
        { status: 500 }
      );
    }

    // Instancia EXCLUSIVA con el nuevo SDK de Google Gen AI y la API Key especificada
    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });

    // SYSTEM PROMPT invisible acoplado sin usar 'systemInstruction' prohibido para Gemma
    const systemPrompt = "Eres una profesora de plástica senior con mas de 25 años de experiencia, que trata a los alumnos con respeto pero con sentido del humor.";

    // Transformamos los mensajes para asegurar que cumplan el esquema requerido (user / model)
    const formattedMessages = messages.map((m: { role: string, content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    // Inyectamos el System Prompt al principio del PRIMER mensaje enviado por el usuario
    if (formattedMessages.length > 0 && formattedMessages[0].role === 'user') {
      formattedMessages[0].parts[0].text = `[Instrucciones del sistema/Comportamiento: ${systemPrompt}]\n\nEste es el mensaje del alumno: ${formattedMessages[0].parts[0].text}`;
    } else if (formattedMessages.length === 0) {
      return NextResponse.json(
        { error: "Petición vacía." },
        { status: 400 }
      );
    }

    // Configuración estricta del modelo solicitado
    const response = await ai.models.generateContent({
      model: 'gemma-4-26b-a4b-it',
      contents: formattedMessages,
    });

    return NextResponse.json({ reply: response.text });

  } catch (error: any) {
    console.error("Error en la API de chat (/api/chat):", error);
    
    // Tratamiento robusto antifallos sin romper el front end
    return NextResponse.json(
      { error: "Interferencias en la red temporalmente... Mis pinceles digitales se han atascado y no he podido entenderte bien. ¡Vuelve a intentarlo en un momento, artista!" },
      { status: 500 }
    );
  }
}
