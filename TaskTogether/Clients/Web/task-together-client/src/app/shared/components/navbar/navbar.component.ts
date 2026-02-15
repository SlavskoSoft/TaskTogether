import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  isAuthenticated$ = this.authService.currentUser$.pipe(
    map(user => !!user)
  );
  currentUser$ = this.authService.getCurrentUser();

  ngOnInit(): void {
    // Automatically load auth status
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
