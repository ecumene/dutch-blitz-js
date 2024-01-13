import type { MutatorDefs, WriteTransaction } from "@rocicorp/reflect";
import { initClientState, updateClientState } from "./client-state.js";
import { Entity } from "@rocicorp/rails";
import { Card, getStackState, updateStackState } from "./cards.js";

export const mutators = {
  setCursor,
  appendStack,
  initClientState,
  increment,
} satisfies MutatorDefs;

export type M = typeof mutators;

async function increment(
  tx: WriteTransaction,
  { key, delta }: { key: string; delta: number }
) {
  console.log(`incrementing ${key} by ${delta}`);
  const prev = await tx.get<number>(key);
  const next = (prev ?? 0) + delta;
  await tx.set(key, next);
}

async function setCursor(
  tx: WriteTransaction,
  { x, y }: { x: number; y: number }
): Promise<void> {
  await updateClientState(tx, { id: tx.clientID, cursor: { x, y } });
}

async function appendStack(
  tx: WriteTransaction,
  { id, card }: { id: Entity["id"]; card: Card }
): Promise<void> {
  const prevState = await getStackState(tx, id);
  if (!prevState) throw new Error(`[Stack ${id}] Does not exist`);
  await updateStackState(tx, {
    id,
    stack: {
      ...prevState.stack,
      cardStack: [...prevState.stack.cardStack, card],
    },
  });
}
