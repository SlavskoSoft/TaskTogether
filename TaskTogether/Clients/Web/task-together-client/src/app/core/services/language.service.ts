import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export type Language = 'en' | 'uk';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private availableLanguages: Language[] = ['en', 'uk'];
  private storageKey = 'tt_language';

  private currentLanguageSubject = new BehaviorSubject<Language>(this.getInitialLanguage());
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  private getInitialLanguage(): Language {
    if (!this.isBrowser) {
      return 'en';
    }

    const stored = localStorage.getItem(this.storageKey) as Language | null;
    if (stored && this.availableLanguages.includes(stored)) {
      return stored;
    }

    // Detect browser language
    const browserLang = navigator?.language?.split('-')[0];
    if (browserLang && this.availableLanguages.includes(browserLang as Language)) {
      return browserLang as Language;
    }

    return 'en';
  }

  setLanguage(language: Language): void {
    if (this.availableLanguages.includes(language)) {
      this.currentLanguageSubject.next(language);
      if (this.isBrowser) {
        localStorage.setItem(this.storageKey, language);
      }
    }
  }

  getCurrentLanguage(): Language {
    return this.currentLanguageSubject.value;
  }

  getAvailableLanguages(): Language[] {
    return this.availableLanguages;
  }
}
