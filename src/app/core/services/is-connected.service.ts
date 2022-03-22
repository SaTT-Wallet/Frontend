import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenStorageService } from './tokenStorage/token-storage-service.service';

@Injectable({
  providedIn: 'root'
})
export class IsConnectedService implements CanActivate {
  constructor(
    private router: Router,
    private tokenStorageService: TokenStorageService
  ) {}

  canActivate(): boolean {
    if (this.tokenStorageService.getIsAuth() !== 'true') {
      return true;
    } else {
      this.router.navigate(['']);
      return false;
    }
  }
}
