import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { GameService } from './game.service';
import { StartGameDto } from './dto/start-game.dto';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('start')
  async startGame(@Body() body: StartGameDto): Promise<object> {
    return this.gameService.startGame(body.player1Name, body.player2Name);
  }

  @Post(':gameId/play')
  async playTurn(@Param('gameId') gameId: number): Promise<object> {
    return this.gameService.playTurn(gameId);
  }
}
