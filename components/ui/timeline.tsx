"use client";

import { cn } from "@/lib/utils";
import { formatDate } from "date-fns";
import { PlusIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./button";
import MorePopover from "../common/more-popover";
import { useRouter } from "next/navigation";
import { Skeleton } from "./skeleton";
import { EmojiReactor } from "../common/emoji-reactor";

export const Timeline = ({
  data,
  journeyId,
  title,
  isOwner,
  isPublic,
}: {
  data: Slice[];
  journeyId: string;
  title: string;
  isOwner: boolean;
  isPublic: boolean;
}) => {
  const router = useRouter();

  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const onImageLoad = (img: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Ensure the image is visible
    img.currentTarget.style.opacity = "1";
    // Find the skeleton element and hide it
    const skeleton = img.currentTarget
      .closest(".relative")
      ?.querySelector(".absolute");
    if (skeleton) {
      (skeleton as HTMLElement).style.opacity = "0";
      (skeleton as HTMLElement).style.visibility = "hidden";
    }
  };

  return (
    <div className="relative w-full max-w-[1200px] h-full bg-white dark:bg-neutral-950 md:px-10 pb-20">
      {/* Zoomed image */}
      {zoomedImage && (
        <>
          <div
            className="fixed inset-0 z-50 flex items-center bg-black/75 justify-center"
            onClick={() => setZoomedImage(null)}
          >
            <div className="max-w-[90vw] md:max-w-[600px] max-h-[80vh] w-full h-auto relative aspect-square">
              <div className="absolute top-2 right-2 cursor-pointer p-1 bg-black/50 rounded-full">
                <XIcon
                  width={20}
                  height={20}
                  onClick={() => setZoomedImage(null)}
                />
              </div>
              <Image
                src={zoomedImage}
                alt="zoomed-image"
                width={1000}
                height={1000}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </>
      )}

      {data.length > 0 ? (
        <div className="relative max-w-7xl mx-auto">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex justify-start pt-10 md:pt-20 md:gap-10"
            >
              <div className="flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
                <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white dark:bg-black flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 p-2" />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="hidden md:block text-xl md:pl-20 md:text-2xl font-bold font-bricolage text-neutral-500 dark:text-neutral-500 ">
                    {item.name}
                  </h3>
                  <p className="hidden md:block text-md md:pl-20 md:text-lg font-semibold text-neutral-600 dark:text-neutral-300">
                    {formatDate(item.slice_date, "PPP")}
                  </p>
                </div>
              </div>
              <div className="relative pl-20 pr-4 md:pl-4 w-full">
                <div className="flex items-start justify-between">
                  <h3 className="md:hidden block text-2xl text-left font-bold text-neutral-500 dark:text-neutral-500">
                    {item.name}
                  </h3>
                  <div className={cn("mt-2 ml-2", !isOwner && "hidden")}>
                    <MorePopover btnClassname="text-neutral-500 w-4 h-4 md:hidden">
                      <div className="flex flex-col gap-1">
                        <div
                          onClick={() =>
                            router.push(
                              `/journeys/${journeyId}/slices/${item.id}/edit`
                            )
                          }
                          className="px-3 py-1 hover:bg-primary-foreground cursor-pointer rounded-md"
                        >
                          Edit
                        </div>
                      </div>
                    </MorePopover>
                  </div>
                </div>
                <p className="md:hidden text-neutral-600 dark:text-neutral-300 font-semibold mt-1 mb-3 text-sm">
                  {formatDate(item.slice_date, "PPP")}
                </p>
                <div className="flex items-start">
                  <p className="text-neutral-800 dark:text-neutral-300 text-sm md:text-[16px] leading-6 font-normal whitespace-pre-line">
                    {item.description}
                  </p>
                  <div className={cn("ml-2", !isOwner && "hidden")}>
                    <MorePopover btnClassname="text-neutral-500 w-4 h-4 hidden md:flex ">
                      <div className="flex flex-col gap-1">
                        <div
                          onClick={() =>
                            router.push(
                              `/journeys/${journeyId}/slices/${item.id}/edit`
                            )
                          }
                          className="px-3 py-1 hover:bg-primary-foreground cursor-pointer rounded-md"
                        >
                          Edit
                        </div>
                      </div>
                    </MorePopover>
                  </div>
                </div>
                {isPublic && <EmojiReactor sliceId={item.id} />}
                <div
                  className={cn(
                    "flex flex-col lg:grid xl:grid-cols-2 gap-4 mt-4"
                  )}
                >
                  {item.img_urls?.map((imageUrl, i) => (
                    <div key={i} className="relative aspect-square">
                      <Skeleton className="absolute inset-0 w-full h-full" />
                      <Image
                        src={imageUrl}
                        alt="slice-image"
                        width={500}
                        height={500}
                        loading="lazy"
                        className="rounded-lg object-cover w-full h-full aspect-square shadow-md"
                        onClick={() => setZoomedImage(imageUrl)}
                        onLoad={(img) => onImageLoad(img)}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute left-8 top-0 h-full overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "></div>
            </div>
          ))}
        </div>
      ) : isOwner ? (
        <div className="mt-12 md:mt-20 flex flex-col gap-8 items-center">
          <Image
            src="/assets/vectors/no-data.svg"
            alt="no-data"
            width={200}
            height={200}
            className="w-full max-w-[200px] h-auto mx-auto"
          />
          <Link
            href={`/create?type=slice&journeyId=${journeyId}&title=${title}`}
          >
            <Button variant="secondary">
              <PlusIcon width={20} height={20} />
              <p>Add your first slice of the journey!</p>
            </Button>
          </Link>
        </div>
      ) : (
        <div className="mt-12 md:mt-20 flex flex-col gap-8 items-center">
          <Image
            src="/assets/vectors/no-data.svg"
            alt="no-data"
            width={200}
            height={200}
            className="w-full max-w-[200px] h-auto mx-auto"
          />
          <p className="text-lg font-bricolage font-medium">No slices yet.</p>
        </div>
      )}
    </div>
  );
};
