import { Card as HeroCard } from "@heroui/react";
import clsx from "clsx";

type CardProps = {
  children: React.ReactNode;
  title?: string;
  cardProps?: React.ComponentProps<typeof HeroCard>;
  className?: string;
};

export function Card({ children, title, cardProps, className }: CardProps) {
  return (
    <HeroCard className={clsx("rounded-sm", className)} {...cardProps}>
      {title && (
        <HeroCard.Header>
          <HeroCard.Title>{title}</HeroCard.Title>
        </HeroCard.Header>
      )}
      <HeroCard.Content>{children}</HeroCard.Content>
    </HeroCard>
  );
}
