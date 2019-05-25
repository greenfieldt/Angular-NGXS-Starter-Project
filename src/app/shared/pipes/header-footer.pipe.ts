import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'headerFooter',
    pure: false
})
export class HeaderFooterPipe implements PipeTransform {
    transform(items: any[], filter: Object): any {
        if (!items || !filter) {
            return items;
        }
        return items.filter((item: any) => {
            if (filter === 'header') {
                return item.showInHeader;
            }
            else if (filter === 'footer') {
                return item.showInFooter;
            }
            else {
                return true;
            }
        });
    }

}
