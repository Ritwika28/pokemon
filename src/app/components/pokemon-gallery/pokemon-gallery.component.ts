import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { PokemonService } from 'src/app/services/pokemon.service';
import { Observable } from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';

export interface Card {
  title: string;
  subtitle: string;
  text: string;
}

export interface OptionModel {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-pokemon-gallery',
  templateUrl: './pokemon-gallery.component.html',
  styleUrls: ['./pokemon-gallery.component.scss'],
})
export class PokemonGalleryComponent implements OnInit {
  cardsData: any[] = [];
  pokemonData: any = [];
  options: OptionModel[] = [
    { value: 'name', viewValue: 'Name' },
    { value: 'height', viewValue: 'Height' },
    { value: 'weight', viewValue: 'Weight' },
  ];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  obs!: Observable<any>;
  dataSource!: MatTableDataSource<any>;
  totalCount!: number;
  abilitiesFilter = new FormControl();
  nameFilter = new FormControl();
  filteredValues = {
    abilities: '',
    name: '',
  };
  loader: boolean = false;
  selectedValue!: string;
  namefStore!: string;
  sortfStore!: string;
  abilityfStore!: string;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatSort, { static: false }) matSort!: MatSort;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private pokemonService: PokemonService,
    private router: Router
  ) {}

  public handlePageBottom(event: PageEvent) {
    this.paginator.pageSize = event.pageSize;
    this.paginator.pageIndex = event.pageIndex;
    this.paginator.page.emit(event);
  }

  ngOnInit() {
    this.changeDetectorRef.detectChanges();
    this.cardsData = JSON.parse(localStorage.getItem('cardData') || '[]');
    this.namefStore = localStorage.getItem('nameFilter') || '';
    this.abilityfStore = localStorage.getItem('abilitiesFilter') || '';
    this.selectedValue = localStorage.getItem('selectev') || '';
    if (this.cardsData.length > 0) {
      this.dataSource = new MatTableDataSource<any>(this.cardsData);
      this.obs = this.dataSource.connect();
      this.dataSource.paginator = this.paginator;
      if (this.namefStore || this.abilityfStore || this.selectedValue) {
        this.filterDataPresent();
      } else if (!this.namefStore && !this.abilityfStore) {
        this.dataSource.data = this.cardsData;
      }
    } else {
      this.loader = true;
      this.getPokemonList();
    }

    this.namevaluechange();
    this.abilityvaluechanges();
  }

  filterDataPresent() {
    this.nameFilter?.setValue(this.namefStore);
    this.abilitiesFilter?.setValue(this.abilityfStore);
    this.dataSource.data = this.dataSource.data
      .filter((a) => {
        let result = this.getabilities(a);

        if (
          JSON.stringify(result)
            .trim()
            .toLowerCase()
            .indexOf(this.abilityfStore?.toLowerCase()) !== -1 &&
          a.name
            .toString()
            .trim()
            .toLowerCase()
            .indexOf(this.namefStore?.toLowerCase()) !== -1
        ) {
          return a;
        }
      })
      .sort((a: any, b: any) => {
        return this.getSort(a, b, this.selectedValue);
      });
  }

  namevaluechange() {
    this.nameFilter.valueChanges.subscribe((nameFilterValue) => {
      localStorage.setItem('nameFilter', nameFilterValue);
      this.filteredValues['name'] = nameFilterValue;
      if (this.abilityfStore) {
        this.filteredValues['abilities'] = this.abilitiesFilter?.value;
      }
      this.newPrdiction();
    });
  }

  abilityvaluechanges() {
    this.abilitiesFilter.valueChanges.subscribe((abilitiesFilterValue) => {
      localStorage.setItem('abilitiesFilter', abilitiesFilterValue);
      this.filteredValues['abilities'] = abilitiesFilterValue;
      if (this.namefStore) {
        this.filteredValues['name'] = this.nameFilter?.value;
      }
      this.newPrdiction();
    });
  }

  newPrdiction() {
    this.dataSource.data = this.cardsData.sort((a: any, b: any) => {
      return this.getSort(a, b, this.selectedValue);
    });
    this.dataSource.filter = JSON.stringify(this.filteredValues);
  }

  getPokemonList() {
    this.pokemonService.getPokemonsTotal().subscribe((res: any) => {
      this.totalCount = res.count;
      this.pokemonService.getListOfPokemon(this.totalCount).subscribe(
        (dishum) => {
          this.getPokemonDetails(dishum.map((d: any) => d.url));
        },
        (error) => {
          console.error(error);
        }
      );
    });
  }

  getPokemonDetails(urlList: Array<any>) {
    this.pokemonService.getPokemonDetails(urlList).subscribe(
      (response) => {
        this.pokemonData = response.map(function (value: any, index, array) {
          return {
            id: value.id,
            name: value.name,
            height: value.height,
            weight: value.weight,
            image:
              value['sprites']['other']['official-artwork']['front_default'],
            abilities: value.abilities,
          };
        });
        this.cardsData = [...this.pokemonData].sort((a: any, b: any) => {
          return this.getSort(a, b, this.selectedValue);
        });
        this.dataSource = new MatTableDataSource<any>(this.cardsData);
        this.obs = this.dataSource.connect();
        this.dataSource.paginator = this.paginator;
        this.loader = false;
        localStorage.setItem('cardData', JSON.stringify(this.cardsData));
      },
      (error) => {
        console.error(error);
      }
    );
  }

  customFilterPredicate() {
    const myFilterPredicate = (data: any, filter: string): boolean => {
      let searchString = JSON.parse(filter);
      let result: any[] = [];
      result = this.getabilities(data);

      return (
        JSON.stringify(result)
          .trim()
          .toLowerCase()
          .indexOf(searchString.abilities.toLowerCase()) !== -1 &&
        data.name
          .toString()
          .trim()
          .toLowerCase()
          .indexOf(searchString.name.toLowerCase()) !== -1
      );
    };
    return myFilterPredicate;
  }

  getabilities(data: any) {
    return data.abilities
      .map(function (i: any) {
        return i.ability;
      })
      .map(function (a: any) {
        return a.name;
      });
  }

  filterDataSource() {
    this.dataSource.filterPredicate = this.customFilterPredicate();
    this.obs = this.dataSource.connect();
  }

  getSelect(ev: any) {
    this.dataSource.data = this.dataSource.data.sort((a: any, b: any) => {
      return this.getSort(a, b, ev.value);
    });
    localStorage.setItem('selectev', ev.value);
  }

  getSort(a: any, b: any, str: any) {
    if (a[str] > b[str]) {
      return 1;
    }
    if (a[str] < b[str]) {
      return -1;
    }
    return 0;
  }

  getToDetails(cardDetail: any) {
    this.router.navigate(['/detail'], {
      queryParams: { id: cardDetail.id },
    });
  }

  ngOnDestroy() {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }
}
