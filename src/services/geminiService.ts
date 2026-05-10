/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { MeetingAgenda } from "../types";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY as string 
});

export async function generateAgenda(
  documentText: string, 
  totalMinutes: number
): Promise<MeetingAgenda> {
  const prompt = `
    Analyze the following document and create a structured meeting agenda for a ${totalMinutes}-minute meeting.
    
    The agenda should include:
    1. A clear meeting title.
    2. An overall summary of the meeting's objectives.
    3. Multiple topics, each with:
       - A title
       - A concise summary
       - List of action items
       - List of key stakeholders Involved
       - Duration in minutes (total durations of all topics must add up to ${totalMinutes} minutes)

    Document Content:
    ---
    ${documentText}
    ---
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["title", "totalDuration", "topics", "overallSummary"],
          properties: {
            title: { type: Type.STRING },
            totalDuration: { type: Type.NUMBER },
            overallSummary: { type: Type.STRING },
            topics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["title", "summary", "actionItems", "stakeholders", "durationMinutes"],
                properties: {
                  title: { type: Type.STRING },
                  summary: { type: Type.STRING },
                  actionItems: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  stakeholders: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  durationMinutes: { type: Type.NUMBER }
                }
              }
            }
          }
        }
      }
    });

    if (!response.text) {
      throw new Error("No response from Gemini");
    }

    return JSON.parse(response.text) as MeetingAgenda;
  } catch (error) {
    console.error("Error generating agenda:", error);
    throw error;
  }
}
