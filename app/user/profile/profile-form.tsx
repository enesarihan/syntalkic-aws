"use client";
import FormField from "@/components/FormField";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormLabel,
  FormField as FieldOrg,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { auth, db } from "@/firebase/client";
import { updatePasswordU, updateProfile } from "@/lib/actions/user.actions";
import { UploadButton } from "@/lib/uploadthing";
import { updateProfileSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const ProfileForm = () => {
  const router = useRouter();
  const user = auth.currentUser;
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [uploadToken, setUploadToken] = useState<string | null>(null);

  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: "",
      email: "",
      newPassword: "",
      confirmPassword: "",
      profileImage: "",
    },
  });

  useEffect(() => {
    const getToken = async () => {
      const token = await auth.currentUser?.getIdToken();
      setUploadToken(token ?? null);
    };
    getToken();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userData = {
          name: user.displayName || "",
          email: user.email || "",
          profileImage: "",
        };

        const userDocRef = doc(db, "users", user.uid);
        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            setProfileImageUrl(data?.profileImageUrl || null);
            userData.profileImage = data?.profileImageUrl || "";
          }
        } catch (error) {
          console.error("Failed to fetch profile image:", error);
          toast.error("Failed to fetch profile image.");
        }

        form.reset({
          ...userData,
          profileImage: userData.profileImage,
        });
      }

      return () => unsubscribe();
    });
  }, [form]);

  const onSubmit = async (values: z.infer<typeof updateProfileSchema>) => {
    try {
      const res = await updateProfile({
        name: values.name,
      });

      if (values.newPassword) {
        const passRes = await updatePasswordU(values.newPassword);
        if (!passRes.success) return toast.error(res.message);
        toast.success("Password changed successfully, Please Sign-in Again!");
        router.push("/sign-in");
      }

      let newProfileImageUrl = profileImageUrl;
      if (values.profileImage && values.profileImage !== profileImageUrl) {
        newProfileImageUrl = values.profileImage;
        const userDocRef = doc(db, "users", user!.uid);
        await updateDoc(userDocRef, {
          profileImageUrl: newProfileImageUrl,
        });
      }

      if (!res.success) return toast.error(res.message);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const isGoogleUser = user?.providerData?.some(
    (provider) => provider.providerId === "google.com"
  );

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="email"
          type="email"
          label="Email"
          disVal={true}
        />
        <FormField
          control={form.control}
          name="name"
          type="text"
          label="Name"
        />
        {!isGoogleUser && (
          <>
            <FormField
              control={form.control}
              name="newPassword"
              type="password"
              label="New Password"
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              type="password"
              label="Confirm Password"
            />

            <FieldOrg
              control={form.control}
              name="profileImage"
              render={() => (
                <FormItem className="w-full">
                  <FormLabel>Upload Profile Image</FormLabel>
                  <FormControl>
                    <UploadButton
                      endpoint={"imageUploader"}
                      appearance={{
                        button:
                          "bg-gradient-to-r cursor-pointer from-indigo-500 via-purple-500 to-pink-500 text-white font-bold py-2 px-6 rounded-full shadow-xl hover:scale-105 active:scale-95 transition-transform duration-300",
                        container:
                          "flex flex-col items-center justify-center gap-4",
                        allowedContent: "text-xs text-gray-300",
                      }}
                      input={{
                        token: uploadToken as string,
                      }}
                      onClientUploadComplete={async (res) => {
                        const uploadedFile = res?.[0];

                        const url = uploadedFile?.url || uploadedFile?.ufsUrl;

                        if (!url) {
                          toast.error("Can't find the URL.");
                          return;
                        }

                        setProfileImageUrl(url);
                        form.setValue("profileImage", url, {
                          shouldValidate: true,
                        });
                      }}
                      onUploadError={(error: Error) => {
                        toast.error(`ERROR! ${error.message}`);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <Button
          className="w-full"
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Loading..." : "Update Profile"}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
