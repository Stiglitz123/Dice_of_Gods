//----------------------------------------
// UserDao.ts
// Accès base pour récupérer/créer/màj les utilisateurs (profil, artefacts, religion, trophées) et leurs enregistrements associés.
// [Auteur : Frédéric Desrosiers]
//----------------------------------------
import { dbQueryOne, dbQuery, getClient } from "./dbConnection"
import { User } from "@common/types"

export class UserDao {
  static async getUserId(userId: string): Promise<number | undefined> {
    const result = await dbQueryOne<UserRow>(
      `
        SELECT *,
        FROM player p
        WHERE p.user_id = $1
      ` ,
      [userId]
    )

    return result?.id ?? undefined
  }


  static async getUser(userId: string): Promise<User | undefined> {
    const result = await dbQueryOne<User>(
      `
        SELECT
          p.user_id        AS id,
          p.username       AS name,
          p.avatar         AS avatar,
          p.trophy         AS trophy,
          p.religion_id    AS religion,
          COALESCE(
            ARRAY(
              SELECT artifact_id
              FROM player_artifact
              WHERE player_id = p.id
              ORDER BY slot
            ),
            '{}'::INTEGER[]
          ) AS artifacts
        FROM player p
        WHERE p.user_id = $1
      ` ,
      [userId]
    )

    return result ?? undefined
  }



 static async newUser(user: User): Promise<User | undefined> {
  const client = await getClient()

  try {
    await client.query("BEGIN")

    const result = await client.query<UserRow>(
      `
      INSERT INTO player (user_id, username, religion_id, avatar, trophy)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [user.id, user.name, user.religion, user.avatar, user.trophy]
    )
    const playerId: number | undefined = result.rows[0]?.id

    if (!playerId) {
      await client.query("ROLLBACK")
      return undefined
    }

    for (let i = 0; i < user.artifacts.length; i++) {
      await client.query(
        `
        INSERT INTO player_artifact (player_id, artifact_id, slot)
        VALUES ($1, $2, $3)
        `,
        [playerId, user.artifacts[i], i]
      )
    }

    await client.query("COMMIT")

      const fullUser: User | undefined = await this.getUser(user.id)
      return fullUser ?? undefined

    } 
    catch (err) {
      console.log(err)
      await client.query("ROLLBACK")
      throw err
    } 
    finally {
      client.release()
    }
  }

  static async updateUserAvatar(userId: string, artifactId: number): Promise<void> {
    await dbQuery(
      `
      UPDATE player
      SET avatar = $1
      WHERE user_id = $2
      `,
      [artifactId, userId]
    )
  }

  static async updateUserReligion(userId: string, religionId: number): Promise<void> {
    await dbQuery(
      `
      UPDATE player
      SET religion_id = $1
      WHERE user_id = $2
      `,
      [religionId, userId]
    )
  }

  static async updateUserArtifact(userId: string, slot: number, artifactId: number): Promise<void> {
    await dbQuery(
      `
      INSERT INTO player_artifact (player_id, slot, artifact_id)
      VALUES (
        (SELECT id FROM player WHERE user_id = $1), $2, $3)
      ON CONFLICT (player_id, slot)
      DO UPDATE SET artifact_id = EXCLUDED.artifact_id
      `,
      [userId, slot, artifactId]
    )
  }

  static async updateUserTrophy(userId: string, trophy: number): Promise<void> {
      await dbQuery(
        `
        UPDATE player 
        SET trophy = $1 
        WHERE user_id = $2
        `,
        [trophy, userId])
  }


  static async updateLastLogin(userId: string): Promise<void> {
      dbQuery('UPDATE player SET last_login = NOW() WHERE user_id = $1', [userId])
  }
}

export interface UserRow {
  id: number
  user_id: string
  username: string
  avatar: number
  trophy: number
  religion_id: number
  creation_date: Date
  last_login: Date
  artifacts: number[]
}
