import { Comment } from './../../comment/entities/comment.entity';
import { Post } from 'src/post/entities/post.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Post, (post) => post.user, { eager: true, nullable: true })
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.commentedBy, {
    nullable: true,
  })
  comment: Promise<Comment[]>;
}
