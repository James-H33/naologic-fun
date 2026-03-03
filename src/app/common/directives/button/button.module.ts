import { NgModule } from '@angular/core';
import { ButtonDirective } from './button.directives';

@NgModule({
  imports: [ButtonDirective],
  exports: [ButtonDirective],
})
export class ButtonModule {}
