import Vapi from "@vapi-ai/web";

// Singleton pattern - sadece bir instance oluştur
let vapiInstance: Vapi | null = null;

export const getVapi = (): Vapi => {
  if (!vapiInstance) {
    const token = process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN;
    if (!token) {
      throw new Error("NEXT_PUBLIC_VAPI_WEB_TOKEN is not defined");
    }
    vapiInstance = new Vapi(token);
  }
  return vapiInstance;
};

// Backward compatibility için
export const vapi = getVapi();
