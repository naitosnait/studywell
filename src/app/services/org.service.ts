import { Injectable } from '@angular/core';
import { RestService } from 'app/services/rest.service';
import { Observable } from 'rxjs';
import {  Org } from '../models/org';
import { map } from 'rxjs/operators';
import { OrgResponse } from 'app/models/response';

@Injectable()
export class OrgService {

  constructor(private rest: RestService) { }

  public getOrgs(page: number,size: number): Observable<Org[]> {
    var url = `/admin/org/list?page=${page}&size=${size}`;
    return this.rest.get<OrgResponse>(url)
      .pipe(map(res => res.orgs));
  }
}
