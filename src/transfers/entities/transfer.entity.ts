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

  @Column({ type: 'numeric', precision: 78, scale: 0 })
  amount: string;

  @Column()
  createdAt: Date;

  constructor(from: string, to: string, amount: string, createdAt: Date) {
    this.from = from;
    this.to = to;
    this.amount = amount;
    this.createdAt = createdAt;
  }
}
