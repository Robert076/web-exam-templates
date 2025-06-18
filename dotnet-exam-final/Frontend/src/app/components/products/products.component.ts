import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {
  products: Product[] = [];
  loading = false;
  error = '';
  orderSuccess = false;
  lastOrderId: number | null = null;
  productQuantities: { [key: number]: number } = {};
  
  // Confirmation popup properties
  showConfirmation = false;
  selectedProduct: Product | null = null;
  selectedQuantity = 0;

  constructor(
    private productService: ProductService,
    private orderService: OrderService
  ) {}

  loadProducts() {
    this.loading = true;
    this.error = '';
    this.products = [];
    this.orderSuccess = false;

    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        // Initialize quantities for each product
        products.forEach(product => {
          this.productQuantities[product.id] = 1;
        });
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message || 'Failed to load products';
        this.loading = false;
      },
    });
  }

  confirmOrder(product: Product) {
    const quantity = this.productQuantities[product.id];
    if (!quantity || quantity < 1) {
      this.error = 'Please enter a valid quantity';
      return;
    }

    this.selectedProduct = product;
    this.selectedQuantity = quantity;
    this.showConfirmation = true;
    this.error = '';
  }

  confirmOrderAction() {
    if (!this.selectedProduct) return;

    const orderRequest = {
      items: [{
        productId: this.selectedProduct.id,
        quantity: this.selectedQuantity
      }]
    };

    this.orderService.createOrder(orderRequest).subscribe({
      next: (order) => {
        this.orderSuccess = true;
        this.lastOrderId = order.id;
        this.error = '';
        
        // Store product ID before clearing
        const productId = this.selectedProduct?.id;
        
        this.showConfirmation = false;
        this.selectedProduct = null;
        this.selectedQuantity = 0;
        
        // Reset quantity after successful order
        if (productId) {
          this.productQuantities[productId] = 1;
        }
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          this.orderSuccess = false;
          this.lastOrderId = null;
        }, 5000);
      },
      error: (error) => {
        this.error = error.message || 'Failed to place order';
        this.orderSuccess = false;
        this.showConfirmation = false;
      },
    });
  }

  cancelOrder() {
    this.showConfirmation = false;
    this.selectedProduct = null;
    this.selectedQuantity = 0;
  }

  getCategory(productName: string | undefined): string {
    if (!productName) return '';
    const dashIndex = productName.indexOf('-');
    if (dashIndex === -1) return '';
    return productName.substring(0, dashIndex).toUpperCase();
  }
} 