/*
------------------------------------------------------------
gameCommand.ts
Helpers pour envoyer des commandes ou callbacks socket (inscription, actions de jeu) et accéder aux données d’artefacts.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import { serverConnexion, CallbackFunc } from "./webSocketService"
import { Command, CommandArgs, COMMAND_NAME, ArtifactData, RegisterData } from "@/common/types"
import { useGameStore } from "./gameStore"

export const sendCommand = (name: COMMAND_NAME, id?: number, newValue?: number): void => {
  const args: CommandArgs = { id, newValue }
  const command: Command = { name, args }
  serverConnexion.sendCommand(command)
}

export const register = (username: string, avatar: number, religion: number): void => {
    const data: RegisterData = {username: username, avatar: avatar, religion: religion}
    serverConnexion.register(data)
}

export const addCallback = (event: string,cb: CallbackFunc): void => {
  serverConnexion.addCallback(event, cb)
}

export const removeCallback = (event: string, cb: CallbackFunc
): void => {
  serverConnexion.removeCallback(event, cb)
}

export const getArtifactById = (id: number): ArtifactData => {
  const artifacts = useGameStore.getState().gameValues.artifacts
  return artifacts.find((a) => a.id === id)
}
