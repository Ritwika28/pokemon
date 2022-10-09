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

  it('should call with empty card data', () => {
    const getPokemonList = spyOn(component, 'getPokemonList');
    const namevaluechange = spyOn(component, 'namevaluechange');
    const abilityvaluechanges = spyOn(component, 'abilityvaluechanges');
    component.ngOnInit();
    expect(component.loader).toEqual(true);
    expect(getPokemonList).toHaveBeenCalled();
    expect(namevaluechange).toHaveBeenCalled();
    expect(abilityvaluechanges).toHaveBeenCalled();
  });

  it('should call getPokemonList', () => {
    service.getPokemonsTotal().subscribe((data) => {
      expect(data).toBe(POKEMON_MOCKS_TOTAL);
      expect(component.totalCount).toEqual(POKEMON_MOCKS_TOTAL.count);
      service.getListOfPokemon(2).subscribe((data) => {
        expect(data).toBe(POKEMON_ARR);
        expect(
          component.getPokemonDetails([
            'https://pokeapi.co/api/v2/pokemon/1/',
            'https://pokeapi.co/api/v2/pokemon/2/',
          ])
        ).toHaveBeenCalled();
      });
    });
  });

  it('should call getPokemonDetails', () => {
    const event = new KeyboardEvent('keyup', {
      bubbles: true,
      cancelable: true,
      shiftKey: false,
    });
    const input = fixture.debugElement.query(By.css('#name-filter'));
    input.triggerEventHandler('keyup', event);
    expect(component.filteredValues['name']).toEqual('');
  });

  it('should call getPokemonDetails', () => {
    const event = new KeyboardEvent('keyup', {
      bubbles: true,
      cancelable: true,
      shiftKey: false,
    });
    const input = fixture.debugElement.query(By.css('#ability-filter'));
    input.triggerEventHandler('keyup', event);
  });

  it('should call the getabilities', () => {
    component.getabilities(POKEMON_MOCKS_INDEX);
    fixture.detectChanges();
    expect(component.getabilities(POKEMON_MOCKS_INDEX)).toEqual([
      'overgrow',
      'chlorophyll',
    ]);
  });

  it('should call getToDetails', () => {
    component.getToDetails(POKEMON_MOCKS_INDEX);
    expect(router.navigate).toHaveBeenCalledWith(['/detail'], {
      queryParams: { id: POKEMON_MOCKS_INDEX?.id },
    });
  });

  it('should call getToDetails with other', () => {
    component.getToDetails(POKEMON_MOCKS_INDEXSEC);
    expect(router.navigate).toHaveBeenCalledWith(['/detail'], {
      queryParams: { id: POKEMON_MOCKS_INDEXSEC?.id },
    });
  });

  it('should click any options', () => {
    const select = fixture.debugElement.query(
      By.css('mat-select')
    ).nativeElement;
    select.click();
    fixture.detectChanges();
    const selectOptions = fixture.debugElement.queryAll(By.css('mat-option'));
    selectOptions[2].nativeElement.click();
    fixture.detectChanges();
  });

  it('check the length of drop down', async () => {
    const matOptions =
      fixture.debugElement.nativeElement.querySelectorAll('mat-option');
    fixture.detectChanges();
    expect(matOptions.length).toEqual(3);
    expect(matOptions[0].innerText.trim()).toEqual('Name');
    expect(matOptions[1].innerText.trim()).toEqual('Height');
    expect(matOptions[2].innerText.trim()).toEqual('Weight');
    matOptions[0].click();
  });
});
