/*
------------------------------------------------------------
gameStore.ts
Store Zustand centralisant l’état de jeu, l’utilisateur et l’index joueur pour l’UI cliente.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import { create } from "zustand"
import type { GameState, GameValues, User } from "@/common/types"

interface GameStore {
  gameValues: GameValues
  gameState: GameState | null
  user: User | null
  playerIndex: number | null,
  setGameValues: (v: GameValues) => void
  setGameState: (v: GameState) => void
  setUser: (v: User) => void
  setPlayerIndex: (i: number) => void,
}

export const useGameStore = create<GameStore>((set) => ({
  gameValues: null,
  gameState: null,
  user: null,
  playerIndex: null,

  setGameValues: (v) => set({ gameValues: v }),
  setGameState: (v) => set({ gameState: v }),
  setUser: (v) => set({user: v}),
  setPlayerIndex: (v) => set({playerIndex: v})
}))
