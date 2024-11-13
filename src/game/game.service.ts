import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from '../entities/game.entity';
import { Repository } from 'typeorm';
import { PlayTurnRes, StartGameRes } from './utils/interface';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
  ) {}

  private rollDice(): number {
    return Math.floor(Math.random() * 6) + 1;
  }

  // Iniciar o jogo e armazenar no banco
  async startGame(
    player1Name: string,
    player2Name: string,
  ): Promise<StartGameRes> {
    const game = new Game();
    game.player1Name = player1Name;
    game.player2Name = player2Name;
    game.player1Position = 0;
    game.player2Position = 0;
    game.currentPlayerIndex = 0;
    game.winnerId = 0;

    // Salva o estado do jogo no banco de dados
    const g = await this.gameRepository.save(game);

    return {
      message: 'Jogo iniciado!',
      id: g.id,
    };
  }

  async playTurn(gameId: number): Promise<PlayTurnRes> {
    const game = await this.gameRepository.findOne({ where: { id: gameId } });

    if (!game) {
      throw new Error('Jogo não encontrado');
    }

    const currentPlayer = game.currentPlayerIndex === 0 ? 'player1' : 'player2';
    const diceRoll = this.rollDice();

    game[`${currentPlayer}Position`] += diceRoll;

    if (game[`${currentPlayer}Position`] > 15) {
      game[`${currentPlayer}Position`] = 15;
    }

    if (game[`${currentPlayer}Position`] >= 15) {
      game.winnerId = game.currentPlayerIndex === 0 ? 1 : 2;
      await this.gameRepository.save(game);
      return {
        player: game[currentPlayer + 'Name'],
        dice: diceRoll,
        message: 'Está partida acabou!',
      };
    }

    game.currentPlayerIndex = (game.currentPlayerIndex + 1) % 2;

    const gameTab = await this.gameRepository.save(game);

    return {
      player: game[currentPlayer + 'Name'],
      dice: diceRoll,
      tabuleiro: gameTab,
    };
  }
}
