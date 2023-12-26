import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { PostsService } from 'src/app/services/posts.service';
import { Food } from 'src/app/shared/models/Food';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  foods: Food[] = [];
  // foods: Array<Food> = [];
  // options: string[] = ['One', 'Two', 'Three'];
  // searchs = ['Pizza', 'Burger', 'Meat', 'Soup', 'Steak', 'Potatoes'];
  // options = ['Badea', 'Hussin', 'Saif'];
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  searchTerm = '';

  constructor(
    activatedRoute: ActivatedRoute,
    private router: Router,
    private postsService: PostsService
  ) {
    activatedRoute.params.subscribe((params) => {
      if (params.searchTerm) this.searchTerm = params.searchTerm;
    });
  }

  sendData(event: any) {
    let query: string = event.target.value;
    let matchSpaces: any = query.match(/\s*/);
    if (matchSpaces[0] === query) {
      this.foods = [];
      return;
    }

    this.postsService.searchFoods(query.trim()).subscribe((results) => {
      // this.foods = results
      console.log(results);
    });
  }

  ngOnInit(): void {}

  search(term: string): void {
    if (term) this.router.navigateByUrl('/search/' + term);
  }
}
