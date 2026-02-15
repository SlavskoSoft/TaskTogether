import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private i18nService = inject(I18nService);

  email = '';
  password = '';
  error = '';
  isLoading = false;

  // Observable translations
  title$ = this.i18nService.translate$('auth.login.title');
  emailLabel$ = this.i18nService.translate$('auth.login.email');
  passwordLabel$ = this.i18nService.translate$('auth.login.password');
  submitBtn$ = this.i18nService.translate$('auth.login.submit');
  submittingBtn$ = this.i18nService.translate$('auth.login.submitting');
  registerLink$ = this.i18nService.translate$('auth.login.registerLink');

  onSubmit(): void {
    this.error = '';
    this.isLoading = true;

    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.error = err?.error?.message || 'Login failed. Please try again.';
        this.isLoading = false;
      },
    });
  }
}
