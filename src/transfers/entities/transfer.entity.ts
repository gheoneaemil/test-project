import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity()
export class Transfer {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  from: string;

  @Index()
  @Column()
  to: string;

  @Column()
  amount: string;

  @Column()
  createdAt: number;

    constructor(from: string, to: string, amount: string, createdAt: number) {
        this.from = from;
        this.to = to;
        this.amount = amount;
        this.createdAt = createdAt;
    }
}