import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  JoinColumn,
  Column,
  ManyToOne,
} from "typeorm";
import { User } from "./User";
import { Blogpost } from "./Blogpost";

@Entity()
export class BlogpostLike extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: false })
  is_liked: boolean;

  @ManyToOne(() => User, (user) => user.blogpostLikes)
  @JoinColumn()
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Blogpost, (blogpost) => blogpost.blogpostLikes)
  @JoinColumn()
  blogpost: Blogpost;

  @Column()
  blogpostId: string;
}
