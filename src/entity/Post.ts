import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  creator: string;
  @Column()
  creatorName: string;
  @Column()
  imageUrl: string;

  @Column()
  createdAt: string;

  @Column()
  updatedAt: string;

  @ManyToOne((type) => User, (user) => user.posts)
  user: User;
}
