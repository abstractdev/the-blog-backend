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
import { Author } from "./Author";
import { Comment } from "./Comment";

@Entity()
export class Blogpost extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 100 })
  title: string;

  @Column({ length: 10000 })
  content: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn({ nullable: true })
  updated_at: Date;

  @Column()
  is_published: Boolean;

  @Column("text", { array: true })
  tags: string[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @ManyToOne(() => Author, (author) => author.blogposts)
  @JoinColumn({
    name: "author_id",
  })
  author: Author;
}
