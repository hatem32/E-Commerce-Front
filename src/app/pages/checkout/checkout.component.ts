import { CurrencyPipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { environment } from '../../../environments/environment';
import { BasketService } from '../../core/services/basket.service';
import { OrderService } from '../../core/services/order.service';
import { PaymentService } from '../../core/services/payment.service';
import { AddressDto, DeliveryMethodDto } from '../../core/models/order.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule, CurrencyPipe, RouterLink],
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent implements OnInit, AfterViewInit {
  basket = inject(BasketService);
  private orderService = inject(OrderService);
  private paymentService = inject(PaymentService);
  private router = inject(Router);

  deliveryMethods = signal<DeliveryMethodDto[]>([]);
  selectedDeliveryMethodId = signal<number | null>(null);
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  paymentReady = signal(false);
  private pendingOrderId: string | null = null;

  address: AddressDto = { firstName: '', lastName: '', street: '', city: '', country: '' };

  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;

  get selectedDeliveryMethod(): DeliveryMethodDto | undefined {
    return this.deliveryMethods().find(d => d.id === this.selectedDeliveryMethodId());
  }

  get total(): number {
    return this.basket.subTotal() + (this.selectedDeliveryMethod?.cost ?? 0);
  }

  ngOnInit(): void {
    this.orderService.getDeliveryMethods().subscribe(methods => {
      this.deliveryMethods.set(methods);
      if (methods.length) {
        this.selectDeliveryMethod(methods[0]);
      }
    });
  }

  async ngAfterViewInit(): Promise<void> {
    this.stripe = await loadStripe(environment.stripePublishableKey);
  }

  selectDeliveryMethod(method: DeliveryMethodDto): void {
    this.selectedDeliveryMethodId.set(method.id);
    this.basket.setDeliveryMethod(method.id, method.cost);
  }

  private isAddressComplete(): boolean {
    return !!(this.address.firstName && this.address.lastName && this.address.street && this.address.city && this.address.country);
  }

  async preparePayment(): Promise<void> {
    this.errorMessage.set(null);

    if (!this.isAddressComplete()) {
      this.errorMessage.set('Please fill in your full shipping address before continuing.');
      return;
    }

    if (!this.stripe) {
      this.errorMessage.set('Payment provider failed to load. Please refresh and try again.');
      return;
    }

    this.loading.set(true);

    this.paymentService.createOrUpdatePaymentIntent(this.basket.basketId).subscribe({
      next: (updatedBasket) => {
        if (!updatedBasket.clientSecret) {
          this.loading.set(false);
          this.errorMessage.set('Could not start payment. Please try again.');
          return;
        }

        // Create the order now (status Pending) - BEFORE confirming payment - so that when
        // Stripe's webhook fires (often within milliseconds of confirmPayment resolving),
        // the order already exists in the database for it to update to PaymentReceived.
        // Creating it only after confirmPayment succeeds is too late: the webhook usually
        // arrives first and silently finds no matching order to update.
        const deliveryMethodId = this.selectedDeliveryMethodId();
        if (!deliveryMethodId) {
          this.loading.set(false);
          this.errorMessage.set('Please choose a delivery method.');
          return;
        }

        this.orderService.createOrder({
          basketId: this.basket.basketId,
          deliveryMethodId,
          shipToAddress: this.address
        }).subscribe({
          next: (order) => {
            this.loading.set(false);
            this.pendingOrderId = order.id;

            this.elements = this.stripe!.elements({ clientSecret: updatedBasket.clientSecret! });
            const paymentElement = this.elements.create('payment');
            paymentElement.mount('#payment-element');
            this.paymentReady.set(true);
          },
          error: () => {
            this.loading.set(false);
            this.errorMessage.set('Could not create your order. Please check your details and try again.');
          }
        });
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Could not start payment. Please try again.');
      }
    });
  }

  async payAndPlaceOrder(): Promise<void> {
    if (!this.stripe || !this.elements || !this.pendingOrderId) return;

    this.errorMessage.set(null);
    this.loading.set(true);

    const { error, paymentIntent } = await this.stripe.confirmPayment({
      elements: this.elements,
      redirect: 'if_required'
    });

    this.loading.set(false);

    if (error) {
      this.errorMessage.set(error.message ?? 'Payment failed. Please check your card details.');
      return;
    }

    if (paymentIntent?.status !== 'succeeded') {
      this.errorMessage.set('Payment was not completed.');
      return;
    }

    // The order was already created before payment was confirmed (see preparePayment).
    // The webhook updates its status server-side; we just take the user to it.
    this.basket.clearBasket();
    this.router.navigate(['/orders', this.pendingOrderId]);
  }
}