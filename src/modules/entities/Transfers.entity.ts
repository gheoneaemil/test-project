import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Transfer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  blockNumber: number;

  @Column()
  from: string;

  @Column()
  to: string;

  @Column()
  amount: string;

  @Column()
  createdAt: number;

    constructor(blockNumber: number, from: string, to: string, amount: string, createdAt: number) {
        this.blockNumber = blockNumber;
        this.from = from;
        this.to = to;
        this.amount = amount;
        this.createdAt = createdAt;
    }
}