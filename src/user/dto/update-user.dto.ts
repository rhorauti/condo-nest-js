import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AddressDTO } from '../../address/dto/address.dto';
import { USER_ROLES } from '../../core/enum/role.enum';
import { MediaDTO } from '../../media/dto/media.dto';
import { SignUpDTO } from './signup.dto';

export class UpdateUserDTO extends SignUpDTO {
  @IsBoolean()
  isActive!: boolean;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsOptional()
  role!: USER_ROLES;

  @ValidateNested()
  @Type(() => AddressDTO)
  address!: AddressDTO;

  @ValidateNested()
  @IsOptional()
  @Type(() => MediaDTO)
  mediaObject?: MediaDTO;
}
