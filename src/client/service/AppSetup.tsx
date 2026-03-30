/*
------------------------------------------------------------
AppSetup.tsx
Composant racine qui initialise la connexion socket, hydrate les valeurs de jeu, navigue vers la partie et gère la reconnexion.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import { ReactNode, useEffect,FC } from "react";
import { getItem } from "expo-secure-store";
import { AppStateStatus, AppState, NativeEventSubscription } from "react-native";
import WebSocketService, { serverConnexion } from "./webSocketService";
import { Animation, ArtifactData, DiceData, GameState, GameValues, ReligionData, SOCKET_EVENT, User } from "@/common/types";
import { useRouter, Router} from "expo-router";
import { useGameStore } from "./gameStore";
import { generateIconSequence } from "./utils";
import { Socket } from "socket.io-client";


interface AppSetupProps {
  children: ReactNode;
}

const AppSetup: FC<AppSetupProps> = ({ children }) => {
  const setGameValues = useGameStore((s) => s.setGameValues);
  const setGameState = useGameStore((s) => s.setGameState);
  const setUser = useGameStore((s) => s.setUser);
  const setPlayerIndex = useGameStore((s) => s.setPlayerIndex)

  
  
  const router: Router = useRouter();

  const goToGame = (gameState: GameState) => {
    setGameState(gameState);
    const userId: string = getItem("UserID")
    setPlayerIndex(gameState.players.findIndex((p) => p.user.id == userId))
    router.replace("/game");
  }

  const storeGameValues = (gameValues: GameValues) => {
    let artifacts: ArtifactData[] = gameValues.artifacts
    artifacts.forEach((a) => {
      a.effectSequence.iconSequence = generateIconSequence(a.effectSequence)
    })

    let religions: ReligionData[] = gameValues.religions
    religions.forEach((r) => {
      r.skill.iconSequence = generateIconSequence(r.skill)
      r.gods.forEach((g) => {
        g.effectSequence.iconSequence = generateIconSequence(g.effectSequence)
      })
    })

    let dice: DiceData[] = gameValues.dice
    dice.forEach((d) =>{
      d.effectSequence.iconSequence = generateIconSequence(d.effectSequence)
    })
    setGameValues({artifacts: artifacts, religions: religions, dice: dice})
  }
 

  useEffect(() => {
    const ws: WebSocketService = serverConnexion;

    ws.addCallback(SOCKET_EVENT.GAME_VALUES, storeGameValues);
    ws.addCallback(SOCKET_EVENT.USER_INFO, setUser);
    ws.addCallback(SOCKET_EVENT.GAME_STATE, (gs: GameState) =>{
      // console.log(gs)
      setGameState(gs)});
    ws.addCallback(SOCKET_EVENT.GAME_READY, goToGame);
    ws.addCallback(SOCKET_EVENT.ANIMATION, (anim: Animation ) => {console.log("Animation :", anim)})
    ws.addCallback(SOCKET_EVENT.ERROR, (message: string) => {console.log("Erreur:", message)});

    const stateListener: NativeEventSubscription = AppState.addEventListener("change", (nextState: AppStateStatus) => {
      const socket: Socket = ws.getSocket();

      if (nextState === "active") {
        if (!socket || !socket.connected) {
          ws.connect();
        }
      }
    });
    ws.connect();

    return () => {
      stateListener.remove()
      ws.removeCallback(SOCKET_EVENT.GAME_VALUES, setGameValues);
      ws.removeCallback(SOCKET_EVENT.GAME_STATE, setGameState);
      ws.removeCallback(SOCKET_EVENT.GAME_READY, goToGame);
    };
  });

  return <>{children}</>;
}

export default AppSetup
