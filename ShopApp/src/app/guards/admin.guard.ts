import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';

/* Admin guard */
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); // Auth service
  const router = inject(Router);          // Router

  if (authService.isAdmin()) {
    return true; // Allow admin
  } else {
    router.navigate(['/']); // Redirect non-admin
    return false;
  }
};
