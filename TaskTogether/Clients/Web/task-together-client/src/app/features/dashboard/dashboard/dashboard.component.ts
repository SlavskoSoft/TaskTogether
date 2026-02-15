import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private i18nService = inject(I18nService);

  welcome$ = this.i18nService.translate$('dashboard.welcome');
  message$ = this.i18nService.translate$('dashboard.message');
}
