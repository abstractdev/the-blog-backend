import { Entity, OneToMany } from "typeorm";
import { Comment } from "./Comment";
import { BaseUser } from "./BaseUser";

@Entity()
export class User extends BaseUser {
  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
