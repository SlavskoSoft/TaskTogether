import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';
import { I18nService } from '../../../core/services/i18n.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LanguageSelectorComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private i18nService = inject(I18nService);

  isAuthenticated$ = this.authService.currentUser$.pipe(
    map(user => !!user)
  );
  currentUser$ = this.authService.getCurrentUser();

  // Observable translations
  home$ = this.i18nService.translate$('navbar.home');
  login$ = this.i18nService.translate$('navbar.login');
  register$ = this.i18nService.translate$('navbar.register');
  logout$ = this.i18nService.translate$('navbar.logout');

  ngOnInit(): void {
    // Automatically load auth status
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
