//Teste de Integração

import { Test, TestingModule } from '@nestjs/testing';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Game } from '../entities/game.entity';
import { Repository } from 'typeorm';
import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';

describe('GameController', () => {
  let app;
  let gameService: GameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameController],
      providers: [
        GameService,
        {
          provide: getRepositoryToken(Game),
          useClass: Repository,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    gameService = module.get<GameService>(GameService);
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  describe('POST /game/start', () => {
    it('should start a new game and return the game id', () => {
      const gameMock = { id: 1, player1Name: 'Alice', player2Name: 'Bob' };
      jest.spyOn(gameService, 'startGame').mockResolvedValue({
        message: 'Jogo iniciado!',
        id: 1,
      });

      return request(app.getHttpServer())
        .post('/game/start')
        .send({ player1Name: 'Alice', player2Name: 'Bob' })
        .expect(HttpStatus.CREATED)
        .expect({
          message: 'Jogo iniciado!',
          id: 1,
        });
    });
  });

  describe('POST /game/:gameId/play', () => {
    it('should play a turn and return the updated game state', async () => {
      const gameMock = {
        id: 1,
        player1Name: 'Alice',
        player2Name: 'Bob',
        currentPlayerIndex: 0,
        player1Position: 0,
        player2Position: 0,
        winnerId: 0,
      };
      jest.spyOn(gameService, 'playTurn').mockResolvedValue({
        player: 'Alice',
        tabuleiro: gameMock,
        dice: 1,
      });

      return request(app.getHttpServer())
        .post('/game/1/play')
        .expect(HttpStatus.CREATED)
        .expect({
          player: 'Alice',
          tabuleiro: gameMock,
          dice: 1,
        });
    });
  });
});
