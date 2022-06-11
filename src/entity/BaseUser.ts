import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
export class BaseUser extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 20, unique: true })
  username: string;

  @Column({ length: 200 })
  password: string;
}
