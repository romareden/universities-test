import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { UNIVERSITIES_API_URL } from './universities.service.config';

export interface University {
  country: string;
  name: string;
  web_pages?: string[];
  domains?: string[];
  alpha_two_code: string;
  'state-province'?: string | null
}

@Injectable({
  providedIn: 'root'
})
export class UniversitiesService {
  cache: { [key: string]: University[] } = {};
  url: string = UNIVERSITIES_API_URL;

  constructor(private http: HttpClient) { }

  getUniversitiesByCountry(country: string): Observable<University[]> {
    if (this.cache[country]) {

      return of(this.cache[country]);
    }

    return this.http.get<University[]>(this.url + country)
      .pipe(
        tap(u => this.cache[country] = u)
      );
  }
}
