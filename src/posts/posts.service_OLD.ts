import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateOrUpdateComment } from './dto/comment.dto';
import { CreateOrRemoveLike } from './dto/like.dto';
import { CreatePostDto } from './dto/post.dto';
import { Post } from './schema/post.schema';

interface IFindOptions {
  filter?: Record<string, any>;
  sort?: string | Record<string, any>;
  limit?: number;
  select?: string;
  skip?: number;
}

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}
  async createPost(post: CreatePostDto) {
    const createdPost = new this.postModel(post);
    return await createdPost.save();
  }

  async getPosts(userId: number, options: IFindOptions = {}): Promise<Post[]> {
    const { filter, sort, limit, select, skip } = options;
    return await this.postModel
      .find({ senderId: userId })
      .select(select ?? '')
      .sort(sort ?? {})
      .skip(skip ?? 0)
      .limit(limit ?? 0)
      .lean(true)
      .exec();
  }

  async getPost(
    postId: string,
    options: IFindOptions = {},
  ): Promise<Post | null> {
    const { filter, select } = options;
    return await this.postModel
      .findOne({ _id: postId })
      .select(select ?? '')
      .lean(true)
      .exec();
  }

  async updatePost(upToDatePost: CreatePostDto): Promise<Post | null> {
    if (!Types.ObjectId.isValid(upToDatePost._id || '')) {
      throw new BadRequestException(
        'Id fornecido não é um ObjectId do MongoDB',
      );
    } else {
      return await this.postModel.findByIdAndUpdate(
        upToDatePost._id,
        upToDatePost,
        {
          new: true,
        },
      );
    }
  }

  async deletePost(postId: string): Promise<Post | null> {
    if (!Types.ObjectId.isValid(postId)) {
      throw new BadRequestException(
        'Id fornecido não é um ObjectId do MongoDB',
      );
    } else {
      return await this.postModel.findByIdAndDelete(postId).exec();
    }
  }

  async createComment(postId: string, commentData: CreateOrUpdateComment) {
    return this.postModel.findByIdAndUpdate(
      postId,
      {
        $push: { comments: commentData },
      },
      { new: true },
    );
  }

  async deleteComment(postId: string, commentId: string) {
    return this.postModel.findByIdAndUpdate(
      postId,
      {
        $pull: { comments: { _id: commentId } },
      },
      { new: true },
    );
  }

  async likePost(postId: string, likeByData: CreateOrRemoveLike) {
    return this.postModel.findByIdAndUpdate(postId, {
      $addToSet: { likedBy: likeByData },
    });
  }

  async unlikePost(postId: string, userId: number) {
    return this.postModel.findByIdAndUpdate(postId, {
      $pull: { likedBy: userId },
    });
  }
}
