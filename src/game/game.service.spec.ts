//teste de unidade

import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Game } from '../entities/game.entity';
import { Repository } from 'typeorm';

describe('GameService', () => {
  let gameService: GameService;
  let gameRepository: Repository<Game>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameService,
        {
          provide: getRepositoryToken(Game),
          useClass: Repository,
        },
      ],
    }).compile();

    gameService = module.get<GameService>(GameService);
    gameRepository = module.get<Repository<Game>>(getRepositoryToken(Game));
  });

  it('should be defined', () => {
    expect(gameService).toBeDefined();
  });

  describe('rollDice', () => {
    it('should return a number between 1 and 6', () => {
      const roll = gameService['rollDice'](); // Chama o método privado
      expect(roll).toBeGreaterThanOrEqual(1);
      expect(roll).toBeLessThanOrEqual(6);
    });
  });

  describe('startGame', () => {
    it('should start a new game and return a game object', async () => {
      const gameMock = { id: 1, player1Name: 'Alice', player2Name: 'Bob' };
      jest.spyOn(gameRepository, 'save').mockResolvedValue(gameMock as any);

      const result = await gameService.startGame('Alice', 'Bob');
      expect(result).toEqual({
        message: 'Jogo iniciado!',
        id: 1,
      });
    });
  });

  describe('playTurn', () => {
    it('should throw an error if the game is not found', async () => {
      jest.spyOn(gameRepository, 'findOne').mockResolvedValue(null);

      try {
        await gameService.playTurn(1);
      } catch (e) {
        expect(e.message).toBe('Jogo não encontrado');
      }
    });

    it('should return the updated game state after a turn', async () => {
      const gameMock = {
        id: 1,
        player1Name: 'Alice',
        player2Name: 'Bob',
        currentPlayerIndex: 0,
        player1Position: 0,
        player2Position: 0,
        winnerId: 0,
      };
      jest.spyOn(gameRepository, 'findOne').mockResolvedValue(gameMock as any);
      jest.spyOn(gameRepository, 'save').mockResolvedValue(gameMock as any);

      const result = await gameService.playTurn(1);
      expect(result).toHaveProperty('player');
      expect(result).toHaveProperty('tabuleiro');
    });
  });
});
