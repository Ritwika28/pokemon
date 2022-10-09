import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonService } from 'src/app/services/pokemon.service';

@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.scss'],
})
export class PokemonDetailComponent implements OnInit {
  pokeDetail: any;

  constructor(
    private activatedRouter: ActivatedRoute,
    private pokemonService: PokemonService,
    public router: Router
  ) {}

  getPokeDetailsApi(id: any): void {
    this.pokemonService.getPokemonListDetail(id).subscribe((data: any) => {
      this.pokeDetail = data;
    });
  }

  getToHome() {
    this.router.navigateByUrl('/home');
  }

  ngOnInit(): void {
    let id = this.activatedRouter?.snapshot?.queryParamMap?.get('id');
    this.getPokeDetailsApi(id);
  }
}
