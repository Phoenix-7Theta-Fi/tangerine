import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { InventoryService } from './inventory.service';
import { MarketplaceController } from './marketplace.controller';
import { OrderService } from './order.service';
import { ProductService } from './product.service';

/**
 * Marketplace: products, contended inventory, optimistic carts, and the
 * data-driven order state machine. Services are exported for the checkout saga.
 */
@Module({
  controllers: [MarketplaceController],
  providers: [ProductService, InventoryService, CartService, OrderService],
  exports: [ProductService, InventoryService, CartService, OrderService],
})
export class MarketplaceModule {}
