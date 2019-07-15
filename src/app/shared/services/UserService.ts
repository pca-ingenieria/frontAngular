import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment as ENV } from '../../../environments/environment';

@Injectable()
export class UserService {
  options: any;
  routeBaseApi: string = ENV.BASE_URL;
  constructor(private http: HttpClient) {
    this.options = {
      headers: {
        'Accept': 'application/json',
        'contentType': "application/json"
      }
    };
  }

  getUsers(): Observable<any> {
    let ruta = this.routeBaseApi + 'getusers';
    return this.http.get(ruta, this.options.headers)
  }

  saveUser(data): Observable<any> {
    let ruta = this.routeBaseApi + 'saveuser';
    return this.http.post(ruta, JSON.stringify(data), this.options.headers)
  }

  editUser(data, id): Observable<any> {
    let json = {
      data: data,
      id: id
    };
    let ruta = this.routeBaseApi + 'edituser';
    return this.http.post(ruta, JSON.stringify(json), this.options.headers)
  }

  updateBet(data, bet): Observable<any> {
    let json = {
      data: data,
      bet: bet
    };
    let ruta = this.routeBaseApi + 'updatebet';
    return this.http.post(ruta, JSON.stringify(json), this.options.headers)
  }

  showUser(id): Observable<any> {
    let ruta = this.routeBaseApi + 'showuser/' + id;
    return this.http.get(ruta, this.options.headers)
  }

  deleteUser(id): Observable<any> {
    let ruta = this.routeBaseApi + 'deleteuser/' + id;
    return this.http.get(ruta, this.options.headers)
  }

}