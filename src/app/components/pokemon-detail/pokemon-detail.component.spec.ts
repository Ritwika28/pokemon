import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonDetailComponent } from './pokemon-detail.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PokemonService } from '../../services/pokemon.service';
import { Observable, of } from 'rxjs';
import { By } from '@angular/platform-browser';
import {
  POKEMON_MOCKS_INDEX,
  POKEMON_MOCKS_INDEXSEC,
} from '../../shared/pokemon.mock';
describe('PokemonDetailComponent', () => {
  let component: PokemonDetailComponent;
  let fixture: ComponentFixture<PokemonDetailComponent>;
  let router: any;
  const mockRoute: any = {
    snapshot: {
      data: {
        id: 2,
      },
    },
  };

  let service: PokemonService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [PokemonDetailComponent],
      providers: [],
    }).compileComponents();
    service = TestBed.inject(PokemonService);
    router = TestBed.get(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PokemonDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
