import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { Observable } from 'rxjs-compat';
import { RestService } from './rest.service';
import { Catalog, CountItem, Currency, Query } from 'app/models/page';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  constructor(private rest: RestService) { }

  public catalog(page: number, size: number, search?: string): Observable<Catalog<CountItem>[]> {
    var url: string;
    if (typeof search != 'undefined' && search) {
      url = `/catalog/?page=${page}&size=${size}&search=${search}`;
    } else {
      url = `/catalog/?page=${page}&size=${size}`;
    }
    return this.rest.get<Catalog<CountItem>[]>(url);
  }

  public getCountries(): Observable<Catalog<CountItem>[]> {
    var url = "/catalog/country/";
    return this.rest.get<Catalog<CountItem>[]>(url);
  }

  public getCities(countryId: number): Observable<Catalog<CountItem>[]> {
    var url = `/catalog/country/cities/${countryId}`;
    return this.rest.get<Catalog<CountItem>[]>(url);
  }

  public getStudyTypes(): Observable<Catalog<CountItem>[]> {
    var url = "/catalog/studytype/";
    return this.rest.get<Catalog<CountItem>[]>(url);
  }

  public getOrgTypes(): Observable<Catalog<CountItem>[]> {
    var url = "/catalog/orgtypes/";
    return this.rest.get<Catalog<CountItem>[]>(url);
  }

  public getSubjects(query?: string): Observable<CountItem[]> {
    if (typeof query != 'undefined' && query) {
      var url = `/catalog/specialization/${query}`;
      return this.rest.get<Query[]>(url).pipe(map(res => this.reduceQueryToItem(res)));
    }
    var url = "/catalog/specialization/";
    return this.rest.get<Catalog<CountItem>[]>(url).pipe(map((c: Catalog<CountItem>[]) => {
      var items = c[0].items;
      return items;
    }));
  }

  public getEvents(query?: string): Observable<CountItem[]> {
    if (typeof query != 'undefined' && query) {
      var url = `/catalog/event/${query}`;
      return this.rest.get<Query[]>(url).pipe(map(res => this.reduceQueryToItem(res)));
    }
    var url = "/catalog/event/";
    return this.rest.get<Catalog<CountItem>[]>(url).pipe(map((c: Catalog<CountItem>[]) => {
      var items = c[0].items;
      return items;
    }));
  }

  public getLanguages(query?: string): Observable<CountItem[]> {
    if (typeof query != 'undefined' && query) {
      var url = `/catalog/lang/${query}`;
      return this.rest.get<Query[]>(url).pipe(map(res => this.reduceQueryToItem(res)));
    }
    var url = "/catalog/lang/";
    return this.rest.get<Catalog<CountItem>[]>(url).pipe(map((c: Catalog<CountItem>[]) => {
      var items = c[0].items;
      return items;
    }));
  }

  public getProgramTypes(query?: string): Observable<CountItem[]> {
    if (typeof query != 'undefined' && query) {
      var url = `/catalog/programtype/${query}`;
      return this.rest.get<Query[]>(url).pipe(map(res => this.reduceQueryToItem(res)));
    }
    var url = "/catalog/programtype/";
    return this.rest.get<Catalog<CountItem>[]>(url).pipe(map((c: Catalog<CountItem>[]) => {
      var items = c[0].items;
      return items;
    }));
  }

  public getCurrencies(): Observable<Currency[]> {
    var url = `/currency/?f_page=1&f_size=13`;
    return this.rest.get<Catalog<Currency>[]>(url).pipe(map((c: Catalog<Currency>[]) => {
      var items = c[0].items;
      return items;
    }));
  }

  public getLivingForms(): Observable<CountItem[]> {
    var url = `/catalog/livingform/?f_page=1&f_size=10`;
    return this.rest.get<Catalog<CountItem>[]>(url).pipe(map((c: Catalog<CountItem>[]) => {
      var items = c[0].items;
      return items;
    }));
  }

  private reduceQueryToItem(arr: Query[]): CountItem[] {
    var newArr: CountItem[] = [];
    arr.forEach(e => newArr.push(this.convertQueryToItem(e)));
    return newArr;
  }

  private convertQueryToItem(query: Query): CountItem {
    return {
      id: query.id,
      name: query.query
    } as CountItem;
  }
}
