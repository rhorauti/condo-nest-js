import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { SuperbaseStorageService } from '../../superbase/superbase-storage.service';
import { ErrorMessage } from '../core/decorators/error-message.decorator';
import { SuccessMessage } from '../core/decorators/response-message.decorator';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';
import { UserService } from '../user/services/user.service';
import { CreateOrUpdatePostDto } from './dto/post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly storageService: SuperbaseStorageService,
    private readonly userService: UserService,
  ) {}

  // @Get(':idUser')
  // @SuccessMessage('Lista de posts enviada com sucesso.')
  // @ErrorMessage('Erro ao buscar a lista de posts')
  // @UseGuards(JwtAuthGuard)
  // getPosts(@Param('idUser') idUser: number) {
  //   return this.postsService.getPosts(idUser);
  // }

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  @SuccessMessage('Post criado com sucesso.')
  @ErrorMessage('Erro ao criar o post.')
  @UseGuards(JwtAuthGuard)
  async createPost(
    @Body() createPostDto: CreateOrUpdatePostDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      const uploadedMedia = await Promise.all(
        (files || []).map((file) =>
          this.storageService.uploadFile({
            buffer: file.buffer,
            originalName: file.originalname,
            contentType: file.mimetype,
            folder: 'posts',
          }),
        ),
      );

      const mediaList =
        uploadedMedia?.map((media) => ({
          mediaPath: media.path,
        })) ?? [];

      const post = await this.postsService.createPost({
        idUser: createPostDto.idUser,
        postType: createPostDto.postType,
        description: createPostDto.description,
        createdAt: new Date(),
        mediaList,
      });
      return post;
    } catch (error) {}
  }

  // @Put()
  // @SuccessMessage('Post atualizado com sucesso.')
  // @ErrorMessage('Erro ao atualiar o post.')
  // @UseGuards(JwtAuthGuard)
  // updatePost(@Body() createPostDto: CreatePostDto) {
  //   return this.postsService.updatePost(createPostDto);
  // }

  // @Delete(':postId')
  // @SuccessMessage('Post excluído com sucesso.')
  // @ErrorMessage('Erro ao excluir o post.')
  // deletePost(@Param('postId') postId: string) {
  //   return this.postsService.deletePost(postId);
  // }

  // @Post('comments/:postId')
  // @SuccessMessage('Comentário criado com sucesso.')
  // @ErrorMessage('Erro ao criar o comentário.')
  // @UseGuards(JwtAuthGuard)
  // createComment(
  //   @Param('postId') postId: string,
  //   @Body() commentData: CreateOrUpdateComment,
  // ) {
  //   return this.postsService.createComment(postId, commentData);
  // }

  // @Delete('comments/:postId/:commentId')
  // @SuccessMessage('Comentário criado com sucesso.')
  // @ErrorMessage('Erro ao criar o comentário.')
  // @UseGuards(JwtAuthGuard)
  // deleteComment(
  //   @Param('postId') postId: string,
  //   @Param('commentId') commentId: string,
  // ) {
  //   return this.postsService.deleteComment(postId, commentId);
  // }

  // @Post('likes/:postId')
  // @SuccessMessage('Like registrado com sucesso.')
  // @ErrorMessage('Erro ao gerar o like.')
  // @UseGuards(JwtAuthGuard)
  // likePost(
  //   @Param('postId') postId: string,
  //   @Body() likeByData: CreateOrRemoveLike,
  // ) {
  //   return this.postsService.likePost(postId, likeByData);
  // }

  // @Delete('likes/:postId/:userId')
  // @SuccessMessage('Like registrado com sucesso.')
  // @ErrorMessage('Erro ao remover o like.')
  // @UseGuards(JwtAuthGuard)
  // unlikePost(@Param('postId') postId: string, @Param('userId') userId: number) {
  //   return this.postsService.unlikePost(postId, userId);
  // }
}
