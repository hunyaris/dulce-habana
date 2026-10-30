// Iconos Lucide por categoría (sin emojis)
import {
  Cake,
  Cookie,
  IceCreamBowl,
  CupSoda,
  Package,
  type LucideIcon,
} from "lucide-react";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  PANETELAS: Cake,
  PANQUES: Cookie,
  FLAN: IceCreamBowl,
  BEBIDAS: CupSoda,
  COMBOS: Package,
};

export function CategoryIcon({
  category,
  className,
}: {
  category: string;
  className?: string;
}) {
  const Icon = CATEGORY_ICONS[category] || Cake;
  return <Icon className={className} />;
}
