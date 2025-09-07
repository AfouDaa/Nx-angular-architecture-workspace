import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private userKey = 'userData';

  setUser(user: any): void {
    try {
      const userString = JSON.stringify(user);
      localStorage.setItem(this.userKey, userString);
    } catch (error) {
      console.error('Error saving user to local storage', error);
    }
  }

  getUser(): Observable<any> {
    return new Observable<any>(observer => {
      try {
        const userString = localStorage.getItem(this.userKey);
        const user = userString ? JSON.parse(userString) : null;
        observer.next(user);
        observer.complete();
      } catch (error) {
        console.error('Error retrieving user from local storage', error);
        observer.error('Error retrieving user from local storage');
      }
    });
  }

  removeUser(): void {
    try {
      localStorage.removeItem(this.userKey);
    } catch (error) {
      console.error('Error removing user from local storage', error);
    }
  }
}
