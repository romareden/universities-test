import { Component } from '@angular/core';
import { 
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { CountryService } from 'src/app/services/country/country.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {
  form: FormGroup;
  filteredOptions: Observable<string[]>;

  constructor( private fb: FormBuilder, private c: CountryService ) {
    this.form = this.fb.group({
      country: ['', [Validators.required, this.validateCountryName(this.c.countries)]]
    });

    this.filteredOptions = this.countryControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }

  get countryControl(): AbstractControl {
    return this.form.get('country')!;
  }

  onSubmit(): void {
    this.c.country.next(this.countryControl.value);
  }

  imLucky(): void {
    this.c.country.next(
      this.c.countries[Math.round(
        this.c.countries.length * Math.random()
      )]
    );
  }

  private validateCountryName(countryArray: string[]): ValidatorFn {
    return ({ value }: AbstractControl): ValidationErrors | null => {
      return countryArray.filter(c => c.toLowerCase() === value.toLowerCase()).length > 0
        ? null
        : { invalidCountryName: value };
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.c.countries.filter(option => option.toLowerCase().includes(filterValue));
  }
}
