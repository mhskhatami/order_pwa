import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { BazaraService } from '../bazara/bazara.service';
import { IndexedDbService } from '../indexed-db/indexed-db.service';
import { UtilityService } from '../common/utility.service';
import { IBazaraLoginDTO } from '../../models/bazara/login-model/IBazaraLoginDTO';
import { ILoginResult } from '../../models/bazara/login-model/ILoginResultDTO';
import { Login } from '../../models/bazara/bazara-DTOs/Login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$: Observable<boolean> = this.isLoggedIn.asObservable();

  constructor(private router: Router,
    private utilityService: UtilityService,
    private bazaraService: BazaraService,
    private indexedDbService: IndexedDbService,
    private snackBar: MatSnackBar) { }

  loginToMobileOrdering(model: IBazaraLoginDTO): Observable<boolean> {    
    this.bazaraService.bazaraLogin(model).subscribe({
      next: (res: ILoginResult) => {
        if (res.Result) {          
          this.indexedDbService.setVisitorId(res.Data!.VisitorId.toString());
          localStorage.setItem('UserData', JSON.stringify(res.Data));
          localStorage.setItem('UserToken', res.Data!.UserToken);

          console.log(res.Data?.VisitorId);

          const key: IDBValidKey = [+res.Data!.VisitorId, res.Data!.VisitorId];
          
          this.indexedDbService.addOrEdit('Login', res.Data, key);

          this.utilityService.showHeaderFooter.next('dashboard');

          this.isLoggedIn.next(true);

          this.router.navigate(['/dashboard']); // Navigate on successful login
          return true;
        }
        else {
          this.isLoggedIn.next(false);

          this.snackBar.open(res.Message, 'بستن', {
            duration: 5000,
            verticalPosition: 'top'
          });

          return false;
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
    return this.isLoggedIn$;
  }

  public logoutFromMobileOrdering(): Observable<boolean> {
    localStorage.clear();
    this.isLoggedIn.next(false);
    this.router.navigate(['/login']);
    return this.isLoggedIn$;
  }

  public isAuthenticated(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.isLoggedIn$.subscribe(res => {        
        resolve(res)
      });
      reject("get errors");
    });
  }

  hasToken() {
  // let obj = localStorage.getItem('UserData');
  //   console.log(obj);
  //   let obj2 = JSON.parse(obj!);
  //   console.log(obj2.UserToken);
    
    return !!localStorage.getItem('UserToken');
  }
}