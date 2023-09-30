import { Currency, Date, NewProgram } from './../../models/page';
import { Component } from '@angular/core';
import { Contacts, Item, CountItem, Page, FilterItem, Program, Location, Catalog, Price } from '../../models/page';
import { CatalogService } from 'app/services/catalog.service';
import { catchError, concatAll, distinctUntilChanged, map, mergeAll, switchAll, switchMap, tap } from 'rxjs/operators';
import { Observable, Subject, concat, from, of } from 'rxjs';
import { PageService } from '../../services/page.service';
import { Router } from '@angular/router';

@Component({
  selector: 'create-page',
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.css']
})
export class CreatePageComponent {

  private orgType: FilterItem;
  private studyType: FilterItem;

  public countries: CountItem[] = [];
  public cities: CountItem[] = [];
  public languages: CountItem[] = [];

  public subjects: CountItem[] = [];
  public studytypes: CountItem[] = [];
  public orgtypes: CountItem[] = [];

  public name: string = "";
  public description: string = "";
  public founded: string = "";
  public city: Item;
  public country: Item;
  public address: string = "";

  public coordinate1: number = 0;
  public coordinate2: number = 0;

  public site: string = "";
  public email: string = "";
  public tel: string = "";

  events$: Observable<CountItem[]>;
  eventsLoading = false;
  eventInput$ = new Subject<string>();
  selectedEvents: CountItem[] = <any>[];

  languages$: Observable<CountItem[]>;
  languagesLoading = false;
  languageInput$ = new Subject<string>();
  selectedLanguages: CountItem[] = <any>[];

  subjects$: Observable<CountItem[]>;
  subjectsLoading = false;
  subjectInput$ = new Subject<string>();
  selectedSubjects: CountItem[] = <any>[];

  programTypes$: Observable<CountItem[]>;
  programTypesLoading = false;
  programTypeInput$ = new Subject<string>();
  selectedProgramTypes: CountItem[] = <any>[];

  currencies: Currency[];
  livingForms: CountItem[];

  disButton = true;

  private programs: Map<number, NewProgram> = new Map<number, NewProgram>();

  constructor(private catalogService: CatalogService, private router: Router, private pageService: PageService) {
    // this.commonService.getCountries()
    //   .pipe(
    //     switchMap((c: FilterData[]) => {
    //       var items = c[0].items
    //       this.countries = items;
    //       return this.getCities(items[0]?.id)
    //     }))
    //   .subscribe();

    this.catalogService.getStudyTypes()
      .subscribe((c: Catalog<CountItem>[]) => {
        var items = c[0].items
        this.studytypes = items;
        var item = items[0];
        this.studyType = { id: item.id, name: item.name, filter: true } as FilterItem;
      });

    this.catalogService.getOrgTypes()
      .subscribe((c: Catalog<CountItem>[]) => {
        var items = c[0].items
        this.orgtypes = items;
        var item = items[0];
        this.orgType = { id: item.id, name: item.name, filter: true } as FilterItem;
      });

    this.loadEvents();
    this.loadLanguages();
    this.loadSubjects();
    this.loadProgramTypes();

    this.catalogService.getCurrencies()
      .subscribe(s => this.currencies = s);

    this.catalogService.getLivingForms()
      .subscribe(s => this.livingForms = s);
  }

  public onChangeCountry(event: any) {
    var countryId = event.target.value;
    this.getCities(countryId).subscribe();
  }

  public onChangeOrgType(event: any) {
    var id = event.target.value;
    var name = this.orgtypes.find(x => x.id == id)?.name;
    this.orgType = { id: id, name: name, filter: true } as FilterItem;
  }

  public onChangeStudyType(event: any) {
    var id = event.target.value;
    var name = this.studytypes.find(x => x.id == id)?.name;
    this.studyType = { id: id, name: name, filter: true } as FilterItem;
  }

  public onChangeProgram(event: any, programId: number, fieldName: string) {
    var value = event.target.value;
    var newProgram = this.programs.get(programId);

    switch (fieldName) {
      case "currency":
        value = this.currencies.find(x => x.currency = value);
        break;
      case "living":
        value = this.livingForms.find(x => x.id = value);
        break;
    }

    if (typeof newProgram != 'undefined' && newProgram) {
      newProgram[fieldName] = value;
      this.programs[programId] = newProgram;
    } else {
      newProgram = {} as NewProgram;
      newProgram[fieldName] = value;
      this.programs.set(programId, newProgram);
    }
  }

  public trackByFn(item: CountItem) {
    return item.id;
  }

  public createPage() {
    this.price()
      .pipe(
        mergeAll(),
        map(_ => {
          var p = {
            name: this.name,
            address: this.address,
            description: this.description,
            country: { id: 17, name: "Великобритания" } as Item,
            city: { id: 252, name: "Лондон" } as Item,
            location: { coordinates: [0, 0] } as Location,
            contacts: {
              email: this.email,
              tel: this.tel,
              site: this.site
            } as Contacts,
            orgtypes: [this.orgType],
            studytypes: [this.studyType],
            founded: this.founded,
            subjects: this.convertItemsToFilterItem(this.selectedSubjects),
            language: this.convertItemsToFilterItem(this.selectedLanguages),
            events: this.convertItemsToFilterItem(this.selectedEvents),
            programs: this.convertItemsToProgram(this.selectedProgramTypes),
            images: [],
            videos: [],
            base_url: ""
          } as Page;

          console.log(p);
          return p;
        }),
        switchMap(page => this.pageService.createPage(page)))
      .subscribe(res => this.router.navigate(['/pages/page', res]));
  }

  private loadEvents() {
    this.events$ = concat(
      this.catalogService.getEvents(), // default items
      this.eventInput$.pipe(
        distinctUntilChanged(),
        tap(() => this.eventsLoading = true),
        switchMap(term => this.catalogService.getEvents(term).pipe(
          catchError(() => of([])), // empty list on error
          tap(s => {
            this.eventsLoading = false;
            console.log(this.selectedEvents);
          })
        ))
      )
    );
  }

  private loadLanguages() {
    this.languages$ = concat(
      this.catalogService.getLanguages(), // default items
      this.languageInput$.pipe(
        distinctUntilChanged(),
        tap(() => this.languagesLoading = true),
        switchMap(term => this.catalogService.getLanguages(term).pipe(
          catchError(() => of([])), // empty list on error
          tap(s => {
            this.languagesLoading = false;
            console.log(this.selectedLanguages);
          })
        ))
      )
    );
  }

  private loadSubjects() {
    this.subjects$ = concat(
      this.catalogService.getSubjects(), // default items
      this.subjectInput$.pipe(
        distinctUntilChanged(),
        tap(() => this.subjectsLoading = true),
        switchMap(term => this.catalogService.getSubjects(term).pipe(
          catchError(() => of([])), // empty list on error
          tap(s => {
            this.subjectsLoading = false;
            console.log(this.selectedSubjects);
          })
        ))
      )
    );
  }

  private loadProgramTypes() {
    this.programTypes$ = concat(
      this.catalogService.getProgramTypes(), // default items
      this.programTypeInput$.pipe(
        distinctUntilChanged(),
        tap(() => this.programTypesLoading = true),
        switchMap(term => this.catalogService.getProgramTypes(term).pipe(
          catchError(() => of([])), // empty list on error
          tap(s => {
            this.programTypesLoading = false;
          })
        ))
      )
    );
  }

  private getCities(countryId: number) {
    return this.catalogService.getCities(countryId)
      .pipe(tap((c: Catalog<CountItem>[]) => {
        var items = c[0].items
        this.cities = items;
      }));
  }

  private convertItemsToFilterItem(arr: CountItem[]) {
    var nerArr: FilterItem[] = [];
    arr.forEach(e => nerArr.push({ id: e.id, name: e.name, filter: true } as FilterItem));
    return nerArr;
  }

  private convertItemsToProgram(arr: CountItem[]) {
    var nerArr: Program[] = [];
    arr.forEach(e => nerArr.push(this.createNewProgram(e)));
    return nerArr;
  }

  private createNewProgram(program: CountItem): Program {
    var newProgram = this.programs.get(program.id);
    var date = [{ startdate: newProgram?.dateFrom, enddate: newProgram?.dateTo } as Date];
    console.log(newProgram);

    return {
      id: program.id,
      name: program.name,
      price: newProgram.calcprice?.price,
      age: this.getAge(newProgram),
      date: date,
      living: newProgram?.living ?? this.livingForms[0],
      period: newProgram?.period
    } as Program;
  }

  private price() {
    return from(this.programs).pipe(map(x => this.calcPrice(+x[1].price, x[1].currency, x[0])));
  }

  private calcPrice(price: number, curr: Currency, programId: number): Observable<Price> {
    var currency: Currency = curr ?? this.currencies[0];
    var newProgram = this.programs.get(programId);
    return this.pageService.calcPrice(price, currency.original_currency, currency.currency)
      .pipe(tap(res => newProgram.calcprice = res));
  }

  private getAge(newProgram: NewProgram): number[] {
    if (newProgram?.ageFrom == null || newProgram?.ageTo == null)
      return [];
    return [newProgram?.ageFrom, newProgram?.ageTo];
  }
}
