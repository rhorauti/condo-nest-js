import { Injectable } from '@nestjs/common';
import { CreateCondoDto } from './dto/create-condo.dto';
import { UpdateCondoDto } from './dto/update-condo.dto';

@Injectable()
export class CondoService {
  create(createCondoDto: CreateCondoDto) {
    return 'This action adds a new condo';
  }

  findAll() {
    return `This action returns all condo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} condo`;
  }

  update(id: number, updateCondoDto: UpdateCondoDto) {
    return `This action updates a #${id} condo`;
  }

  remove(id: number) {
    return `This action removes a #${id} condo`;
  }
}
