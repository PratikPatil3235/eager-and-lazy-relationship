import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    private readonly userService: UserService,
  ) {}
  async create(createPostDto: CreatePostDto) {
    const post = new Post();
    post.title = createPostDto.title;
    const user = await this.userService.findOne(createPostDto.userId);
    post.user = user;

    return await this.postRepository.save(post);
  }

  async findAll() {
    return await this.postRepository.find();
  }

  async findOne(id: number) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user','comment'],
    });
    if (!post) {
      throw new NotFoundException();
    }
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!post) {
      throw new NotFoundException();
    }
    post.title = updatePostDto.title ?? post.title;
    if (updatePostDto.userId != undefined) {
      const user = await this.userService.findOne(updatePostDto.userId);
      post.user = user;
    }
    return await this.postRepository.save(post);
  }

  remove(id: number) {
    return this.postRepository.delete(id);
  }
}
