import { Entity, generate } from "@rocicorp/rails";
import { UserInfo } from "./client-state";
import { WriteTransaction } from "@rocicorp/reflect";

export type CardColor = "red" | "green" | "blue" | "yellow";
export type CardNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export const cardColors: CardColor[] = ["red", "green", "blue", "yellow"];
export const cardNumbers: CardNumber[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export type CardStack = {
  color: CardColor;
  cardStack: Card[];
  currentNumber: CardNumber;
};

export type StackState = Entity & {
  location: Location | null;
  stack: CardStack;
};

export type Card = {
  owner: UserInfo;
  color: CardColor;
  number: CardNumber;
};

export {
  initStackState,
  getStackState,
  putStackState,
  updateStackState,
  listStackIDs,
};

const {
  list: listStackIDs,
  init: initStackImpl,
  get: getStackState,
  put: putStackState,
  update: updateStackState,
} = generate<StackState>("stack-state");

function initStackState(
  tx: WriteTransaction,
  location: Location,
  stack: CardStack
) {
  return initStackImpl(tx, {
    id: tx.clientID,
    location,
    stack,
  });
}
