import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PokemonGalleryComponent } from './pokemon-gallery.component';
import { PokemonService } from '../../services/pokemon.service';
import { MatTableDataSource } from '@angular/material/table';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import {
  POKEMON_MOCKS_TOTAL,
  POKEMON_MOCKS_INDEX,
  POKEMON_MOCKS_INDEXSEC,
  POKEMON_ARR,
} from '../../shared/pokemon.mock';
import { By } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
describe('PokemonGalleryComponent', () => {
  let component: PokemonGalleryComponent;
  let fixture: ComponentFixture<PokemonGalleryComponent>;
  let service: PokemonService;
  let router: Router;
  let navigateSpy: any;
  let localStore: any;
  beforeEach(async () => {
    localStore = {
      cardData: JSON.stringify(POKEMON_MOCKS_INDEX),
      nameFilter: 'bul',
      abilitiesFilter: '',
      selectev: 'name',
    };

    const mockLocalStorage = {
      getItem: (key: string): string => {
        return key in localStore ? localStore[key] : null;
      },
      setItem: (key: string, value: string) => {
        localStore[key] = `${value}`;
      },
    };

    spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, MatCardModule],
      declarations: [PokemonGalleryComponent],
    }).compileComponents();
    service = TestBed.inject(PokemonService);
    router = TestBed.get(Router);
    navigateSpy = spyOn(router, 'navigate');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PokemonGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
