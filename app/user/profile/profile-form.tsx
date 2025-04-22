"use client";
import FormField from "@/components/FormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { auth } from "@/firebase/client";
import { updateProfile } from "@/lib/actions/user.actions";
import { updateProfileSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const ProfileForm = () => {
  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const userData = {
          name: user.displayName || "",
          email: user.email || "",
        };
        form.reset(userData);
      } else {
        toast.error("No user logged in");
      }

      return () => unsubscribe();
    });
  }, [form]);

  const onSubmit = async (values: z.infer<typeof updateProfileSchema>) => {
    console.log("Form submitted with values:", values);

    try {
      const res = await updateProfile({
        name: values.name,
      });

      if (!res.success) return toast.error(res.message);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

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

        <Button
          className="w-full"
          type="submit"
          size={"lg"}
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Loading..." : "Update Profile"}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
