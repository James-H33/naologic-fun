import { Component, effect, inject, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { ButtonModule } from '@common/directives/button/button.module';
import { InputModule } from '@common/directives/input/input.module';
import { ApplicationActions } from '@common/store/application/application.actions';
import { Store } from '@ngrx/store';

interface LoginForm {
  username: string;
  password: string;
}

@Component({
  selector: 'nl-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [ButtonModule, InputModule, FormField],
})
export class LoginComponent {
  store = inject(Store);

  model = signal<LoginForm>({
    username: '',
    password: '',
  });

  errorMessage = signal<string>('');

  form = form<LoginForm>(this.model, (schemaPath) => {
    required(schemaPath.username);
    required(schemaPath.password);
  });

  constructor() {
    effect(() => {
      this.form().value();
      this.errorMessage.set('');
    });
  }

  login(): void {
    const form = this.form();
    const credentials = form.value();

    if (!form.valid()) {
      this.errorMessage.set('Please fill in all required fields.');
      return;
    }

    this.store.dispatch(ApplicationActions.login(credentials));
  }
}
