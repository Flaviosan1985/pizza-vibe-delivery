import { GoogleGenAI, Type } from "@google/genai";
import { Pizza, AIReply } from "../types";
import { PIZZAS } from "../constants";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getPizzaRecommendation = async (userPreference: string): Promise<AIReply> => {
  if (!apiKey) {
    return {
      text: "Desculpe, a chave de API não está configurada. Não posso fazer recomendações no momento.",
    };
  }

  try {
    const model = "gemini-2.5-flash";
    const pizzaListString = PIZZAS.map(p => `${p.id}: ${p.name} (${p.description}) - Categoria: ${p.category}`).join("\n");

    const prompt = `
      Você é um sommelier de pizzas especialista e divertido da 'PizzaVibe'.
      Aqui está o nosso cardápio:
      ${pizzaListString}

      O usuário disse: "${userPreference}"

      Sua tarefa:
      1. Escolher a MELHOR pizza do cardápio para este usuário.
      2. Escrever uma resposta curta, divertida e apetitosa (max 2 frases) explicando por que essa pizza é perfeita para ele.
      3. Retornar APENAS um JSON com o ID da pizza recomendada e o texto.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedPizzaId: { type: Type.INTEGER },
            text: { type: Type.STRING }
          },
          required: ["recommendedPizzaId", "text"]
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Sem resposta do Gemini");
    }

    const parsed = JSON.parse(responseText) as AIReply;
    return parsed;

  } catch (error) {
    console.error("Erro ao consultar Gemini:", error);
    return {
      text: "Hmm, minha conexão com o forno de ideias falhou. Que tal dar uma olhada nas nossas promoções?",
    };
  }
};