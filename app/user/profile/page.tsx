import { getCurrentUser } from "@/lib/actions/auth.actions";
import ProfileForm from "./profile-form";
import GetUserPhoto from "@/components/GetUserPhoto";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, UserIcon } from "lucide-react";

const Profile = async () => {
  const user = await getCurrentUser();
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="grid gap-8 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>User Information</CardTitle>
            <CardDescription>Your personal details</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center md:items-start space-y-6">
            <GetUserPhoto className="h-32 w-32 rounded-full border-4 border-background shadow-md" />

            <div className="w-full space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{user?.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{user?.email}</span>
                </div>

                <Separator />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Update your profile information</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
