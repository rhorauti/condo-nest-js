import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CondoService } from './condo.service';
import { CreateCondoDto } from './dto/create-condo.dto';
import { UpdateCondoDto } from './dto/update-condo.dto';

@Controller('condo')
export class CondoController {
  constructor(private readonly condoService: CondoService) {}

  @Post()
  create(@Body() createCondoDto: CreateCondoDto) {
    return this.condoService.create(createCondoDto);
  }

  @Get()
  findAll() {
    return this.condoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.condoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCondoDto: UpdateCondoDto) {
    return this.condoService.update(+id, updateCondoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.condoService.remove(+id);
  }
}
