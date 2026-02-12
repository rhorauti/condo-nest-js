import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { Address } from '@prisma/postgres-client/client';
import { ErrorMessage } from '../../core/decorators/error-message.decorator';
import { SuccessMessage } from '../../core/decorators/response-message.decorator';
import { CreateAddressDTO } from '../dto/address.dto';
import { AddressService } from '../service/address.service';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get(':idAddress')
  @SuccessMessage('Endereço enviado com sucesso.')
  @ErrorMessage('Erro no envio dos dados de endereço')
  async onGetDetailedAddress(
    @Param('idAddress', ParseIntPipe) idAddress: number,
  ): Promise<Address> {
    const address = await this.addressService.onGetAddress({
      where: { idAddress: idAddress },
    });
    if (!address)
      throw new BadRequestException(
        'Erro ao pegar as informações do endereço.',
      );

    return address;
  }

  @Post()
  @SuccessMessage('Endereço salvo com sucesso.')
  @ErrorMessage('Erro ao salvar o endereço.')
  async onSaveAddress(@Body() address: CreateAddressDTO): Promise<Address> {
    const finalAddressData =
      address && (address.idAddress ?? 0) > 0
        ? await this.addressService.onUpdateAddress({
            where: { idAddress: address.idAddress },
            data: address,
          })
        : await this.addressService.onCreateAddress(address);
    return finalAddressData;
  }

  @Delete(':idAddress')
  @SuccessMessage('Endereço excluido com sucesso.')
  @ErrorMessage('Erro ao excluir o endereço.')
  async onDeleteAddress(
    @Param('idAddress', ParseIntPipe) idAddress: number,
  ): Promise<void> {
    await this.addressService.onDeleteAddress(idAddress);
  }
}
