import { Entity, Column, OneToMany } from "typeorm";
import { User } from "./User";
import { Blogpost } from "./Blogpost";

@Entity()
export class Author extends User {
  @Column({ length: 20 })
  first_name: string;

  @Column({ length: 20 })
  last_name: string;

  @OneToMany(() => Blogpost, (blogpost) => blogpost.author)
  blogposts: Blogpost[];
}
