"use client";
import { cn } from "@/lib/utils";
import { formatDate } from "date-fns";
import { useScroll, useTransform, motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

export const Timeline = ({
  data,
  title,
  description,
}: {
  data: Slice[];
  title: string;
  description?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full h-full bg-white dark:bg-neutral-950 font-sans md:px-10"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 lg:px-10">
        <h2 className="text-lg md:text-4xl mb-4 text-black font-bricolage dark:text-white max-w-4xl">
          {title}
        </h2>
        <p className="text-neutral-700 dark:text-neutral-300 text-sm md:text-base max-w-sm">
          {description}
        </p>
      </div>

      {data.length > 0 && (
        <div ref={ref} className="relative max-w-7xl mx-auto pb-40">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex justify-start pt-10 md:pt-20 md:gap-10"
            >
              <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
                <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white dark:bg-black flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 p-2" />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="hidden md:block text-xl md:pl-20 md:text-4xl font-bold text-neutral-500 dark:text-neutral-500 ">
                    {item.name}
                  </h3>
                  <p className="hidden md:block text-md md:pl-20 md:text-lg text-neutral-600 dark:text-neutral-300">
                    {formatDate(item.slice_date, "PPP")}
                  </p>
                </div>
              </div>

              <div className="relative pl-20 pr-4 md:pl-4 w-full">
                <h3 className="md:hidden block text-2xl text-left font-bold text-neutral-500 dark:text-neutral-500">
                  {item.name}
                </h3>
                <p className="md:hidden text-neutral-700 dark:text-neutral-300 mt-1 text-sm">
                  {formatDate(item.slice_date, "PPP")}
                </p>
                <p className="text-neutral-800 dark:text-neutral-300 text-sm md:text-lg font-normal mt-2 mb-8">
                  {item.description}
                </p>
                <div
                  className={cn(
                    "grid grid-cols-2 gap-4",
                    item.img_urls.length <= 2 && "grid-cols-1"
                  )}
                >
                  {item.img_urls?.map((imageUrl, i) => (
                    <Image
                      key={i}
                      src={imageUrl}
                      alt="slice-image"
                      width={500}
                      height={500}
                      className="rounded-lg object-cover w-fit h-full max-h-60 aspect-video shadow-md"
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
          <div
            style={{
              height: height + "px",
            }}
            className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
          >
            <motion.div
              style={{
                height: heightTransform,
                opacity: opacityTransform,
              }}
              className="absolute inset-x-0 top-0 w-[2px] h-full bg-gradient-to-t from-purple-500 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};
