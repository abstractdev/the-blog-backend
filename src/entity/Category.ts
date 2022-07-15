import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  Column,
  ManyToMany,
} from "typeorm";
import { Blogpost } from "./Blogpost";

@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => Blogpost, (blogpost) => blogpost.categories, {
    onDelete: "CASCADE",
  })
  blogposts: Blogpost[];
}
