import { PartialType } from '@nestjs/mapped-types';
import { CreateCondoDto } from './create-condo.dto';

export class UpdateCondoDto extends PartialType(CreateCondoDto) {}
