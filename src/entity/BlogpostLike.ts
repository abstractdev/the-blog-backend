import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  JoinColumn,
  OneToOne,
  Column,
} from "typeorm";
import { User } from "./User";
import { Blogpost } from "./Blogpost";

@Entity()
export class BlogpostLike extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: false })
  is_liked: boolean;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToOne(() => Blogpost)
  @JoinColumn()
  blogpost: Blogpost;
}
