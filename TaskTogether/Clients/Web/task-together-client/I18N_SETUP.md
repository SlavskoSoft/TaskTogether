# Internationalization (i18n) Setup

This project supports multiple languages: English (en) and Ukrainian (uk).

## Features

- 🌍 Support for English and Ukrainian languages
- 🔄 Runtime language switching without page reload
- 💾 Language preference persistence in localStorage
- 🎯 Browser language auto-detection
- 🎨 Language selector in navbar

## File Structure

```
src/
├── assets/i18n/
│   ├── en.json          # English translations
│   └── uk.json          # Ukrainian translations
├── app/
│   ├── core/
│   │   ├── services/
│   │   │   ├── language.service.ts     # Language state management
│   │   │   └── i18n.service.ts         # Translation service
│   │   └── pipes/
│   │       └── translate.pipe.ts       # Optional translation pipe
│   └── shared/components/
│       └── language-selector/          # Language selector component
```

## How to Use

### 1. In Components (TypeScript)

```typescript
import { Component, inject } from '@angular/core';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-example',
  standalone: true,
})
export class ExampleComponent {
  private i18nService = inject(I18nService);

  get greeting(): string {
    return this.i18nService.translate('navbar.home');
  }
}
```

### 2. In Templates

```html
<h1>{{ greeting }}</h1>
<p>{{ i18nService.translate('auth.login.email') }}</p>
```

Or use the translate pipe (if implemented):

```html
<h1>{{ 'navbar.home' | translate }}</h1>
```

### 3. Adding New Translations

1. Add entries to both `src/assets/i18n/en.json` and `src/assets/i18n/uk.json`
2. Use the same key structure in both files (dot notation for nested properties)

Example:
```json
{
  "myFeature": {
    "title": "My Feature Title",
    "description": "My Feature Description"
  }
}
```

### 4. Changing Language Programmatically

```typescript
import { LanguageService } from '../../../core/services/language.service';

constructor(private languageService: LanguageService) {}

changeLanguage() {
  this.languageService.setLanguage('uk'); // or 'en'
}
```

### 5. Observing Language Changes

```typescript
this.languageService.currentLanguage$.subscribe((lang) => {
  console.log('Language changed to:', lang);
});
```

## Services

### LanguageService
- Manages current language state
- Persists language preference to localStorage
- Auto-detects browser language on first visit
- Available languages: ['en', 'uk']

### I18nService
- Loads and caches translation files
- Provides translate() method for getting translations
- Handles async translation loading

## Language Selector Component

The `LanguageSelectorComponent` is included in the navbar and allows users to switch languages. It displays:
- English
- Українська (Ukrainian)

## Browser Language Detection

On first visit (when no language is stored):
1. Checks localStorage for saved preference
2. If none, detects browser language
3. Falls back to English if browser language isn't supported

## Future Enhancements

- Add more languages as needed
- Implement lazy loading for large translation files
- Consider ngx-translate for more advanced features
- Add pluralization support
- Add parameter interpolation (e.g., "Hello {{ name }}")
