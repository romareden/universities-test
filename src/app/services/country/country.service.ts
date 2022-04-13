import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { COUNTRIES_ARRAY } from './country.service.config';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  country: Subject<string> = new Subject<string>();
  countries: string[] = COUNTRIES_ARRAY;

  constructor() { }
}
