import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';

/**
 *  Interceptors:
 *    Angular's interceptors flow in the order you provide them.
 *    If you provide interceptors A, then B, then C,
 *    then requests will flow in A->B->C and responses will flow out C->B->A.
 */
export const httpInterceptorProviders = [addInterceptor(AuthInterceptor)];

function addInterceptor<T>(interceptor: T) {
  return {
    provide: HTTP_INTERCEPTORS,
    useClass: interceptor,
    multi: true,
  };
}
