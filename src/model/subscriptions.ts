// This file defines our "subscriptions". Subscriptions are how Reflect
// notifies you when data has changed. Subscriptions fire whenever the watched
// data changes, whether because the local client changed it, or because some
// other collaborating client changed it. The model is that you render your app
// reactively based on these subscriptions. This guarantees the UI always
// consistently shows the latest data.
//
// Subscriptions can be arbitrary computations of the data in Reflect. The
// subscription "query" is re-run whenever any of the data it depends on
// changes. The subscription "fires" when the result of the query changes.

import type { Reflect } from "@rocicorp/reflect/client";
import { useSubscribe } from "@rocicorp/reflect/react";
import { getClientState, listClientIDs } from "./client-state.js";
import type { M } from "./mutators.js";
import { getStackState, listStackIDs } from "./cards.js";

export function useCount(reflect: Reflect<M>, key: string) {
  return useSubscribe(reflect, (tx) => tx.get<number>(key), 0);
}

export function useUser(r: Reflect<M>) {
  return useSubscribe(r, (tx) => getClientState(tx, r.clientID), null);
}

export function useCompetitors(r: Reflect<M>) {
  const clients = useClients(r);
  return clients.filter((client) => client.id !== r.clientID);
}

export function useClients(r: Reflect<M>) {
  return useSubscribe(r, listClientIDs, []);
}

export function useClientState(r: Reflect<M>, id: string) {
  return useSubscribe(r, (tx) => getClientState(tx, id), null);
}

export function useStackIDs(reflect: Reflect<M>) {
  return useSubscribe(reflect, listStackIDs, []);
}

export function useStackByID(reflect: Reflect<M>, id: string) {
  return useSubscribe(reflect, (tx) => getStackState(tx, id), null);
}
