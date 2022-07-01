import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  JoinColumn,
  OneToOne,
  Column,
  ManyToOne,
} from "typeorm";
import { User } from "./User";
import { Comment } from "./Comment";

@Entity()
export class CommentLike extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: false })
  is_liked: boolean;

  @ManyToOne(() => User, (user) => user.commentLikes)
  @JoinColumn()
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Comment, (comment) => comment.commentLikes)
  @JoinColumn()
  comment: Comment;

  @Column()
  commentId: string;
}
