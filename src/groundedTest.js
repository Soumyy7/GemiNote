import {
  DynamicRetrievalMode,
  GoogleGenerativeAI,
} from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI("AIzaSyCIZjjNfd9m6A8WM944wHcdNGWk9JHrEMQ");
const model = genAI.getGenerativeModel(
  {
    model: "models/gemini-1.5-pro-002",
    tools: [
      {
        googleSearchRetrieval: {
          dynamicRetrievalConfig: {
            mode: DynamicRetrievalMode.MODE_DYNAMIC,
            dynamicThreshold: 0.3,
          },
        },
      },
    ],
  },
  { apiVersion: "v1beta" }
);

const prompt = "Who won the Ballon d'Or this year?";
const result = await model.generateContent(prompt);
console.log(result.response.candidates[0].content.parts[0].text);
