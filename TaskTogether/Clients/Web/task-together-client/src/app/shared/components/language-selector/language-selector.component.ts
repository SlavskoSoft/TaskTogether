import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService, Language } from '../../../core/services/language.service';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.scss',
})
export class LanguageSelectorComponent {
  private languageService = inject(LanguageService);

  languages: Array<{ code: Language; name: string }> = [
    { code: 'en', name: 'English' },
    { code: 'uk', name: 'Українська' },
  ];

  currentLanguage$ = this.languageService.currentLanguage$;

  onLanguageChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const language = target.value as Language;
    this.languageService.setLanguage(language);
  }
}
