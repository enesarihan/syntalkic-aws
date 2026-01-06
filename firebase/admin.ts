import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const initFirebaseAdmin = () => {
  const apps = getApps();

  if (!apps.length) {
    // Environment variables'ları temizle (çift tırnak ve boşlukları kaldır)
    const projectId = process.env.FIREBASE_PROJECT_ID?.replace(
      /^["']|["']$/g,
      ""
    ).trim();
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.replace(
      /^["']|["']$/g,
      ""
    ).trim();
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(
      /^["']|["']$/g,
      ""
    ).trim();

    // Build-time için dummy değerleri kontrol et
    const isBuildTime =
      projectId === "dummy-build-time" ||
      !projectId ||
      !clientEmail ||
      !privateKey;

    if (isBuildTime) {
      // Build-time'da Firebase Admin'i initialize etme
      // Sadece runtime'da kullanılacak
      // Geçici olarak boş app oluştur (build hatasını önlemek için)
      try {
        // App zaten yoksa, minimal bir app oluştur
        // Bu sadece build'in devam etmesi için
        initializeApp({
          projectId: "dummy-build-time",
        });
      } catch {
        // Hata olursa yok say - build devam edecek
      }
    } else {
      // Runtime'da gerçek credentials ile initialize et
      if (!projectId || !clientEmail || !privateKey) {
        throw new Error(
          "Firebase Admin SDK credentials are missing. Please check your environment variables."
        );
      }

      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, "\n"),
        }),
      });
    }
  }

  return {
    auth: getAuth(),
    db: getFirestore(),
  };
};

export const { auth, db } = initFirebaseAdmin();
