"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FaGoogle } from "react-icons/fa";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "./ui/form";
import FormField from "./FormField";
import Link from "next/link";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/firebase/client";
import { signIn, signUp, signInWithGoogle } from "@/lib/actions/auth.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Logo from "./Logo";
import { authFormSchema } from "@/lib/validators";
import { useEffect, useState } from "react";

export default function AuthForm({ type }: { type: FormType }) {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const shouldOpen = sessionStorage.getItem("open-auth-dialog");
    if (shouldOpen === "true") {
      setOpen(true);
      sessionStorage.removeItem("open-auth-dialog");
    }
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "sign-up") {
        const { name, email, password } = values;

        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const result = await signUp({
          uid: userCredentials.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result?.success) {
          toast.error(result?.message);
          return;
        }

        toast.success("Account created successfully.Please Sign In");
        router.push("/sign-in");
      } else {
        const { email, password } = values;

        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const idToken = await userCredential.user.getIdToken();

        if (!idToken) {
          toast.error("Sign in failed");
          return;
        }

        await signIn({
          email,
          idToken,
        });

        toast.success("Sign in successfully!");
        router.push("/");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Authentication error:", error);
      let errorMessage = "An unexpected error occurred.";

      if (error?.code) {
        switch (error.code?.trim()) {
          case "auth/email-already-in-use":
            errorMessage = "Email address is already in use.";
            break;
          case "auth/invalid-email":
            errorMessage = "Invalid email address.";
            break;
          case "auth/weak-password":
            errorMessage = "Password is too weak.";
            break;

          case "auth/user-not-found":
            errorMessage = "User not found. Please check your email.";
            break;
          case "auth/wrong-password":
            errorMessage = "Incorrect password. Please try again.";
            break;
          case "auth/too-many-requests":
            errorMessage = "Too many attempts. Please try again later.";
            break;
          case "auth/user-disabled":
            errorMessage = "This account has been disabled.";
            break;

          case "auth/popup-closed-by-user":
            errorMessage = "Sign in popup was closed by user.";
            break;
          case "auth/network-request-failed":
            errorMessage =
              "A network error occurred. Please check your connection.";
            break;
          case "auth/invalid-credential":
            errorMessage = "Invalid email or password. Please try again.";
            break;
          default:
            errorMessage = `Error: ${error.message}`;
            break;
        }
      }

      toast.error(errorMessage);
    }
  }

  const signInWithGoogleClient = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const response = await signInWithGoogle(idToken);

      if (!response) {
        return {
          success: false,
          message: "Failed with signing Google.",
        };
      }

      toast.success("Sign in successfully!");
      router.push("/");
    } catch (error) {
      console.error("Failed to Sign in with Google:", error);
    }
  };

  const isSignIn = type === "sign-in";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size={"lg"}>
          {isSignIn ? "Sign in" : "Sign Up"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border"
            aria-hidden="true"
          >
            <Logo
              type="single"
              className="text-4xl text-black dark:text-white capitalize"
            />
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">Welcome back</DialogTitle>
            <DialogDescription className="sm:text-center">
              Enter your credentials to login to your account.
            </DialogDescription>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-2">
                {!isSignIn && (
                  <FormField
                    control={form.control}
                    name={"name"}
                    label="Name"
                    placeholder="Your Name"
                  />
                )}
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name={"email"}
                  label="Email"
                  placeholder="Your email address"
                  type="email"
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name={"password"}
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? "Loading..."
                : isSignIn
                ? "Sign in"
                : "Create an account"}
            </Button>
          </form>
        </Form>

        <div className="flex items-center gap-3 before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
          <span className="text-xs text-muted-foreground">Or</span>
        </div>

        <Button variant="outline" onClick={signInWithGoogleClient}>
          <FaGoogle className="mr-2" /> Login with Google
        </Button>

        <p className="text-center">
          {isSignIn ? "No account yet" : "Have an account already?"}
          <Link
            href={isSignIn ? "/sign-up" : "/sign-in"}
            className="font-bold ml-1"
            onClick={() => {
              sessionStorage.setItem("open-auth-dialog", "true");
            }}
          >
            {!isSignIn ? "Sign in " : "Sign Up"}
          </Link>
        </p>
      </DialogContent>
    </Dialog>
  );
}
