import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { DeleteResult, Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { PostService } from 'src/post/post.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly userService: UserService,
    private readonly postService: PostService,
  ) {}
  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const comment = new Comment();
    comment.content = createCommentDto.content;
    const user = await this.userService.findOne(createCommentDto.userId);
    comment.commentedBy = user;
    const post = await this.postService.findOne(createCommentDto.postId);
    comment.posts = post;

    return await this.commentRepository.save(comment);
  }

  async findAll(): Promise<Comment[]> {
    return await this.commentRepository.find();
  }

  async findOne(id: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne({ where: { id }, relations:['po'] });
    if (!comment) {
      throw new NotFoundException();
    }
    return comment;
  }

  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException();
    }
    comment.content = updateCommentDto.content ?? comment.content;
    if (updateCommentDto.userId !== undefined) {
      const user = await this.userService.findOne(updateCommentDto.userId);
      comment.commentedBy = user;
    }
    if (updateCommentDto.postId !== undefined) {
      const post = await this.postService.findOne(updateCommentDto.postId);
      comment.posts = post;
    }
    return await this.commentRepository.save(comment);
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.commentRepository.delete(id);
  }
}
