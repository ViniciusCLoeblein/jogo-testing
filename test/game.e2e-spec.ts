import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('GameController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should start the game', async () => {
    const response = await request(app.getHttpServer())
      .post('/game/start')
      .send({ player1Name: 'Player 1', player2Name: 'Player 2' })
      .expect(201);

    expect(response.text).toBe('Jogo iniciado!');
  });

  it('should make a turn and move the player', async () => {
    await request(app.getHttpServer())
      .post('/game/start')
      .send({ player1Name: 'Player 1', player2Name: 'Player 2' })
      .expect(201);

    const response = await request(app.getHttpServer())
      .post('/game/turn')
      .expect(201);

    expect(response.text).toContain('está na casa');
  });

  it('should get the current game state', async () => {
    await request(app.getHttpServer())
      .post('/game/start')
      .send({ player1Name: 'Player 1', player2Name: 'Player 2' })
      .expect(201);

    await request(app.getHttpServer())
      .post('/game/turn')
      .expect(201);

    const response = await request(app.getHttpServer())
      .get('/game/state')
      .expect(200);

    expect(response.text).toContain('Player 1');
    expect(response.text).toContain('Player 2');
  });

  it('should declare a winner when a player reaches house 15', async () => {
    await request(app.getHttpServer())
      .post('/game/start')
      .send({ player1Name: 'Player 1', player2Name: 'Player 2' })
      .expect(201);

    // Simulando jogadas até que um jogador chegue na casa 15
    for (let i = 0; i < 5; i++) {
      await request(app.getHttpServer())
        .post('/game/turn')
        .expect(201);
    }

    // Jogador 1 ainda não venceu. Avançamos mais 3 jogadas para garantir que ele vença.
    const response = await request(app.getHttpServer())
      .post('/game/turn')
      .expect(201); // Jogador 1 deve vencer após esta jogada

    // Verificando se o jogador 1 venceu
    expect(response.text).toContain('O jogador Player 1 venceu!');
  });
});
