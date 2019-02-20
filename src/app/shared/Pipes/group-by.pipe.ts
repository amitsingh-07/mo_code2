import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'groupBy' })
export class GroupByPipe implements PipeTransform {
    transform(value, field: string) {
        const groupedObj = value.reduce((prev, cur) => {
            if (!prev[cur[field]]) {
                prev[cur[field]] = [cur];
            } else {
                prev[cur[field]].push(cur);
            }

            return prev;
        }, {});

        const c = Object.keys(groupedObj).map((groupName) => ({
            groupName,
            value: groupedObj[groupName]
        }));
        return c;
    }
}
