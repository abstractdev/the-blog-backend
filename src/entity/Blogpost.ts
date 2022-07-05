import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from "typeorm";
import { User } from "./User";
import { Comment } from "./Comment";
import { BlogpostLike } from "./BlogpostLike";
import { Category } from "./Category";

@Entity()
export class Blogpost extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 100, unique: true })
  title: string;

  @Column({ length: 100 })
  image_url: string;

  @Column("text")
  content: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn({ nullable: true })
  updated_at: Date;

  @Column({ default: false })
  is_published: Boolean;

  @OneToMany(() => Comment, (comment) => comment.blogpost, { nullable: true })
  comments: Comment[];

  @ManyToOne(() => User, (user) => user.blogposts)
  @JoinColumn({
    name: "user_id",
  })
  user: User;

  @Column()
  user_id: string;

  @OneToMany(() => BlogpostLike, (blogpostLike) => blogpostLike.blogpost)
  blogpostLikes: BlogpostLike[];

  @ManyToMany(() => Category, (category) => category.blogposts)
  @JoinTable()
  categories: Category[];
}
