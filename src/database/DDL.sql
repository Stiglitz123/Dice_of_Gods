--Supprimer les procédure-----------------------------------------
--DROP PROCEDURE IF EXISTS ajout_joueur;

--Supprimer les clés étrangères-----------------------------------------
	
ALTER TABLE IF EXISTS player_artifact
	DROP CONSTRAINT IF EXISTS fk_player_artifact_player;

ALTER TABLE IF EXISTS game 	         
	DROP CONSTRAINT IF EXISTS fk_game_winner_player,
	DROP CONSTRAINT IF EXISTS fk_game_loser_player;


--Supprimer les tables-----------------------------------------
DROP TABLE IF EXISTS player;
DROP TABLE IF EXISTS game;
DROP TABLE IF EXISTS player_artifact;


--Supprimer les types----------------------------------------- 
-- DROP TYPE IF EXISTS GAME_EFFECT;




--Creation des tables-----------------------------------------
CREATE TABLE player (
	id 				SERIAL,
	user_id			UUID		NOT NULL,
    username 		VARCHAR(16)	NOT NULL,
	avatar			INTEGER 	NOT NULL DEFAULT 0,
	trophy			INTEGER 	NOT NULL DEFAULT 0,
	religion_id		INTEGER		NOT NULL DEFAULT 0,
	creation_date	TIMESTAMP 	NOT NULL DEFAULT NOW(),
	last_login		TIMESTAMP 	NOT NULL DEFAULT NOW(),
		
    CONSTRAINT pk_player 				PRIMARY KEY (id),
	CONSTRAINT uc_player_user_id 		UNIQUE (user_id),
    CONSTRAINT uc_player_username 		UNIQUE (username),
    CONSTRAINT cc_player_username		CHECK (username ~ '^[A-Za-z0-9]{3,16}')
);

CREATE TABLE game (
	id					SERIAL,
	winner_id			INTEGER 	NOT NULL,
	loser_id			INTEGER 	NOT NULL,
	date				TIMESTAMP 	NOT NULL DEFAULT NOW(),
	winner_user 		JSON 		NOT NULL,
	loser_user 			JSON 		NOT NULL,
	nb_rounds			INTEGER		NOT NULL,
	
	--Possibilité d'ajouté plus de statistiques
	-- 	winner_hp			INTEGER NOT NULL,
	-- winner_religion_id	INTEGER NOT NULL,
	
	CONSTRAINT pk_game					PRIMARY KEY (id)
);

CREATE TABLE player_artifact (
	player_id		INTEGER		NOT NULL,
	artifact_id		INTEGER		NOT NULL,
	slot			INTEGER		NOT NULL,

	CONSTRAINT pk_player_artifact 		PRIMARY KEY (player_id, artifact_id),
	CONSTRAINT uc_player_slot			UNIQUE (player_id, slot),
	CONSTRAINT cc_player_artifact_slot	CHECK (slot BETWEEN 0 AND 3)
);


-- Ajouter des contraintes FK-----------------------------------------

ALTER TABLE game 
  	ADD CONSTRAINT fk_game_winner_player
      	FOREIGN KEY (winner_id) REFERENCES player(id),
	ADD CONSTRAINT fk_game_loser_player
      	FOREIGN KEY (loser_id) REFERENCES player(id);

ALTER TABLE IF EXISTS player_artifact
	ADD CONSTRAINT fk_player_artifact_player
		FOREIGN KEY (player_id) REFERENCES player(id);

-- Ajout des index ---------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_game_winner_date ON game(winner_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_game_loser_date  ON game(loser_id, date DESC);

-- Ajouter des Procedure -------------------------------
-- CREATE OR REPLACE PROCEDURE ajout_activite(
-- 		debut activite.debut%TYPE,
-- 		duree activite.duree%TYPE,
-- 		alias_joueur joueur.alias%TYPE)
-- 	LANGUAGE SQL
-- 	AS $$
-- 	  INSERT INTO activite(debut, duree, joueur)
-- 	  	VALUES(debut, duree,
-- 			  	(SELECT id FROM joueur WHERE alias = alias_joueur));
-- 	$$;