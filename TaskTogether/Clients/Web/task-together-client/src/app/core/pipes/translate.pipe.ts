import { Pipe, PipeTransform, inject } from '@angular/core';
import { I18nService } from '../services/i18n.service';
import { LanguageService } from '../services/language.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false,
})
export class TranslatePipe implements PipeTransform {
  private i18nService = inject(I18nService);
  private languageService = inject(LanguageService);

  transform(key: string): string {
    // Force re-evaluation whenever language changes
    this.languageService.currentLanguage$.subscribe(() => {
      // Subscription just for change detection
    });

    return this.i18nService.translate(key);
  }
}

