import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 20 })
  content: string;

  @Column({ length: 200 })
  created_by: string;

  @CreateDateColumn()
  created_at: Date;

  @Column("text", { array: true })
  likes: string[];

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({
    name: "user_id",
  })
  user: User;
}
