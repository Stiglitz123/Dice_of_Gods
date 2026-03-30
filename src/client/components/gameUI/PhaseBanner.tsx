/*
------------------------------------------------------------
PhaseBanner.tsx
Affiche simplement la phase de jeu courante au-dessus de l’interface de combat.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import { FC } from 'react'
import { Text } from 'react-native'
import { useGameStore } from '@/service/gameStore'


const PhaseBanner: FC = () => {

  const phase: string = useGameStore((s) => s.gameState?.phase ?? undefined)

  if (phase == undefined) return null

  return <Text>{phase}</Text>
}


export default PhaseBanner
