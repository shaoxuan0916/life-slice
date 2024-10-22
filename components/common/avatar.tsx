import {
  Avatar as AvatarContainer,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

type AvatarProps = {
  imgUrl?: string;
  fallbackText?: string;
};

export function Avatar({ imgUrl, fallbackText = "LS" }: AvatarProps) {
  return (
    <AvatarContainer>
      <AvatarImage src={imgUrl} alt="Avatar Image" />
      <AvatarFallback>{fallbackText}</AvatarFallback>
    </AvatarContainer>
  );
}
