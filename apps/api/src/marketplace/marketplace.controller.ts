import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../common/guards/auth.guard';
import { AuthUser, CurrentUser } from '../common/decorators/current-user.decorator';
import { InventoryService } from './inventory.service';
import { CartService } from './cart.service';
import { OrderService } from './order.service';
import { ProductService } from './product.service';
import {
  AddCartItemDto,
  CreateOrderDto,
  CreateProductDto,
  ReserveInventoryDto,
  TransitionOrderDto,
} from './dto/marketplace.dto';

@ApiTags('marketplace')
@ApiBearerAuth('x-user-id')
@UseGuards(AuthGuard)
@Controller('marketplace')
export class MarketplaceController {
  constructor(
    private readonly products: ProductService,
    private readonly inventory: InventoryService,
    private readonly cart: CartService,
    private readonly orders: OrderService,
  ) {}

  @Post('products')
  @ApiOperation({ summary: 'Create a product (current user is the practitioner)' })
  createProduct(@CurrentUser() user: AuthUser, @Body() dto: CreateProductDto) {
    return this.products.create({ ...dto, practitionerId: user.id });
  }

  @Get('products')
  @ApiOperation({ summary: 'List active products' })
  listProducts() {
    return this.products.list();
  }

  @Post('inventory/:productId/reserve')
  @ApiOperation({ summary: 'Reserve inventory (conditional UPDATE)' })
  async reserve(
    @Param('productId') productId: string,
    @Body() dto: ReserveInventoryDto,
  ) {
    const reserved = await this.inventory.reserve(productId, dto.quantity);
    return { productId, quantity: dto.quantity, reserved };
  }

  @Post('inventory/:productId/release')
  @ApiOperation({ summary: 'Release a reservation (compensating action)' })
  async release(
    @Param('productId') productId: string,
    @Body() dto: ReserveInventoryDto,
  ) {
    const released = await this.inventory.release(productId, dto.quantity);
    return { productId, quantity: dto.quantity, released };
  }

  @Get('cart')
  @ApiOperation({ summary: "The current user's cart" })
  getCart(@CurrentUser() user: AuthUser) {
    return this.cart.getOrCreateCart(user.id).then(() => this.cart.getCart(user.id));
  }

  @Post('cart/items')
  @ApiOperation({ summary: 'Add/merge a cart line (optimistic locking)' })
  addItem(@CurrentUser() user: AuthUser, @Body() dto: AddCartItemDto) {
    return this.cart.addItem(
      user.id,
      dto.productId,
      dto.quantity,
      dto.expectedVersion,
    );
  }

  @Post('orders')
  @ApiOperation({ summary: 'Create a PENDING order from a cart' })
  createOrder(@CurrentUser() user: AuthUser, @Body() dto: CreateOrderDto) {
    return this.orders.createFromCart(user.id, dto.cartId);
  }

  @Get('orders/:id')
  @ApiOperation({ summary: 'Fetch an order with items and transitions' })
  getOrder(@Param('id') id: string) {
    return this.orders.getOrder(id);
  }

  @Post('orders/:id/transition')
  @ApiOperation({ summary: 'Apply a legal order status transition' })
  transition(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: TransitionOrderDto,
  ) {
    return this.orders.transition(id, dto.to, dto.actorRole, user.id);
  }
}
