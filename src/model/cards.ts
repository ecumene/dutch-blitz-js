import { Entity, generate } from "@rocicorp/rails";
import { UserInfo } from "./client-state";
import { WriteTransaction } from "@rocicorp/reflect";
import { nanoid } from "nanoid";

export type CardColor = "red" | "green" | "blue" | "yellow";
export type CardNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export const cardColors: CardColor[] = ["red", "green", "blue", "yellow"];
export const cardNumbers: CardNumber[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export type BlitzCardStack = {
  color: CardColor;
  cardStack: BlitzCard[];
  currentNumber: CardNumber;
};

export type BlitzCardStackState = Entity & {
  stack: BlitzCardStack;
};

export type BlitzCard = {
  uuid: string;
  owner: UserInfo;
  color: CardColor;
  number: CardNumber;
};

export {
  initStackState,
  getStackState,
  putStackState,
  updateStackState,
  listStacks,
};

const {
  list: listStacks,
  init: initStackImpl,
  get: getStackState,
  put: putStackState,
  update: updateStackState,
} = generate<BlitzCardStackState>("stack-state");

function initStackState(tx: WriteTransaction, stack: BlitzCardStack) {
  return initStackImpl(tx, {
    id: nanoid(),
    stack,
  });
}
