import { Entity, Column, OneToMany } from "typeorm";
import { BaseUser } from "./BaseUser";
import { Blogpost } from "./Blogpost";

@Entity()
export class Author extends BaseUser {
  @Column({ length: 20 })
  first_name: string;

  @Column({ length: 20 })
  last_name: string;

  @OneToMany(() => Blogpost, (blogpost) => blogpost.author)
  blogposts: Blogpost[];
}
