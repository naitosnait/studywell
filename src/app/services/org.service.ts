import { Injectable } from '@angular/core';
import { RestService } from 'app/services/rest.service';
import { Observable } from 'rxjs';
import { Org } from '../models/org';
import { map } from 'rxjs/operators';
import { OrgResponse } from 'app/models/response';

@Injectable()
export class OrgService {

  constructor(private rest: RestService) { }

  public getOrgs(page: number, size: number): Observable<Org[]> {
    var url = `/admin/org/list?page=${page}&size=${size}`;
    return this.rest.get<OrgResponse>(url)
      .pipe(map(res => res.orgs));
  }

  public deleteOrg(email: string): Observable<string> {
    var url = `/admin/org/delete?email=${email}`;
    return this.rest.delete<string>(url);
  }

  public activateOrg(email: string, trigger: boolean): Observable<string> {
    var url = `/admin/org/activate?email=${email}&org_status=${trigger}`;
    return this.rest.post<string>(url, {});
  }

  public setPageToOrg(pageId: number, email: string, trigger: boolean): Observable<string> {
    var url = `/admin/org//set?page_id=${pageId}&email=${email}&set=${trigger}`;
    return this.rest.post<string>(url, {});
  }
}
