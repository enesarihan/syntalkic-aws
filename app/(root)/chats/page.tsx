import SyntalkicCard from "@/components/SyntalkicCard";
import { GradientButton } from "@/components/ui/gradient-button";
import { getCurrentUser } from "@/lib/actions/auth.actions";
import {
  getLatestSyntalkics,
  getSyntalkicByUserId,
} from "@/lib/actions/general.action";
import Image from "next/image";
import Link from "next/link";

const ChatPages = async () => {
  const user = await getCurrentUser();
  const [userSyntalkics, latestSyntalkics] = await Promise.all([
    await getSyntalkicByUserId(user?.id ?? ""),
    await getLatestSyntalkics({ userId: user?.id ?? "" }),
  ]);

  const hasPastSyntalkics = (userSyntalkics?.length ?? 0) > 0;
  const hasUpcomingSyntalkics = (latestSyntalkics?.length ?? 0) > 0;
  return (
    <>
      <section className="flex flex-col md:flex-row items-center justify-between gap-10 p-6 bg-muted rounded-2xl shadow-md">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2 className="text-2xl font-bold leading-tight">
            Get Your Syntalkic Ready with AI-Powered Chat
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose a topic and role, generate your personalized chat, and dive
            into a real-time conversation with AI tailored just for you.
          </p>

          <GradientButton
            variant="default"
            asChild
            className="w-full sm:w-auto"
          >
            <Link href={"/syntalkic"}>Generate a Syntalkic</Link>
          </GradientButton>
        </div>
        <Image
          alt="robo"
          className="hidden md:block mask-b-from-2 ml-4 rounded-4xl"
          src={"/robot-enes.png"}
          width={250}
          height={50}
        />
      </section>
      <section className="flex flex-col gap-6 mt-8">
        <h2>Your Syntalkics</h2>
        <div className="syntalkics-section">
          {hasPastSyntalkics ? (
            userSyntalkics?.map((syntalkic) => (
              <SyntalkicCard {...syntalkic} key={syntalkic.id} />
            ))
          ) : (
            <p>You haven&apos;t taken any syntalkics yet.</p>
          )}
        </div>
      </section>
      <section className="flex flex-col gap-6 mt-8 mb-24">
        <h2>Take from another Syntalkers</h2>
        <div className="syntalkics-section">
          {hasUpcomingSyntalkics ? (
            latestSyntalkics?.map((syntalkic) => (
              <SyntalkicCard {...syntalkic} key={syntalkic.id} />
            ))
          ) : (
            <p>There are no new syntalkics available.</p>
          )}
        </div>
      </section>
    </>
  );
};

export default ChatPages;
