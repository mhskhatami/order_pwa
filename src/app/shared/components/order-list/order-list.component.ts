// order-list.component.ts
import { Component, OnInit } from '@angular/core';
import * as moment from 'jalali-moment';
import { Person } from 'src/app/core/models/bazara/bazara-DTOs/Person';
import { Order } from 'src/app/core/models/bazara/bazara-DTOs/order';
import { OrderDetail } from 'src/app/core/models/bazara/bazara-DTOs/order-detail';
import { IndexedDbService } from 'src/app/core/services/indexed-db/indexed-db.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  orderDetails: OrderDetail[] = [];
  people: Person[] = [];
  isLoading = false;

  searchText = '';

  get filteredOrders() {
    return this.orders.filter(order =>
      this.getPersonName(order.PersonId).toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  constructor(private indexedDbService: IndexedDbService) { }

  ngOnInit(): void {
    this.isLoading = true;
    Promise.all([
      this.indexedDbService.getAllData<Order>("Order"),
      this.indexedDbService.getAllData<OrderDetail>("OrderDetail"),
      this.indexedDbService.getAllData<Person>("Person")
    ]).then(([orders, orderDetails, people]) => {
      this.orders = orders.sort((a, b) => new Date(b.OrderDate).getTime() - new Date(a.OrderDate).getTime());
      this.orderDetails = orderDetails;
      this.people = people;
      this.isLoading = false;
    }).catch(error => {
      console.error('Error getting data from IndexedDB:', error);
      // Handle the error appropriately (e.g., display a user-friendly message)
    });
  }


  getOrderSum(order: Order): number {
    const relatedOrderDetails = this.orderDetails.filter(detail => detail.OrderId === order.OrderId);
    const subtotal = this.getSubtotal(relatedOrderDetails);
    const totalDiscount = this.getTotalDiscount(order, relatedOrderDetails);
    const totalTax = this.getTotalTax(relatedOrderDetails);
    const totalCharge = this.getTotalCharge(relatedOrderDetails);
    return subtotal - totalDiscount + totalTax + totalCharge;
  }

  getSubtotal(orderDetails: OrderDetail[]): number {
    return orderDetails.reduce((sum, detail) => sum + (detail.Price), 0);
  }

  getTotalDiscount(order: Order, orderDetails: OrderDetail[]): number {
    const itemDiscount = orderDetails.reduce((sum, detail) => sum + detail.Discount, 0);
    let orderDiscount = 0;
    if (order.DiscountType === 0) { // Amount
      orderDiscount = order.Discount;
    } else if (order.DiscountType === 1) { // Percentage
      orderDiscount = this.getSubtotal(orderDetails) * (order.Discount / 100);
    }
    return itemDiscount + orderDiscount;
  }

  getTotalTax(orderDetails: OrderDetail[]): number {
    return orderDetails.reduce((sum, detail) => sum + (detail.Price * detail.TaxPercent), 0);
  }

  getTotalCharge(orderDetails: OrderDetail[]): number {
    return orderDetails.reduce((sum, detail) => sum + (detail.Price * detail.ChargePercent), 0);
  }

  getOrderSubtotal(order: Order): number {
    const orderDetails = this.orderDetails.filter(detail => detail.OrderId === order.OrderId);
    return orderDetails.reduce((sum, detail) => sum + (detail.Price), 0);
  }

  getOrderDiscount(order: Order): number {
    const orderDetails = this.orderDetails.filter(detail => detail.OrderId === order.OrderId);
    const itemDiscount = orderDetails.reduce((sum, detail) => sum + detail.Discount, 0);
    let orderDiscount = 0;
    if (order.DiscountType === 0) { // Amount
      orderDiscount = order.Discount;
    } else if (order.DiscountType === 1) { // Percentage
      orderDiscount = this.getOrderSubtotal(order) * (order.Discount / 100);
    }
    return itemDiscount + orderDiscount;
  }

  getOrderTax(order: Order): number {
    const orderDetails = this.orderDetails.filter(detail => detail.OrderId === order.OrderId);
    return orderDetails.reduce((sum, detail) => sum + (detail.Price * detail.TaxPercent / 100), 0);
  }

  getOrderCharge(order: Order): number {
    const orderDetails = this.orderDetails.filter(detail => detail.OrderId === order.OrderId);
    return orderDetails.reduce((sum, detail) => sum + (detail.Price * detail.ChargePercent / 100), 0);
  }
  getPersonName(personId: number): string {
    const person = this.people.find(p => p.PersonId === personId);
    if (person) {
      const firstName = person.FirstName || ''; // Handle null or undefined FirstName
      const lastName = person.LastName || ''; // Handle null or undefined LastName
      return firstName + ' ' + lastName;
    }
    return ''; // Return empty string if person is null or undefined
  }

  getPerson(personId: number): Person | undefined {
    return this.people.find(p => p.PersonId === personId);
  }

  getFormattedDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  }

  getFormattedPersianDate(dateString: string): string {
    let m = moment(dateString, 'YYYY-M-D HH:mm:ss');
    let persianDate = m.format('jYYYY/jM/jD HH:mm:ss');
    return persianDate;
  }


}
