import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  player1Name: string;

  @Column()
  player2Name: string;

  @Column('int', { default: 0 })
  player1Position: number;

  @Column('int', { default: 0 })
  player2Position: number;

  @Column('int', { default: 0 })
  currentPlayerIndex: number; 

  @Column('int', { default: 0 })
  winnerId: number; 
}
