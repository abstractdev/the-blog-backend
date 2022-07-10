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

  @ManyToOne(() => User, (user) => user.comment_likes)
  @JoinColumn()
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Comment, (comment) => comment.comment_likes)
  @JoinColumn()
  comment: Comment;

  @Column()
  commentId: string;

  @Column()
  comment_content: string;
}
