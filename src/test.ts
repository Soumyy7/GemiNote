import {
  DynamicRetrievalMode,
  GoogleGenerativeAI,
} from "@google/generative-ai";

const api_key = "AIzaSyCIZjjNfd9m6A8WM944wHcdNGWk9JHrEMQ";

export default async function generateContent(query: string) {
  const genAI = new GoogleGenerativeAI(api_key);

  const model = genAI.getGenerativeModel(
    {
      systemInstruction: `
        You are a Twitter Content Fact-Checker.
        - Use the latest, relevant information to fact-check tweets (ideally minutes old).
        - Understand Twitter humor and satire; avoid taking jokes literally unless misrepresented as facts.
        - If the tweet is accurate, reply with "All Good."
        - If unclear or unverifiable, stay silent.
        - Provide additional context only when it is directly relevant and adds value.
      `,
      model: "gemini-1.5-flash",
      tools: [
        {
          googleSearchRetrieval: {
            dynamicRetrievalConfig: {
              mode: DynamicRetrievalMode.MODE_DYNAMIC,
              dynamicThreshold: 0.25, // Adjusted for a more sensitive threshold
            },
          },
        },
      ],
    },
    { apiVersion: "v1beta" }
  );

  try {
    const directive =
      "Fact-check the following tweet and add context if necessary:";
    const queryWithDirective = `${directive} ${query}`;

    // Generate content
    const result = await model.generateContent(queryWithDirective);

    // Log and return the generated response
    const responseText = result.response.text();
    console.log("Generated Response:", responseText);
    return responseText;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error generating content:", error.message);
    } else {
      console.error("Error generating content:", error);
    }
    return "Error: Unable to process the request. Please try again.";
  }
}
