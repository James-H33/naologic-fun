import { NgModule } from '@angular/core';
import { TooltipDirective } from './tooltip.directive';

@NgModule({
  imports: [TooltipDirective],
  exports: [TooltipDirective],
})
export class TooltipModule {}
