import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class fastestLap{
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  grandPrix: string;
  @Column()
  driver: string;
  @Column()
  car: string;
  @Column()
  time: string;
  @Column()
  year: string;
}