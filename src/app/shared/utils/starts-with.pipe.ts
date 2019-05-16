import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'startsWith'
})
export class StartsWithPipe implements PipeTransform {
    transform(items: any[], searchText: string, key: string): any[] {
        if (!items) {
            return [];
        }
        if (!searchText) {
            return items;
        }
        searchText = searchText.toLowerCase();
        return items.filter((item) => {
            if (item[key]) {
                return item[key].toLowerCase().startsWith(searchText);
            }
        });
    }
}