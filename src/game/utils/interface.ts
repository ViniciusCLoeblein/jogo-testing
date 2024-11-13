import { Game } from 'src/entities/game.entity';

export interface StartGameRes {
  message: string;
  id: number;
}

export interface PlayTurnRes {
  player: string;
  dice: number;
  message?: string;
  tabuleiro?: Game;
}
