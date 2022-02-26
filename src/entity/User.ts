import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Post } from "./Post";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  status: string;

  @OneToMany((type) => Post, (post) => post.user, { eager: true })
  posts: Post[];
}
// Eager true can be loaded at one side side of the relation
