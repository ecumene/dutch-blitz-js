import { Entity, generate } from "@rocicorp/rails";
import { UserInfo } from "./client-state";
import { WriteTransaction } from "@rocicorp/reflect";

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
  location: Location | null;
  stack: BlitzCardStack;
};

export type BlitzCard = {
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
} = generate<BlitzCardStackState>("stack-state");

function initStackState(
  tx: WriteTransaction,
  location: Location,
  stack: BlitzCardStack
) {
  return initStackImpl(tx, {
    id: tx.clientID,
    location,
    stack,
  });
}
