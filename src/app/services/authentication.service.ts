import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {BehaviorSubject, Observable} from "rxjs";
import {IAuthModel} from "../models/auth.model";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  private userSubject: BehaviorSubject<IAuthModel>;
  public user: Observable<IAuthModel>;



  constructor(private http: HttpClient) {
    this.userSubject = new BehaviorSubject<IAuthModel>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();
  }
  public get userValue(): IAuthModel {
    return this.userSubject.value;
  }

  private hostAuth = environment.hostAuth;

  getMe(): Observable<IAuthModel>{
    //  const users: IAuthModel  = {
    //    fio: 'sdsdsdsdsd',
    //    authorities: ['P_P_p1', 'P_P_p2', 'P_P_p3',  'P_P_p4', 'P_P_p5', 'P_P_p6', 'P_P_p7', 'P_P_p8', 'P_P_p10' ]
    //  }
    // localStorage.setItem('user', JSON.stringify(users));
    //  return
    localStorage.removeItem("user");
    return this.http.get<IAuthModel>(this.hostAuth + `me`)
      .pipe(map(user => {
      localStorage.setItem('user', JSON.stringify(user));
      this.userSubject.next(user);
      return user;
    }));
  }
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }
}