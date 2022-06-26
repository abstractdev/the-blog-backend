import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { Blogpost } from "./Blogpost";
import { User } from "./User";

@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 1000 })
  content: string;

  @Column({ length: 20, nullable: true })
  created_by: string;

  @CreateDateColumn()
  created_at: Date;

  @Column("text", { array: true, nullable: true })
  likes: string[];

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({
    name: "user_id",
  })
  user: User;

  @Column()
  user_id: string;

  @ManyToOne(() => Blogpost, (blogpost) => blogpost.comments)
  @JoinColumn({
    name: "blogpost_id",
  })
  blogpost: Blogpost;

  @Column()
  blogpost_id: string;
}
