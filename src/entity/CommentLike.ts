import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  JoinColumn,
  OneToOne,
  Column,
} from "typeorm";
import { User } from "./User";
import { Comment } from "./Comment";

@Entity()
export class CommentLike extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: false })
  is_liked: boolean;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToOne(() => Comment)
  @JoinColumn()
  comment: Comment;
}
