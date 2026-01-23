import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ErrorMessage } from '../core/decorators/error-message.decorator';
import { SuccessMessage } from '../core/decorators/response-message.decorator';
import { CreateOrUpdateComment } from './dto/comment.dto';
import { CreateOrRemoveLike } from './dto/like.dto';
import { CreateOrUpdatePostDto } from './dto/post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('posts/:idUser')
  @SuccessMessage('Lista de posts enviada com sucesso.')
  @ErrorMessage('Erro ao buscar a lista de posts')
  @UseGuards(JwtAuthGuard)
  getPosts(@Param('idUser') idUser: number) {
    return this.postsService.getPosts(idUser);
  }

  @Get('posts/:postId')
  @SuccessMessage('Post enviado com sucesso.')
  @ErrorMessage('Erro ao buscar o post solicitado.')
  @UseGuards(JwtAuthGuard)
  getPost(@Param('postId') postId: string) {
    return this.postsService.getPost(postId);
  }

  @Post('posts')
  @SuccessMessage('Post criado com sucesso.')
  @ErrorMessage('Erro ao criar o post.')
  @UseGuards(JwtAuthGuard)
  createPost(@Body() createPostDto: CreateOrUpdatePostDto) {
    return this.postsService.createPost(createPostDto);
  }

  @Put('posts')
  @SuccessMessage('Post atualizado com sucesso.')
  @ErrorMessage('Erro ao atualiar o post.')
  @UseGuards(JwtAuthGuard)
  updatePost(@Body() createPostDto: CreateOrUpdatePostDto) {
    return this.postsService.updatePost(createPostDto);
  }

  @Delete('posts/:postId')
  @SuccessMessage('Post excluído com sucesso.')
  @ErrorMessage('Erro ao excluir o post.')
  deletePost(@Param('postId') postId: string) {
    return this.postsService.deletePost(postId);
  }

  @Post('posts/comments/:postId')
  @SuccessMessage('Comentário criado com sucesso.')
  @ErrorMessage('Erro ao criar o comentário.')
  @UseGuards(JwtAuthGuard)
  createComment(
    @Param('postId') postId: string,
    @Body() commentData: CreateOrUpdateComment,
  ) {
    return this.postsService.createComment(postId, commentData);
  }

  @Delete('posts/comments/:postId/:commentId')
  @SuccessMessage('Comentário criado com sucesso.')
  @ErrorMessage('Erro ao criar o comentário.')
  @UseGuards(JwtAuthGuard)
  deleteComment(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
  ) {
    return this.postsService.deleteComment(postId, commentId);
  }

  @Post('posts/likes/:postId')
  @SuccessMessage('Like registrado com sucesso.')
  @ErrorMessage('Erro ao gerar o like.')
  @UseGuards(JwtAuthGuard)
  likePost(
    @Param('postId') postId: string,
    @Body() likeByData: CreateOrRemoveLike,
  ) {
    return this.postsService.likePost(postId, likeByData);
  }

  @Delete('posts/likes/:postId/:userId')
  @SuccessMessage('Like registrado com sucesso.')
  @ErrorMessage('Erro ao remover o like.')
  @UseGuards(JwtAuthGuard)
  unlikePost(@Param('postId') postId: string, @Param('userId') userId: number) {
    return this.postsService.unlikePost(postId, userId);
  }
}
