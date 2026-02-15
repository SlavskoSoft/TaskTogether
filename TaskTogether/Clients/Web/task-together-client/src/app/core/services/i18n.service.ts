import { Injectable, inject } from '@angular/core';
import { LanguageService, Language } from './language.service';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private languageService = inject(LanguageService);

  private translations: Record<Language, any> = {
    en: {},
    uk: {},
  };

  private translationsLoadedSubject = new BehaviorSubject<boolean>(false);
  public translationsLoaded$ = this.translationsLoadedSubject.asObservable();

  private languageChangeSubject = new BehaviorSubject<number>(0);

  constructor() {
    this.initializeTranslations();
  }

  private async initializeTranslations(): Promise<void> {
    const language = this.languageService.getCurrentLanguage();
    await this.loadTranslation(language);

    // Watch for language changes
    this.languageService.currentLanguage$.subscribe((lang) => {
      this.loadTranslation(lang);
      // Emit a signal when language changes to trigger re-translation
      this.languageChangeSubject.next(this.languageChangeSubject.value + 1);
    });

    this.translationsLoadedSubject.next(true);
  }

  private async loadTranslation(language: Language): Promise<void> {
    try {
      if (!this.translations[language] || Object.keys(this.translations[language]).length === 0) {
        const translationModule = await import(`../../../assets/i18n/${language}.json`);
        this.translations[language] = translationModule.default || translationModule;
      }
    } catch (error) {
      console.error(`Failed to load translation for ${language}:`, error);
    }
  }

  translate(key: string): string {
    const language = this.languageService.getCurrentLanguage();
    const keys = key.split('.');
    let value: any = this.translations[language];

    for (const k of keys) {
      value = value?.[k];
    }

    return typeof value === 'string' ? value : key;
  }

  // Observable version that emits on language changes
  translate$(key: string): Observable<string> {
    return this.languageChangeSubject.pipe(
      map(() => this.translate(key))
    );
  }

  getTranslation(key: string): Observable<string> {
    return new Observable((observer) => {
      if (this.translationsLoadedSubject.value) {
        observer.next(this.translate(key));
        observer.complete();
      } else {
        this.translationsLoaded$.subscribe(() => {
          observer.next(this.translate(key));
          observer.complete();
        });
      }
    });
  }
}
