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

  @ManyToOne(() => User, (user) => user.blogpost_likes)
  @JoinColumn()
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Blogpost, (blogpost) => blogpost.blogpost_likes)
  @JoinColumn()
  blogpost: Blogpost;

  @Column()
  blogpostId: string;

  @Column()
  blogpost_title: string;
}
