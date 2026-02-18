import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';

export function provideCoreServices() {
  return [
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
  ];
}
