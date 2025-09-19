import { GoogleGenAI, Type, type ContentListUnion } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: useRuntimeConfig().geminiApiKey });

export default defineEventHandler(async (e) => {
  const body = await readBody<{
    contents: ContentListUnion;
    withProductList?: boolean;
  }>(e);

  if (!body.withProductList) {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: body.contents,
      config: {
        systemInstruction: `You are a specialized AI assistant for Tsurayya Gadget Store. Your function is to analyze customer queries and route them by generating a JSON object. Your analysis determines the next action for our system.

        Based on the user's message, populate a JSON object with the following logic:

        1.  **Product Inquiry:** If the user's query is about products (e.g., 'show me phones', 'do you have laptops?', 'looking for a gaming PC'), set 'requireProductData' to true.

        2.  **Price Filtering:** If the user specifies a price range or limit (e.g., 'under $500', 'around $1000', 'between $200 and $400'), populate the 'priceFilter' object with the 'operation' and the corresponding value(s) 'x' (and 'y' for a range).

        3.  **General Questions:** If the query is a simple, direct question not related to products (e.g., a greeting, store hours, 'who are you?'), provide a concise and helpful response in the 'answer' field.

        4.  **Clarification:** If the query is ambiguous or unclear, ask a clarifying question in the 'answer' field.

        **CRITICAL RULES:**
        -   The 'answer' field MUST be null if 'requireProductData' is true or if the 'priceFilter' object is populated. The system has a separate agent to handle product-related responses.
        -   If you provide an 'answer', it must be polite, simple, direct, and as sort as possible.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            requireProductData: {
              type: Type.BOOLEAN,
            },
            priceFilter: {
              type: Type.OBJECT,
              properties: {
                x: { type: Type.INTEGER },
                y: { type: Type.INTEGER, nullable: true },
                operation: {
                  type: Type.STRING,
                  enum: ["around X", "under X", "above X", "between X and Y"],
                },
              },
              nullable: true,
              required: ["x", "operation"],
            },
            answer: { type: Type.STRING, nullable: true },
          },
          required: [],
        },
      },
    });

    return result.text;
  } else {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: body.contents,
      config: {
        systemInstruction: `You are a friendly and expert sales agent for Tsurayya Gadget Store. Your goal is to give a conversational and helpful answer based on a provided list of products that match the user's request.

        Follow these guidelines to craft your response:

        1.  You will be given the user's query and a corresponding list of products.
        2.  **No Matches:** If the product list is empty, politely inform the user that you couldn't find any products matching their criteria. You can ask them if they'd like to try a different search.
        3.  **Product Matches:** If the list contains products, select up to three of the most relevant items to highlight.
        4.  **Craft the Response:** For each highlighted product, create an engaging response. Mention the product's name and price, and briefly explain why it might be a good fit for the user.
        5.  **Format:** Combine the information into a single, natural-sounding paragraph for the 'answer' field. Do not simply list products and prices.
        6.  **Tone:** Be conversational, polite, and enthusiastic. For example, instead of "Product: X, Price: Y", try "A great option we have is the [Product Name], which costs [Price]. It's very popular because of [mention a feature or benefit]!".
        7.  **Conversation Flow:** Keep the conversation going. Do not use conversation-ending phrases like "Have a great day!" or "Cheers!". Instead, you could ask a follow-up question like "Does any of these sound interesting to you?".`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            answer: { type: Type.STRING },
          },
          required: [],
        },
      },
    });
    // console.log(result.text);

    return result.text;
  }
});
