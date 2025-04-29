"use client";
import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GradientButton } from "./ui/gradient-button";
import { createSyntalker } from "@/constants";
import Logo from "./Logo";
import GetUserPhoto from "./GetUserPhoto";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({
  userName,
  userId,
  type,
  questions,
  topic,
  role,
  gender,
}: AgentProps) => {
  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);

  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);
    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };
    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (error: Error) => {
      console.error("Detailed Vapi Error:", JSON.stringify(error, null, 2));
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (callStatus === CallStatus.FINISHED) {
      router.push("/chats");
    }
  }, [callStatus, router]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    if (type === "generate") {
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
        variableValues: { username: userName, userid: userId },
      });
    } else {
      const formattedQuestions =
        questions?.map((q) => `- ${q}`).join("\n") || "";
      const normalizedGender =
        gender?.toLowerCase() === "male" || gender?.toLowerCase() === "female"
          ? (gender.toLowerCase() as "male" | "female")
          : "female";

      await vapi.start(createSyntalker(normalizedGender), {
        variableValues: {
          topic: topic || "Random Chat",
          role: role || "Friendly Stranger",
          questions: formattedQuestions,
        },
      });
    }
  };

  const handleDisconnect = async () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  const latestMessage = messages[messages.length - 1]?.content;
  const isCallIdle =
    callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;

  return (
    <div className="flex flex-col items-center space-y-6 w-full max-w-xl mx-auto mt-10 px-4">
      {/* AI Section */}
      <div className="flex flex-col items-center space-y-2">
        <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 text-black text-6xl">
          <Logo type="single" className="" />
          {isSpeaking && (
            <span className="absolute bottom-0 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          )}
        </div>
        <h3 className="text-lg font-semibold">AI</h3>
      </div>

      {/* User Section */}
      <div className="flex flex-col items-center space-y-2 border p-4 rounded-xl shadow-md w-full bg-white dark:bg-dark-100">
        <GetUserPhoto className="w-24 h-24 rounded-full object-cover" />
        <h3 className="text-xl font-medium dark:text-white">{userName}</h3>
      </div>

      {/* Message Preview */}
      {latestMessage && (
        <div className="w-full p-4 rounded-lg bg-gray-100 shadow-inner animate-fadeIn">
          <p className="text-center text-sm text-gray-800">{latestMessage}</p>
        </div>
      )}

      {/* Call Controls */}
      <div className="w-full flex justify-center">
        {callStatus !== CallStatus.ACTIVE ? (
          <GradientButton className="relative px-6 py-2" onClick={handleCall}>
            <span
              className={cn(
                "absolute left-0 right-0 mx-auto top-0 h-full w-full rounded-full animate-ping opacity-50",
                callStatus !== CallStatus.CONNECTING && "hidden"
              )}
            />
            <span>{isCallIdle ? "Call" : ". . ."}</span>
          </GradientButton>
        ) : (
          <GradientButton
            className="px-6 py-2 bg-red-500 hover:bg-red-600"
            onClick={handleDisconnect}
          >
            End
          </GradientButton>
        )}
      </div>
    </div>
  );
};

export default Agent;
