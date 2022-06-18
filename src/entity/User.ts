import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { Comment } from "./Comment";
export type UserRole = "user" | "author" | "admin";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 20, unique: true })
  username: string;

  @Column({ length: 200 })
  password: string;

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @Column({ type: "enum", enum: ["user", "author", "admin"], default: "user" })
  role: UserRole;
}
