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
    // VAPI instance'ının hazır olduğundan emin ol
    if (!vapi) {
      console.error("VAPI SDK not initialized");
      return;
    }

    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
      setMessages([]); // Mesajları temizle
    };
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
      
      // enumerateDevices hatası için özel işleme
      const errorMessage = error.message || JSON.stringify(error);
      if (errorMessage.includes("enumerateDevices") || errorMessage.includes("Cannot read properties")) {
        setCallStatus(CallStatus.INACTIVE);
        alert(
          "Mikrofon cihazlarına erişilemiyor. Bu genellikle HTTP bağlantısı kullanıldığında olur.\n\n" +
          "Çözüm: Uygulamayı HTTPS üzerinden açın veya localhost kullanın."
        );
      }
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      // Cleanup: Event listener'ları kaldır
      try {
        vapi.off("call-start", onCallStart);
        vapi.off("call-end", onCallEnd);
        vapi.off("message", onMessage);
        vapi.off("speech-start", onSpeechStart);
        vapi.off("speech-end", onSpeechEnd);
        vapi.off("error", onError);
        
        // Eğer aktif bir çağrı varsa, durdur
        if (vapi && typeof vapi.isCallActive === "function" && vapi.isCallActive()) {
          vapi.stop().catch((err) => {
            console.error("Error stopping VAPI during cleanup:", err);
          });
        }
      } catch (error) {
        console.error("Error during VAPI cleanup:", error);
      }
    };
  }, []);

  useEffect(() => {
    if (callStatus === CallStatus.FINISHED) {
      router.push("/chats");
    }
  }, [callStatus, router]);

  const handleCall = async () => {
    // Eğer zaten bağlanıyorsa veya aktifse, tekrar başlatma
    if (callStatus === CallStatus.CONNECTING || callStatus === CallStatus.ACTIVE) {
      return;
    }

    try {
      setCallStatus(CallStatus.CONNECTING);

      // Mikrofon erişim kontrolü
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
        const isHttps = window.location.protocol === "https:";
        
        if (!isLocalhost && !isHttps) {
          alert(
            "Mikrofon erişimi için HTTPS gereklidir. Lütfen uygulamayı HTTPS üzerinden açın.\n\n" +
            "EC2'de HTTPS kurulumu için Nginx reverse proxy kullanabilirsiniz."
          );
          setCallStatus(CallStatus.INACTIVE);
          return;
        }
      }

      // Mikrofon izni iste (eğer daha önce verilmemişse)
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (permissionError) {
        console.error("Microphone permission error:", permissionError);
        if (permissionError instanceof Error) {
          if (permissionError.name === "NotAllowedError") {
            alert("Mikrofon izni reddedildi. Lütfen tarayıcı ayarlarından mikrofon iznini etkinleştirin.");
          } else if (permissionError.name === "NotFoundError") {
            alert("Mikrofon bulunamadı. Lütfen bir mikrofon cihazı bağladığınızdan emin olun.");
          } else {
            alert(`Mikrofon erişimi hatası: ${permissionError.message}`);
          }
        }
        setCallStatus(CallStatus.INACTIVE);
        return;
      }

      // VAPI başlatma işlemi
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
    } catch (error) {
      console.error("VAPI start error:", error);
      setCallStatus(CallStatus.INACTIVE);
      // Hata mesajını kullanıcıya göster
      if (error instanceof Error) {
        // enumerateDevices hatası için özel mesaj
        if (error.message.includes("enumerateDevices") || error.message.includes("Cannot read properties")) {
          alert(
            "Mikrofon cihazlarına erişilemiyor. Bu genellikle HTTP bağlantısı kullanıldığında olur.\n\n" +
            "Çözüm: Uygulamayı HTTPS üzerinden açın veya localhost kullanın."
          );
        } else {
          alert(`Call başlatılamadı: ${error.message}`);
        }
      }
    }
  };

  const handleDisconnect = async () => {
    try {
      setCallStatus(CallStatus.FINISHED);
      await vapi.stop();
    } catch (error) {
      console.error("VAPI stop error:", error);
      // Hata olsa bile durumu sıfırla
      setCallStatus(CallStatus.INACTIVE);
    }
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
        <GetUserPhoto className="w-24 h-24 text-5xl rounded-full object-cover" />
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
