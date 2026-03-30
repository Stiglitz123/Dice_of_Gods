//----------------------------------------
// GameDao.ts
// Accès base pour persister et lire les parties (gagnant/perdant, stats JSON) via Postgres.
// [Auteur : Hugo Beaulieu]
//----------------------------------------
import Game from "server/Game";
import { dbQuery, dbQueryOne } from "./dbConnection"
import Player from "server/Player";
import { GameStats } from "@common/types"


export class GameDao {

    static async addGame(game: Game): Promise<void> {

        try {
            const winner: Player = game.getWinnerPlayer() as Player
            const loser: Player = winner.getOpponent()
            const winnerStats: string = JSON.stringify(winner.getUser().getState())
            const loserStats: string = JSON.stringify(loser.getUser().getState())

            await dbQueryOne(
                `
                INSERT INTO game (winner_id, loser_id, winner_user, loser_user, nb_rounds)
                SELECT w.id, l.id, $3::json, $4::json, $5
                FROM player w
                JOIN player l ON l.user_id = $2
                WHERE w.user_id = $1
                `,
                [winner.getId(), loser.getId(), winnerStats, loserStats, game.getRound()]
            )
        } catch (error) {
            console.error("Error inserting new game:", error)
        }
    }


    static async getGameHistory(userId: string, limit: number): Promise<GameStats[] | undefined> {


        try {

            const result: GameStats[] | undefined = await dbQuery<GameStats>(
                `
                SELECT g.*
                FROM game g
                JOIN player p_win ON g.winner_id = p_win.id
                JOIN player p_lose ON g.loser_id = p_lose.id
                WHERE p_win.user_id = $1 
                OR p_lose.user_id = $1
                ORDER BY g.date DESC
                LIMIT $2;
                `,
                [userId, limit]
            )

            return result ?? undefined

        } catch (error) {
            console.error("Error inserting new game:", error)
        }
    }


}
