import React, { useRef, useState } from "react";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Image, { StaticImageData } from "next/image";

function ImageCropper(props: {
  imageToCrop: string | StaticImageData;
  onImageCropped: (croppedImage: File) => void;
}) {
  const { imageToCrop, onImageCropped } = props;

  const [cropConfig, setCropConfig] = useState<Crop>({
    unit: "px",
    width: 100,
    height: 100,
    x: 100,
    y: 100,
  });

  const imageRef = useRef<HTMLImageElement>(null);

  async function cropImage(crop: Crop) {
    if (imageRef && crop.width && crop.height) {
      const croppedImage = await getCroppedImage(
        imageRef.current || new HTMLImageElement(),
        crop,
        "croppedImage.jpeg"
      );
      onImageCropped(croppedImage);
    }
  }

  function getCroppedImage(
    sourceImage: HTMLImageElement,
    cropConfig: Crop,
    fileName: string
  ) {
    // Calculate the natural size of the crop area
    const scaleX = sourceImage.naturalWidth / sourceImage.width;
    const scaleY = sourceImage.naturalHeight / sourceImage.height;
    const naturalWidth = cropConfig.width * scaleX;
    const naturalHeight = cropConfig.height * scaleY;

    // Set the canvas size to the natural size of the crop area
    const canvas = document.createElement("canvas");
    canvas.width = naturalWidth;
    canvas.height = naturalHeight;
    const ctx = canvas.getContext("2d");

    ctx?.drawImage(
      sourceImage,
      cropConfig.x * scaleX,
      cropConfig.y * scaleY,
      naturalWidth,
      naturalHeight,
      0,
      0,
      naturalWidth,
      naturalHeight
    );

    return new Promise<File>((resolve, reject) => {
      canvas.toBlob((blob) => {
        // returning an error
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        const file = new File([blob], fileName, { type: "image/jpeg" });
        resolve(file);
      }, "image/jpeg");
    });
  }

  return (
    <ReactCrop
      aspect={1 / 1}
      crop={cropConfig}
      keepSelection
      ruleOfThirds
      onComplete={(cropConfig) => cropImage(cropConfig)}
      onChange={(cropConfig) => setCropConfig(cropConfig)}
    >
      <Image
        ref={imageRef}
        src={imageToCrop}
        alt="image-to-crop"
        width={500}
        height={500}
        className="w-full h-auto object-cover"
        onLoad={() => {
          console.log("image loaded");
        }}
      />
    </ReactCrop>
  );
}

ImageCropper.defaultProps = {
  onImageCropped: () => {},
};

export default ImageCropper;
