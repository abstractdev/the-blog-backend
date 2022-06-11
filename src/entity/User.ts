import { Entity, OneToMany, Column } from "typeorm";
import { Comment } from "./Comment";
import { BaseUser } from "./BaseUser";

@Entity()
export class User extends BaseUser {
  @Column({ default: false })
  is_admin: boolean;

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
