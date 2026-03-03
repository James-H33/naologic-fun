import { NgModule } from '@angular/core';
import { InputDirective } from './input.directive';

@NgModule({
  imports: [InputDirective],
  exports: [InputDirective],
})
export class InputModule {}
