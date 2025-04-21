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
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Your Syntalkic Ready with AI-Powered Chat</h2>
          <p className="text-lg">
            Ask your questions, get information, and request assistance.
          </p>
          <GradientButton variant={"variant"} asChild className="max-sm:w-full">
            <Link href={"/syntalkic"}>Generate an Syntalkic</Link>
          </GradientButton>
        </div>
        <Image
          alt="robo"
          className="hidden ml-16 rounded-xl md:block mask-b-from-3.5"
          src={"/robot-girl.png"}
          width={200}
          height={200}
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
