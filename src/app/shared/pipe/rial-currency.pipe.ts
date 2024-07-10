import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rialCurrency'
})
export class RialCurrencyPipe implements PipeTransform {
  transform(value: number): string {
    // Convert the number to Rial currency format
    return value.toLocaleString('fa-IR') + ' ریال';
  }
}