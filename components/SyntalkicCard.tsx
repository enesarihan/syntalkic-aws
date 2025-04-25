import dayjs from "dayjs";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { CalendarIcon } from "lucide-react";
import { GradientButton } from "./ui/gradient-button";
import { getUserById } from "@/lib/actions/general.action";

const SyntalkicCard = async ({
  id,
  role,
  topic,
  createdAt,
  className,
  description,
  userId,
}: SyntalkicCardProps) => {
  const user = await getUserById(userId ? userId : "");
  const formattedDate = dayjs(createdAt || Date.now()).format("MMM D , YYYY");

  if (!user) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <p className="text-sm text-center text-muted-foreground mb-4">
          Please log in to view this content.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative w-[360px] max-sm:w-full overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col",
        className
      )}
    >
      <div className="absolute top-0 right-0">
        <Badge
          variant="secondary"
          className="rounded-bl-lg rounded-tr-xl px-4 py-1.5 font-medium"
        >
          {role}
        </Badge>
      </div>

      <div className="p-6 pt-10 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-xl text-center font-semibold capitalize text-foreground mb-2">
            {topic}
          </h3>

          <div className="flex justify-center items-center gap-5 mb-2 text-muted-foreground">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span className="text-sm">{formattedDate}</span>
            </div>
          </div>

          <div className="flex items-center justify-center mb-2">
            <p className="text-sm text-center text-muted-foreground mb-2">
              Created by{" "}
              <span className="font-semibold text-foreground">
                {user?.name}
              </span>
            </p>
          </div>

          <div className="mb-4">
            <p className="text-sm text-center text-muted-foreground">
              {description && description.length > 500
                ? description.slice(0, 250) + "..."
                : description || ""}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <GradientButton className="w-full" asChild>
            <Link
              href={`/syntalkic/${id}`}
              className="flex items-center justify-center w-full"
            >
              View Syntalkic
            </Link>
          </GradientButton>
        </div>
      </div>
    </div>
  );
};

export default SyntalkicCard;
