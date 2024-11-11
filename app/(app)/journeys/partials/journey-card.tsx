import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface JourneyCardProps {
  journey: Journey & { users: UserInfo };
  showCreator?: boolean;
}
const JourneyCard = ({ journey, showCreator = false }: JourneyCardProps) => {
  return (
    <Link
      href={`/journeys/${journey.id}`}
      className={cn(
        "flex items-center gap-4 w-full px-6 py-3 h-[110px] border-2 rounded-xl hover:bg-primary-foreground cursor-pointer",
        showCreator && "h-[125px]"
      )}
    >
      <Image
        src={journey.cover_img_url || "/assets/images/default-cover-image.png"}
        alt="journey-cover-image"
        width={96}
        height={96}
        className="w-[72px] h-[72px] min-w-[72px] min-h-[72px] max-w-[72px] max-h-[72px] lg:w-20 lg:h-20 lg:min-w-20 lg:min-h-20 lg:max-w-20 lg:max-h-20 rounded-full object-cover"
      />
      <div className="flex flex-col gap-2 w-full h-full">
        <p className="text-md lg:text:lg font-medium line-clamp-1">
          {journey.name}
        </p>
        <p className="text-sm text-neutral-700 dark:text-neutral-400 line-clamp-2">
          {journey.description}
        </p>
        {showCreator && (
          <p className="mt-auto text-sm text-right text-neutral-500">
            {journey.users.username}
          </p>
        )}
      </div>
    </Link>
  );
};

export default JourneyCard;
