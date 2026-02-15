import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent {
  private i18nService = inject(I18nService);

  // Observable translations
  title$ = this.i18nService.translate$('tasks.title');
  coming$ = this.i18nService.translate$('tasks.coming');
}
