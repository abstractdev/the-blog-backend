import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { Blogpost } from "./Blogpost";
import { BlogpostLike } from "./BlogpostLike";
import { Comment } from "./Comment";
import { CommentLike } from "./CommentLike";
export enum UserRole {
  USER = "user",
  AUTHOR = "author",
}

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 20, nullable: true })
  first_name: string;

  @Column({ length: 20, nullable: true })
  last_name: string;

  @Column({ length: 20, unique: true })
  username: string;

  @Column({ length: 200, select: false })
  password: string;

  @Column({ type: "enum", enum: UserRole })
  role: UserRole;

  @Column({ default: false })
  is_admin: boolean;

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Blogpost, (blogpost) => blogpost.user)
  blogposts: Blogpost[];

  @OneToMany(() => CommentLike, (commentLike) => commentLike.user)
  commentLikes: CommentLike[];

  @OneToMany(() => BlogpostLike, (blogpostLike) => blogpostLike.user)
  blogpostLikes: BlogpostLike[];
}
