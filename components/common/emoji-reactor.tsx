"use client";

import {
  handleSliceReaction,
  fetchSliceReactions,
} from "@/lib/api/slice-reaction";
import { sleep } from "@/lib/functions";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { toast } from "@/hooks/use-toast";
import errorHandler from "@/lib/error.handler";
import { useAuth } from "@/lib/supabase/provider";
import { Skeleton } from "../ui/skeleton";

export const EmojiReactor = ({
  sliceId,
  className,
}: {
  className?: string;
  sliceId: string;
}) => {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["slice-reactions", sliceId],
    queryFn: () => fetchSliceReactions(sliceId, user?.id || ""),
    enabled: !!sliceId,
  });

  const items = [
    {
      type: "thumbs-up",
      name: "Thumbs Up",
      emoji: "👍",
    },
    {
      type: "heart",
      name: "Heart",
      emoji: "🩷",
    },
    {
      type: "fire",
      name: "Fire",
      emoji: "🔥",
    },
    {
      type: "hooray",
      name: "Hooray",
      emoji: "🎉",
    },
    {
      type: "eye-with-love",
      name: "Eye with Love",
      emoji: "😍",
    },
    {
      type: "salute",
      name: "Salute",
      emoji: "🫡",
    },
    {
      type: "100",
      name: "100",
      emoji: "💯",
    },
    {
      type: "raised-hands",
      name: "Raised Hands",
      emoji: "🙌",
    },
  ];

  return (
    <motion.div
      className={cn("mt-4 flex gap-2 items-center flex-wrap", className)}
    >
      {isLoading ? (
        <Skeleton className="w-full h-4 rounded-sm" />
      ) : (
        items.map((item) => (
          <IconContainer
            key={item.type}
            sliceId={sliceId}
            data={data}
            {...item}
          />
        ))
      )}
    </motion.div>
  );
};

function IconContainer({
  type,
  name,
  emoji,
  sliceId,
  data,
}: {
  type: string;
  name: string;
  emoji: string;
  sliceId: string;
  data?: {
    [key: string]: {
      count: number;
      isReacted: boolean;
    };
  };
}) {
  const queryClient = useQueryClient();
  const [hovered, setHovered] = useState(false);

  const reactionState = useMemo(() => {
    return data?.[type] || { count: 0, isReacted: false };
  }, [data, type]);

  const mutation = useMutation({
    mutationFn: ({ type, emoji }: { type: string; emoji: string }) => {
      return handleSliceReaction(sliceId, type, emoji);
    },
    async onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["slice-reactions", sliceId],
        refetchType: "active",
      });
    },
    onError(error) {
      toast({
        title: "Error",
        description: errorHandler(error),
        variant: "destructive",
      });
    },
  });
  return (
    <div
      className="cursor-pointer"
      onClick={async () => {
        await mutation.mutateAsync({ type, emoji });
        await sleep(500);
        setHovered(false);
      }}
    >
      <motion.div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="flex items-center justify-center relative"
      >
        <AnimatePresence>
          {hovered && (
            <motion.div className="px-2 py-1 whitespace-pre rounded-md bg-gray-100 border dark:bg-neutral-800 dark:border-neutral-900 dark:text-white border-gray-200 text-neutral-700 absolute left-1/2 -translate-x-1/2 -top-8 w-fit text-xs">
              {name}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          className={cn(
            "w-12 flex items-center justify-center gap-2 lg:hover:scale-110 transition-all duration-100 bg-neutral-100 dark:bg-neutral-800 rounded-sm py-0.5 px-2",
            reactionState.isReacted === true &&
              "bg-neutral-200 dark:bg-neutral-600"
          )}
        >
          {emoji}
          <span className="text-xs">{reactionState.count || 0}</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
