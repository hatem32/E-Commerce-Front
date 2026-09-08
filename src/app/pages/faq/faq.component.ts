import { Component, signal } from '@angular/core';

interface FaqEntry {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  templateUrl: './faq.component.html'
})
export class FaqComponent {
  faqs: FaqEntry[] = [
    {
      question: 'How long does shipping take?',
      answer: 'Delivery time depends on the method you choose at checkout - typically between 1 and 10 business days.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit and debit cards through our secure Stripe checkout.'
    },
    {
      question: 'Can I return or exchange an item?',
      answer: 'Yes - most items can be returned within 14 days of delivery. Contact our support team to start a return.'
    },
    {
      question: 'How do I track my order?',
      answer: 'Once logged in, go to "My Orders" to see the status and details of every order you\'ve placed.'
    },
    {
      question: 'Do I need an account to shop?',
      answer: 'You can browse freely, but you\'ll need to create a free account to add items to your cart or wishlist and check out.'
    },
    {
      question: 'How can I contact customer support?',
      answer: 'Head over to our Contact page and send us a message - we typically reply within 24 hours.'
    }
  ];

  openIndex = signal<number | null>(0);

  toggle(index: number): void {
    this.openIndex.set(this.openIndex() === index ? null : index);
  }
}