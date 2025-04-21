import dayjs from "dayjs";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { CalendarIcon, StarIcon } from "lucide-react";
import { GradientButton } from "./ui/gradient-button";

const SyntalkicCard = ({
  id,
  role,
  topic,
  createdAt,
  className,
  description,
}: SyntalkicCardProps) => {
  const formattedDate = dayjs(createdAt || Date.now()).format("MMM D , YYYY");
  return (
    <div
      className={cn(
        "relative  w-[360px] max-sm:w-full overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
        className
      )}
    >
      <div className="absolute top-0 right-0">
        <Badge
          variant="secondary"
          className="rounded-bl-lg rounded-tr-xl px-4 py-1.5 font-medium"
        >
          {topic}
        </Badge>
      </div>

      <div className="p-6 pt-10">
        <h3 className="text-xl font-semibold capitalize text-foreground mb-3">
          {role} Chat
        </h3>

        <div className="flex items-center gap-5 mb-6 text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            <span className="text-sm">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <StarIcon className="h-4 w-4 text-amber-400" />
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-4">
            {description && description.length > 150
              ? description.slice(0, 100) + "..."
              : description || ""}
          </p>
        </div>

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
  );
};

export default SyntalkicCard;
