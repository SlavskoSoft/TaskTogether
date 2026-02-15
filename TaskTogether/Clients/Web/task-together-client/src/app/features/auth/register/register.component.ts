import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private i18nService = inject(I18nService);

  email = '';
  password = '';
  role = 'Parent';
  error = '';
  isLoading = false;

  // Observable translations
  title$ = this.i18nService.translate$('auth.register.title');
  emailLabel$ = this.i18nService.translate$('auth.register.email');
  passwordLabel$ = this.i18nService.translate$('auth.register.password');
  roleLabel$ = this.i18nService.translate$('auth.register.role');
  submitBtn$ = this.i18nService.translate$('auth.register.submit');
  submittingBtn$ = this.i18nService.translate$('auth.register.submitting');
  loginLink$ = this.i18nService.translate$('auth.register.loginLink');
  roleParent$ = this.i18nService.translate$('auth.register.roleParent');
  roleChild$ = this.i18nService.translate$('auth.register.roleChild');

  onSubmit(): void {
    this.error = '';
    this.isLoading = true;

    this.auth.register(this.email, this.password, this.role).subscribe({
      next: () => {
        this.router.navigate(['/auth/login'], {
          queryParams: { message: 'Registration successful. Please login.' },
        });
      },
      error: (err) => {
        this.error = err?.error?.message || 'Registration failed. Please try again.';
        this.isLoading = false;
      },
    });
  }
}
