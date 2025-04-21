import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/firebase/admin";

export async function POST(request: Request) {
  try {
    const { role, topic, userid, amount } = await request.json();

    if (!role || !topic || !amount || !userid) {
      return Response.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { text: rawText } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Prepare interesting and unique questions for a casual conversation.
      Generate a completely new and diverse set of questions for each request. Avoid repeating question themes or structures.

      The conversation topic is: ${topic}.
      The desired number of questions is: ${amount}.
      The user wants to engage in a conversation with someone who is a: ${role}.
      Generate questions that this person (${role}) would naturally ask, keeping them engaging and relevant to the topic.
      Ensure the questions cover a range of conversational styles, including open-ended, thought-provoking, and light-hearted inquiries.

      Also, include a short description (3-5 sentences) of the conversation.
      Return the result as a valid JSON object with the following structure:
      {
        "description": "your engaging description here",
        "questions": ["Question 1", "Question 2", "Question 3", ...]
      }
      
      Do not include any additional explanation or formatting. Just return the JSON object.`,
    });

    let result;
    try {
      result = JSON.parse(rawText);
    } catch (parseError) {
      console.error("JSON parse error:", parseError, "Raw:", rawText);
      return Response.json(
        { success: false, error: "Invalid JSON format from AI" },
        { status: 400 }
      );
    }

    const { description, questions } = result;

    if (
      !description ||
      typeof description !== "string" ||
      !questions ||
      !Array.isArray(questions) ||
      questions.length === 0
    ) {
      return Response.json(
        { success: false, error: "Missing or invalid description/questions" },
        { status: 400 }
      );
    }

    const syntalkic = {
      role,
      topic,
      questions,
      userId: userid,
      finalized: true,
      description,
      createdAt: new Date().toISOString(),
    };

    await db.collection("syntalkics").add(syntalkic);

    return Response.json({ success: true }, { status: 200 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("POST request error:", error);
    return Response.json(
      { success: false, error: error.message || "An error occurred" },
      { status: 500 }
    );
  }
}
