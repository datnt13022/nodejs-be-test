import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Team {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  position: string;
  @Column()
  name: string;
  @Column()
  points: string;
  @Column()
  year: string;
}
