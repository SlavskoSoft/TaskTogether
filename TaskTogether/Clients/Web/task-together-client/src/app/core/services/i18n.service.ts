import { Injectable, inject } from '@angular/core';
import { LanguageService, Language } from './language.service';
import { BehaviorSubject, Observable, Subject, map, startWith, distinctUntilChanged } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private languageService = inject(LanguageService);

  private translations: Record<Language, any> = {
    en: {},
    uk: {},
  };

  private translationsLoadedSubject = new BehaviorSubject<boolean>(false);
  public translationsLoaded$ = this.translationsLoadedSubject.asObservable();

  // Use Subject instead of BehaviorSubject with counter
  // This emits the actual language, making intent clearer
  private languageChangeSubject = new Subject<Language>();
  public languageChange$ = this.languageChangeSubject.asObservable();

  constructor() {
    this.initializeTranslations();
  }

  private async initializeTranslations(): Promise<void> {
    const language = this.languageService.getCurrentLanguage();
    await this.loadTranslation(language);

    // Watch for language changes and re-load translations
    this.languageService.currentLanguage$.pipe(
      distinctUntilChanged() // Only react to actual language changes
    ).subscribe((lang) => {
      this.loadTranslation(lang);
      this.languageChangeSubject.next(lang); // Emit the new language
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

  /**
   * Observable version that emits the translation immediately and whenever language changes.
   * Re-emits whenever the language is changed via LanguageService.
   * 
   * @param key - The translation key (supports dot notation: 'auth.login.title')
   * @returns Observable that emits the translated string
   */
  translate$(key: string): Observable<string> {
    return this.languageChange$.pipe(
      startWith(this.languageService.getCurrentLanguage()), // Emit current language on first subscription
      map(() => this.translate(key)) // Translate with current language
    );
  }

  /**
   * One-time translation getter that returns an Observable.
   * Useful for getting a single translation value and completing.
   * 
   * @param key - The translation key
   * @returns Observable that emits once and completes
   */
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
