import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { API_URL } from '../config';
import { AuthService } from '../services/auth.service';

// Agrega el token JWT a cada petición hacia la API y cierra la sesión si el servidor responde 401
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.auth.token;
    const peticion =
      token && req.url.startsWith(API_URL)
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;

    return next.handle(peticion).pipe(
      catchError((e: HttpErrorResponse) => {
        const esAuth = req.url.includes('/auth/login') || req.url.includes('/auth/register');
        if (e.status === 401 && !esAuth) {
          // Token vencido o inválido: se limpia la sesión y se vuelve al login
          this.auth.logout('expirada');
        }
        return throwError(() => e);
      })
    );
  }
}