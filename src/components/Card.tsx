import { clsx } from "clsx";
import { BlitzCard } from "../model/cards";
import React from "react";

type Props = {
  card: BlitzCard;
} & React.HTMLProps<HTMLDivElement>;

const colorMap = {
  red: "#DC213D",
  green: "#1EC154",
  yellow: "#FFD151",
  blue: "#0C6DF5",
};

const Card = React.forwardRef<HTMLDivElement, Props>(
  ({ card, className, ...rest }: Props, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          "rounded-md bg-white flex items-center justify-center w-[71px] h-[100px] font-cursive text-4xl",
          className
        )}
        {...rest}
        style={{
          backgroundColor: colorMap[card.color],
          ...rest.style,
        }}
      >
        {card.number}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;
