import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { of, forkJoin } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) {}

  getPokemonListDetail(index: number) {
    return this.http.get<any>(`${this.baseUrl}/pokemon/${index}`);
  }

  getPokemonsTotal() {
    return this.http.get<any>(`${this.baseUrl}/pokemon`);
  }

  public getListOfPokemon(limit: number) {
    const params = new HttpParams().set('limit', limit);
    return this.http
      .get<any>(`${this.baseUrl}/pokemon`, {
        observe: 'response',
        params: params,
      })
      .pipe(
        map((res) => res.body.results),
        catchError((error) => of(error.url))
      );
  }

  public getPokemonDetails(urlList: Array<any>) {
    urlList = urlList.map((url) => this.http.get<any>(url));
    return forkJoin(urlList);
  }
}
