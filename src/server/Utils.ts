//----------------------------------------
// Utils.ts
// Fonctions utilitaires du serveur (aléatoire, clamp, conversion d’inscription) utilisées par les modules de données et d’enregistrement.
// [Auteur : Hugo Beaulieu & Frédéric Desrosiers]
//----------------------------------------
import RELIGION_DATA from "./gameData/religion";

import { RegisterData, ReligionData, User } from "./types";

export function clamp(value: number, min: number, max: number): number{
  return Math.min(Math.max(value, min), max)
}

export function getRandomInt(min: number, max:number): number {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function FYshuffle<T>(array: T[]): T[] { //Fisher–Yates shuffle
  const result: T[] = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j: number = getRandomInt(0, i);
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
}

export function registerDataToUser(userId: string, data: RegisterData): User {
  const userReligion: ReligionData | undefined = RELIGION_DATA.find((r) => r.id == data.religion)
  return {
      id: userId,
      name: data.username,
      avatar: data.avatar,
      religion: data.religion,
      trophy: 1000,
      artifacts: userReligion?.startingArtifact ?? [1,2,3,4]
  }
}

export function calculateNewRating(userRating: number, opponentRating: number, userIsWinner: boolean): number {
  const player_rating: number = userRating
  const expected: number = 1 / (1 + Math.pow(10, (opponentRating - player_rating) / 400))// 400 est le facteur de scaling. un ecart de 200 points signifie que le joueur le mieux classé a 75% de chances de gagner contre le moins bien classé
  const score: number = userIsWinner ? 1 : 0
  return Math.round(Math.max(player_rating + 32 * (score - expected), 0)) // 32 est le K-factor (si 2 joueurs ont un écart de 0 points, le gagnant gagne 32 points et le perdant en perd 32)
}
