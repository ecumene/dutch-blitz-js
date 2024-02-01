import type { MutatorDefs, WriteTransaction } from "@rocicorp/reflect";
import {
  ClientState,
  deal,
  deleteClientState,
  getClientState,
  initClientState,
  listClients,
  updateClientState,
} from "./client-state.js";
import { Entity } from "@rocicorp/rails";
import {
  BlitzCard,
  deleteStacks,
  getStackState,
  initStackState,
  listStacks,
  updateStackState,
} from "./cards.js";

export const mutators = {
  setCursor,
  appendStack,
  setCarrying,
  resetGame,
  deal,
  initClientState,
  initStackState,
  removeCard,
  updateStackState,
  clearRoom,
} satisfies MutatorDefs;

export type M = typeof mutators;

async function clearRoom(tx: WriteTransaction) {
  const ids = [...(await listClients(tx)), ...(await listStacks(tx))].map(
    (value) => value.id
  );
  await Promise.all(ids.map((id) => deleteClientState(tx, id)));
}

async function setCarrying(
  tx: WriteTransaction,
  carrying?: BlitzCard
): Promise<void> {
  await updateClientState(tx, { id: tx.clientID, carrying });
}

async function setCursor(
  tx: WriteTransaction,
  { x, y }: { x: number; y: number }
): Promise<void> {
  await updateClientState(tx, { id: tx.clientID, cursor: { x, y } });
}

async function appendStack(
  tx: WriteTransaction,
  { id, card }: { id: Entity["id"]; card: BlitzCard }
): Promise<void> {
  const prevState = await getStackState(tx, id);
  if (!prevState) throw new Error(`[Stack ${id}] Does not exist`);
  await updateStackState(tx, {
    id,
    stack: {
      ...prevState.stack,
      cardStack: [...prevState.stack.cardStack, card],
      currentNumber: card.number,
    },
  });
}

export const calcScore = (client: ClientState) => {
  const blitzLeft = client.deck.length - 3;
  const dutchPlayed = 40 - 13 - client.pile.length;
  return { score: dutchPlayed - blitzLeft * 2, dutchPlayed, blitzLeft };
};

async function resetGame(tx: WriteTransaction) {
  const clients = await listClients(tx);
  const stacks = await listStacks(tx);
  for (const client of clients) {
    const { score } = calcScore(client);
    await updateClientState(tx, { id: client.id, score });
    await deal(tx, client.id);
  }

  for (const stack of stacks) {
    await deleteStacks(tx, stack.id);
  }
}

async function removeCard(tx: WriteTransaction, card: BlitzCard) {
  const client = await getClientState(tx, tx.clientID);
  if (!client) throw new Error("missing client");
  const { deck, pile } = client;
  const filteredDeck = deck.filter(({ uuid }) => uuid !== card.uuid);
  await updateClientState(tx, {
    id: tx.clientID,
    deck: filteredDeck,
    pile: pile.filter(({ uuid }) => uuid !== card.uuid),
  });

  if (filteredDeck.length < 4) {
    await resetGame(tx);
  }
}
