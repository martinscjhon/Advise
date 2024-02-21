import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

interface IPokemon {
  name: string
  index: number
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'

})

export class AppComponent {
  readonly baseApi: string = 'https://pokeapi.co/api/v2/pokemon';
  readonly baseRows = 5;
  readonly baseTotalItens = 20;

  listDefaultPokemons: any[] = [];
  listPokemon: IPokemon[] = []

  user: string = 'Jhonatan Martins';
  valueSearch: string = '';

  totalItens: number = this.baseTotalItens;
  totalPages: number = 0;
  initialPagination: number = 0;
  currentPage: number = 1;
  rowsPerPage: number = this.baseRows;
  finishPagination: number = this.baseRows;
  showAutocomplete: boolean = false

  constructor(private httpClient: HttpClient) { }

  transformFirstLetterUpperCase(value: string) {
    const firstLetter = value[0].toUpperCase();
    const text = value.slice(1, value.length)
    return `${firstLetter}${text}`
  }

  getAllPokemons() {
    this.httpClient.get(`${this.baseApi}/?offset=${this.currentPage}&limit=${this.baseTotalItens}`)
    .subscribe((response: any) => {
      this.listDefaultPokemons = response.results;
      this.listPokemon = [];
      this.rowsPerPage = this.baseRows;
      response.results?.slice(this.initialPagination, this.finishPagination).map((item: any) => {
        this.listPokemon.push({name: this.transformFirstLetterUpperCase(item.name), index: response.results.indexOf(item)})
      })
    })
  }

  getByNamePokemon() {
    this.httpClient.get(`${this.baseApi}/${this.valueSearch}`)
    .subscribe((response: any) => {
      this.listPokemon = [];
      this.rowsPerPage = response.forms.length;
      response.forms?.map((item: any) => {
        this.listPokemon.push({name: this.transformFirstLetterUpperCase(item.name), index: response.forms.indexOf(item)})
      })
    })
  }

  ngOnInit(): void {
    this.getAllPokemons();
    this.totalPages = this.baseTotalItens / this.baseRows
  }

  onChange(event: any) {
    this.valueSearch = event.target.value;
    setTimeout(() => {
      this.getByNamePokemon()
    }, 1500)
  }

  closeSearch() {
    this.valueSearch = "";
    this.showAutocomplete = false
    this.totalItens = this.baseTotalItens;
    this.getAllPokemons();
  }

  searchPokemon() {
    this.getByNamePokemon()
  }

  selectedAutocomplete(value: string) {
    this.valueSearch = value;
    this.showAutocomplete = false;
    this.getByNamePokemon()
  }

  paginationNextPage() {
    this.currentPage += 1;
    this.initialPagination += this.baseRows;
    this.finishPagination += this.baseRows;
    this.getAllPokemons();
  }

  paginationPreviusPage() {
    this.currentPage -= 1;
    this.initialPagination -= this.baseRows;
    this.finishPagination -= this.baseRows;
    this.getAllPokemons();
  }

  paginationFirstPage() {
    this.currentPage = 1;
    this.initialPagination = 0;
    this.finishPagination = this.baseRows;
    this.getAllPokemons();
  }

  paginationLastPage() {
    this.currentPage = this.totalPages;
    this.initialPagination = this.totalItens - this.baseRows;
    this.finishPagination = this.totalItens;
    this.getAllPokemons();
  }
}
