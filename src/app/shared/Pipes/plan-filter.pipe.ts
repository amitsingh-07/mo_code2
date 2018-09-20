import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'planFilter'
})
export class PlanFilterPipe implements PipeTransform {
    transform(plans: any[], filter: object): any {
        if (!plans || !filter) {
            return plans;
        }
        return plans.filter((plan) => filter);
    }
}
