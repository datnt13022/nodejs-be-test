import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export default class Race {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  grandPrix: string;
  @Column()
  date: string;
  @Column()
  winner: string;
  @Column()
  car: string;
  @Column()
  laps: string;
  @Column()
  time: string;
  @Column()
  year: string;
}