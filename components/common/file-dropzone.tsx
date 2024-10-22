"use client";

import {
  FileInput,
  FileUploaderContent,
  FileUploaderItem,
  useFileUpload,
} from "@/components/ui/file-uploader";
import { cn } from "@/lib/utils";
import { Paperclip } from "lucide-react";
import { forwardRef } from "react";
import type { Accept } from "react-dropzone";

interface FileSvgDrawProps {
  accept: Accept;
  isDragActive: boolean;
  isDragAccept: boolean;
  isDragReject: boolean;
}

const FileSvgDraw = (props: FileSvgDrawProps) => {
  const { accept, isDragActive, isDragAccept, isDragReject } = props;
  return (
    <div className="flex items-center justify-start pt-8 flex-col w-full min-h-[140px] rounded-lg gap-1">
      <svg
        className="w-8 h-8 text-gray-500 dark:text-gray-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 16"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
        />
      </svg>
      {!isDragActive ? (
        <div className="flex flex-col text-sm text-gray-500 dark:text-gray-400 text-center">
          <p>
            <span className="font-semibold">Click to upload</span>
            {" or drag and drop"}
          </p>
          {Object.entries(accept).map(([key, value]) => (
            <p key={key} className="uppercase">
              {value.map((v) => v.replace(".", "")).join(", ")}
            </p>
          ))}
        </div>
      ) : (
        <div className="flex flex-col text-sm text-gray-500 dark:text-gray-400 text-center">
          <p>{isDragAccept && "Drop file"}</p>
          <p>{isDragReject && "File not allowed"}</p>
        </div>
      )}
    </div>
  );
};

type FileUploaderProps = {
  files: File[] | null;
};

const FileDropzone = forwardRef<
  HTMLDivElement,
  FileUploaderProps & React.HTMLAttributes<HTMLDivElement>
>(({ files, className }, ref) => {
  const { dropzoneState, dropzoneOptions } = useFileUpload();

  return (
    <div
      ref={ref}
      className={cn(
        "grid w-full focus:outline-none overflow-hidden ",
        className,
        {
          "gap-2": files && files.length > 0,
        }
      )}
    >
      <div className="relative bg-background rounded-lg p-2">
        <FileInput>
          <FileSvgDraw
            accept={
              dropzoneOptions?.accept || {
                "image/*": [".jpg", ".jpeg", ".png", ".gif"],
              }
            }
            isDragActive={dropzoneState.isDragActive}
            isDragAccept={dropzoneState.isDragAccept}
            isDragReject={dropzoneState.isDragReject}
          />
        </FileInput>
        <FileUploaderContent>
          {files &&
            files.length > 0 &&
            files.map((file, i) => (
              <FileUploaderItem key={i} index={i}>
                <Paperclip className="h-4 w-4 stroke-current" />
                <span>{file.name}</span>
              </FileUploaderItem>
            ))}
        </FileUploaderContent>
      </div>
    </div>
  );
});

FileDropzone.displayName = "FileDropzone";

export default FileDropzone;
