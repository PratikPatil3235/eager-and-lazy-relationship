import { Post } from 'src/post/entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => Post, (post) => post.comments, { eager: false }) // or eager: true
  posts: Post;

  @ManyToOne(() => User, (user) => user.comment, { eager: false })
  commentedBy: User;
}
