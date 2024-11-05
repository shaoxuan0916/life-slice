import Image from "next/image";
import Link from "next/link";

const JourneyCard = ({ journey }: { journey: Journey }) => {
  return (
    <Link
      href={`/journeys/${journey.id}`}
      className="flex items-center gap-4 w-full px-6 py-3 border-2 rounded-xl hover:bg-primary-foreground cursor-pointer"
    >
      <Image
        src={journey.cover_img_url || "/assets/images/default-cover-image.png"}
        alt="journey-cover-image"
        width={96}
        height={96}
        className="w-16 h-16 min-w-16 min-h-16 max-w-16 max-h-16 lg:w-20 lg:h-20 lg:min-w-20 lg:min-h-20 lg:max-w-20 lg:max-h-20 rounded-full object-cover"
      />
      <div className="flex flex-col">
        <p className="text-md lg:text:lg font-medium">{journey.name}</p>
        <p className="text-sm text-neutral-700 dark:text-neutral-400 line-clamp-3">
          {journey.description}
        </p>
      </div>
    </Link>
  );
};

export default JourneyCard;
