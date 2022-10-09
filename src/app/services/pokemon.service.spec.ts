import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { PokemonService } from './pokemon.service';
import { environment } from 'src/environments/environment';
describe('PokemonService', () => {
  let service: PokemonService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PokemonService],
    });
    service = TestBed.inject(PokemonService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPokemonListDetail', () => {
    it('should call get with correct url', () => {
      service.getPokemonListDetail(1).subscribe();
      const req = httpTestingController.expectOne(
        `${environment.baseUrl}/pokemon/1`
      );
    });
  });

  describe('getPokemonsTotal', () => {
    it('should call get with correct url', () => {
      service.getPokemonsTotal().subscribe();
      const req = httpTestingController.expectOne(
        `${environment.baseUrl}/pokemon`
      );
    });
  });

  describe('getListOfPokemon', () => {
    it('should call get with correct url', () => {
      service.getListOfPokemon(1).subscribe();
      const req = httpTestingController.expectOne(
        `${environment.baseUrl}/pokemon?limit=1`
      );
    });
  });
});
