import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.currentUser()?.isAdmin) {
    return true;
  }

  // Not an admin (or not logged in at all) - no admin section for them, ever.
  return router.createUrlTree(['/']);
};