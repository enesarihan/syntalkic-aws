import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.actions";
import { getSyntalkicById } from "@/lib/actions/general.action";
import { redirect } from "next/navigation";

const GeneratedSyntalkic = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();
  const syntalkic = await getSyntalkicById(id);

  if (!syntalkic) redirect("/");

  return (
    <>
      <div className="flex flex-row gap-4 justify-between">
        <div className="flex flex-col gap-4 text-center">
          <div className="flex flex-row gap-4 items-center">
            <h3 className="capitalize">Syntalkic as {syntalkic.role}</h3>
          </div>
          <p className="bg-gray-400 dark:bg-dark-200 px-4 py-2 rounded-lg h-fit capitalize">
            {syntalkic.topic}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Agent
          userName={user?.name || ""}
          type="syntalkic"
          syntalkicId={id}
          userId={user?.id}
          questions={syntalkic.questions}
          role={syntalkic.role}
          topic={syntalkic.topic}
          gender={syntalkic.gender}
        />
      </div>
    </>
  );
};

export default GeneratedSyntalkic;
