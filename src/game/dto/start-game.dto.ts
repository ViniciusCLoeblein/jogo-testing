import { ApiProperty } from "@nestjs/swagger";

export class StartGameDto {
    @ApiProperty()
    player1Name: string

    @ApiProperty()
    player2Name: string
}