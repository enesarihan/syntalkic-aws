import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/firebase/admin";

export async function POST(request: Request) {
  try {
    const { role, topic, userid, amount, description } = await request.json();

    const { text: rawText } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Prepare interesting and unique questions for a casual conversation.
        Generate a completely new and diverse set of questions for each request. Avoid repeating question themes or structures.
        The conversation topic is: ${topic}.
        The desired number of questions is: ${amount}.
        The user wants to engage in a conversation with someone who is a: ${role}.
        Generate questions that this person (${role}) would naturally ask, keeping them engaging and relevant to the topic.
        Ensure the questions cover a range of conversational styles, including open-ended, thought-provoking, and light-hearted inquiries.
        And make a description of the conversation. 3-5 sentences. description should be engaging and relevant to the topic. save it in the description field. ${description}
        Return only the questions in a JSON array format. Do not include any additional text or explanations.
        The questions will be read by a voice assistant, so avoid using any special characters like / or * that could interfere with speech synthesis.
        Format the questions as a JSON array: ["Question 1", "Question 2", "Question 3", ...]
        Thank you!`,
    });

    // JSON array'i güvenli şekilde ayıklamak için ilk ve son köşeli parantez arasında olan kısmı alalım
    const jsonMatch = rawText.match(/\[\s*(".*?"\s*(,\s*".*?")*)\s*\]/s);

    if (!jsonMatch) {
      console.error("No valid JSON array found in text:", rawText);
      return Response.json(
        { success: false, error: "Invalid questions format" },
        { status: 400 }
      );
    }

    let parsedQuestions;
    try {
      parsedQuestions = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("JSON parse error:", parseError, "Raw:", jsonMatch[0]);
      return Response.json(
        { success: false, error: "Invalid JSON array format" },
        { status: 400 }
      );
    }

    const syntalkic = {
      role,
      topic,
      questions: parsedQuestions,
      userId: userid,
      finalized: true,
      description: description,
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
