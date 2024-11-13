import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { Connection } from 'typeorm';

describe('AppModule', () => {
  let app;
  let connection: Connection;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    connection = moduleFixture.get(Connection);
    await app.init();
  });

  it('should connect to the database successfully', async () => {
    expect(connection.isConnected).toBe(true); 
  });

  afterAll(async () => {
    await app.close(); 
  });
});
