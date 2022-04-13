import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragHandle } from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs';
import { CountryService } from 'src/app/services/country/country.service';
import { UniversitiesService, University } from '../../services/universities/universities.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy {
  subs!: Subscription;
  displayedColumns: string[] = [ 'name', 'web_pages', 'domains' ];
  universitiesdataSource!: MatTableDataSource<University>;
  country: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(private c:CountryService, private u: UniversitiesService) { }

  get tableIsVisible(): boolean {
    return !!this.country;
  }

  ngOnInit(): void {
    this.subs = this.c.country
      .subscribe(country => {
        this.country = country;
        this.getUniversitiesByCountry(country)
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  getUniversitiesByCountry(country: string): void {
    this.u.getUniversitiesByCountry(country)
      .subscribe(universities => {
        this.universitiesdataSource = new MatTableDataSource(universities);
        this.universitiesdataSource.paginator = this.paginator;
        this.universitiesdataSource.sort = this.sort;
        this.universitiesdataSource.filterPredicate = (university: University, filterValue: string) => {
          return university.name
            .trim()
            .toLowerCase()
            .includes(filterValue.trim().toLowerCase());
        };
      });
  }

  filterByName(event: KeyboardEvent) {
    let filterValue = (<HTMLInputElement>event.target).value;
    
    this.universitiesdataSource.filter = filterValue;
  }

  dropRow(event: CdkDragDrop<MatTableDataSource<University>>) {
    moveItemInArray(
      this.universitiesdataSource.data,
      event.previousIndex,
      event.currentIndex
    );

    this.universitiesdataSource.data = this.universitiesdataSource.data;
  }
}
