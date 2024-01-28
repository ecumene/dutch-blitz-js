import { useState } from "react";
import { BlitzCard } from "../model/cards";
import styles from "./Card.module.css";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

type Props = {
  card: BlitzCard;
} & React.HTMLProps<HTMLDivElement>;

const colorMap = {
  red: "#C33149",
  green: "#A8C256",
  yellow: "#F4A259",
  blue: "#2E4057",
};

const Card = React.forwardRef<HTMLDivElement, Props>(
  ({ card, ...rest }: Props, ref) => {
    return (
      <div
        ref={ref}
        className="rounded-md bg-white flex items-center justify-center w-[71px] h-[100px]"
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
