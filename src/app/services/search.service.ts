import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { Item } from 'app/models/page';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private rest: RestService) { }

  public search(query: string, limit: number): Observable<Item[]> {
    var url = `/search/${query}?limit=${limit}`;
    return this.rest.get<Item[]>(url);
  }

}
