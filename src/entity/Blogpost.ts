import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { User } from "./User";
import { Comment } from "./Comment";

@Entity()
export class Blogpost extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 100, unique: true })
  title: string;

  @Column({ length: 10000 })
  content: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn({ nullable: true })
  updated_at: Date;

  @Column({ default: false })
  is_published: Boolean;

  @Column("text", { array: true, nullable: true })
  tags: string[];

  @OneToMany(() => Comment, (comment) => comment.blogpost, { nullable: true })
  comments: Comment[];

  @ManyToOne(() => User, (user) => user.blogposts)
  @JoinColumn({
    name: "user_id",
  })
  user: User;

  @Column()
  user_id: string;
}
