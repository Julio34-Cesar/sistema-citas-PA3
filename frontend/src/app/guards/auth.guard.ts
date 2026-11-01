import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Solo deja pasar a usuarios con sesión iniciada
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.estaLogueado()) return true;
  return router.createUrlTree(['/login'], { queryParams: { volver: state.url } });
};

// Solo deja pasar al administrador
export const adminGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.estaLogueado()) {
    return router.createUrlTree(['/login'], { queryParams: { volver: state.url } });
  }
  return auth.esAdmin() ? true : router.createUrlTree(['/citas']);
};