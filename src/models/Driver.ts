import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export default class Driver{
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  position: string;
  @Column()
  driver: string;
  @Column()
  nationality: string;
  @Column()
  car: string;
  @Column()
  points: string;
  @Column()
  year: string;
}
