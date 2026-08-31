import { formatPrice } from "@/lib/utils/currency";
import { cn } from "@/lib/utils/cn";

interface PriceProps {
  current: number;
  original?: number;
  className?: string;
  currentClassName?: string;
  originalClassName?: string;
}

export const Price = ({
  current,
  original,
  className,
  currentClassName,
  originalClassName,
}: PriceProps) => {
  const hasDiscount = original && original > current;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span
        className={cn(
          "font-normal text-text-primary tabular-nums",
          currentClassName
        )}
      >
        {formatPrice(current)}
      </span>
      {hasDiscount && (
        <span
          className={cn(
            "text-sm text-text-muted line-through tabular-nums",
            originalClassName
          )}
        >
          {formatPrice(original)}
        </span>
      )}
    </div>
  );
};
