import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sumBy'
})
export class SumByPipe implements PipeTransform {
  transform(items: any[], prop: string): number {
    console.log(items);
    return items.reduce((a, b) => a + (b[prop] || 0), 0);
  }
}
