// This file defines the ClientState entity that we use to track
// cursors. It also defines some basic CRUD functions using the
// @rocicorp/rails helper library.

import type { WriteTransaction } from "@rocicorp/reflect";
import { Entity, generate } from "@rocicorp/rails";
import { BlitzCard, CardColor, cardColors, cardNumbers } from "./cards";
import { nanoid } from "nanoid";

export type Location = { x: number; y: number };

export type ClientState = Entity & {
  score: number;
  cursor: Location | null;
  deck: BlitzCard[];
  pile: BlitzCard[];
  carrying?: BlitzCard;
  userInfo: UserInfo;
};

export type UserInfo = {
  name: string;
  avatar: string;
  color: CardColor;
};

export {
  listClients,
  initClientState,
  deal,
  getClientState,
  putClientState,
  updateClientState,
  deleteClientState,
  randUserInfo,
};

const {
  list: listClients,
  init: initImpl,
  get: getClientState,
  put: putClientState,
  update: updateClientState,
  delete: deleteClientState,
} = generate<ClientState>("client-state");

const generateDeck = (owner: UserInfo): BlitzCard[] =>
  cardColors
    .map((color) =>
      cardNumbers.map((number) => ({
        uuid: nanoid(),
        owner,
        color,
        number,
      }))
    )
    .flat();

async function initClientState(tx: WriteTransaction, userInfo: UserInfo) {
  return initImpl(tx, {
    id: tx.clientID,
    score: 0,
    cursor: null,
    deck: [],
    pile: [],
    userInfo,
  });
}

async function deal(tx: WriteTransaction, clientID: string) {
  const client = await getClientState(tx, clientID);
  if (!client) throw new Error("Couldnt find client with ID");
  const deck = generateDeck(client.userInfo).sort(() => Math.random() - 0.5);
  const pile = deck.splice(0, deck.length - 13);
  return updateClientState(tx, { id: clientID, deck, pile });
}

function randUserInfo(): UserInfo {
  const [avatar, name] = avatars[randInt(0, avatars.length - 1)];
  return {
    avatar,
    name,
    color: cardColors[randInt(0, cardColors.length - 1)],
  };
}

const avatars = [
  ["🐶", "Puppy"],
  ["🐱", "Kitty"],
  ["🐭", "Mouse"],
  ["🐹", "Hamster"],
  ["🐰", "Bunny"],
];

function randInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}
