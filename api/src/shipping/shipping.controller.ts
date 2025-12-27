import { Controller, Post, Body } from '@nestjs/common';
import { ShippingService } from './shipping.service';
import { CalculateShippingDto } from './dto/calculate-shipping.dto';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('shipping')
@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Post('calculate')
  @ApiOperation({ summary: 'Calculate shipping cost and delivery time' })
  @ApiBody({ type: CalculateShippingDto })
  calculateShipping(@Body() calculateShippingDto: CalculateShippingDto) {
    return this.shippingService.calculateShipping(calculateShippingDto);
  }
}
