import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Author } from "./Author";

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
  
  @ManyToOne(() => Author, (author) => author.blogposts)
  @JoinColumn({
    name: "author_id",
  })
  author: Author;
}
