import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

export interface Food {
  _id: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  constructor(private http: HttpClient) {}

  searchFoods(query: string) {
    // this.http.post<{ payload: string }>('api/getFoods', { payload: query });
    return this.http
      .post<{ payload: Array<Food> }>(
        'http://localhost:5000/api/foods/getFoods',
        { payload: query },
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        }
      )
      .pipe(map((data) => data.payload));
  }
}
