/* eslint-disable @typescript-eslint/no-explicit-any */
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/firebase/admin";
import { Timestamp } from "firebase-admin/firestore";

export async function POST(request: Request) {
  try {
    const { role, topic, userid, amount, gender } = await request.json();

    if (!role || !topic || !amount || !userid) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
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
      The user wants to talk with ${gender} assistant.

      Also, include a short description (3-5 sentences) of the conversation.
      Return the result as a valid JSON object with the following structure:
      {
        "description": "your engaging description here",
        "questions": ["Question 1", "Question 2", "Question 3", ...]
      }
      
      Do not include any additional explanation or formatting. Just return the JSON object.`,
    });

    const cleanedText = rawText.replace(/^```json|\n```$/g, "").trim();

    let result;
    try {
      result = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("JSON parse error:", parseError, "Raw:", cleanedText);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid JSON format from AI",
        }),
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
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing or invalid description/questions",
        }),
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
      gender,
      createdAt: Timestamp.fromDate(new Date()),
    };

    try {
      await db.collection("syntalkics").add(syntalkic);
    } catch (firebaseError: any) {
      console.error("Error saving to Firestore:", firebaseError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Error saving to Firestore: " + firebaseError.message,
        }),
        { status: 500 }
      );
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    console.error("POST request error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "An error occurred",
      }),
      { status: 500 }
    );
  }
}
