import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Button from "./Button";

interface BackButtonProps {
  href: string;
  className?: string;
}

export default function BackButton({ href, className = '' }: BackButtonProps) {
  const router = useRouter();

  return (
    <Button
      variant="neutral-grey"
      size="large"
      iconOnly
      onClick={() => router.push(href)}
      className={`hidden lg:block fixed top-6 left-6 z-50 ${className}`}
    >
      <ArrowLeft className="h-5 w-5" />
    </Button>
  );
}