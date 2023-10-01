import { Currency, Date, NewProgram, ValidateProgram } from './../../models/page';
import { Component } from '@angular/core';
import { Contacts, Item, CountItem, Page, FilterItem, Program, Location, Catalog, Price } from '../../models/page';
import { CatalogService } from 'app/services/catalog.service';
import { catchError, distinctUntilChanged, map, mergeAll, switchMap, tap } from 'rxjs/operators';
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

  public studytypes: CountItem[] = [];
  public orgtypes: CountItem[] = [];

  public name: string = "";
  public description: string = "";
  public founded: string = "";
  public address: string = "";

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
  selectedProgramTypes: CountItem[] = [];

  currencies: Currency[];
  livingForms: CountItem[];

  public validateName: string;
  public validateDescription: string;
  public validateFounded: string;
  public validateAddress: string;

  public validateSite: string;
  public validateEmail: string;
  public validateTel: string;

  public validateEvents: string;
  public validateLanguages: string;
  public validateSubjects: string;
  public validateProgramTypes: string;

  private programs: Map<number, NewProgram> = new Map<number, NewProgram>();
  private validatePrograms: Map<number, ValidateProgram> = new Map<number, ValidateProgram>();

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

  public onChangeProgram(event: CountItem[]) {
    this.selectedProgramTypes = event;
  }

  public onChangeProgramParams(event: any, programId: number, fieldName: string) {
    var value = event.target.value;
    switch (fieldName) {
      case "currency":
        value = this.currencies.find(x => x.currency = value);
        break;
      case "living":
        value = this.livingForms.find(x => x.id = value);
        break;
    }

    var newProgram = this.programs.get(programId) ?? new NewProgram();
    newProgram[fieldName] = value;
    this.programs.set(programId, newProgram);
  }

  public trackByFn(item: CountItem) {
    return item.id;
  }

  public createPage() {
    if (!this.validate())
      return;

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

          return p;
        }),
        switchMap(page => this.pageService.createPage(page)))
      .subscribe(res => this.router.navigate(['/pages/page', res]));
  }

  public validateParam(programIs: number, paramName: string) {
    var vp = this.validatePrograms.get(programIs);
    return typeof vp != 'undefined' && vp ? vp[paramName] : "";
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
    arr.forEach((e, i) => nerArr.push(this.createNewProgram(e, i)));
    return nerArr;
  }

  private createNewProgram(program: CountItem, index: number): Program {
    var newProgram = this.programs.get(program.id);
    var date = [{ id: index, documents: newProgram?.documents, startdate: newProgram?.dateFrom, enddate: newProgram?.dateTo } as Date];

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

  private validate() {
    var valid: boolean[] = [];

    if (typeof this.name != 'undefined' && this.name) {
      this.validateName = "";
      valid.push(true);
    } else {
      this.validateName = "validate-error";
      valid.push(false);
    }

    if (typeof this.founded != 'undefined' && this.founded) {
      this.validateFounded = "";
      valid.push(true);
    } else {
      this.validateFounded = "validate-error";
      valid.push(false);
    }

    // if (typeof this.site != 'undefined' && this.site) {
    //   this.validateSite = "";
    //   valid.push(true);
    // } else {
    //   this.validateSite = "validate-error";
    //   valid.push(false);
    // }

    if (typeof this.email != 'undefined' && this.email) {
      this.validateEmail = "";
      valid.push(true);
    } else {
      this.validateEmail = "validate-error";
      valid.push(false);
    }

    // if (typeof this.tel != 'undefined' && this.tel) {
    //   this.validateTel = "";
    //   valid.push(true);
    // } else {
    //   this.validateTel = "validate-error";
    //   valid.push(false);
    // }

    if (typeof this.address != 'undefined' && this.address) {
      this.validateAddress = "";
      valid.push(true);
    } else {
      this.validateAddress = "validate-error";
      valid.push(false);
    }

    if (this.selectedEvents?.length > 0) {
      this.validateEvents = "";
      valid.push(true);
    } else {
      this.validateEvents = "validate-error";
      valid.push(false);
    }

    if (this.selectedLanguages?.length > 0) {
      this.validateLanguages = "";
      valid.push(true);
    } else {
      this.validateLanguages = "validate-error";
      valid.push(false);
    }

    if (this.selectedSubjects?.length > 0) {
      this.validateSubjects = "";
      valid.push(true);
    } else {
      this.validateSubjects = "validate-error";
      valid.push(false);
    }

    if (this.selectedProgramTypes?.length > 0) {
      this.validateProgramTypes = "";
      valid.push(this.validateProgramParams());
    } else {
      this.validateProgramTypes = "validate-error";
      valid.push(false);
    }

    return valid.reduce((sum, next) => sum && next, true);
  }

  private validateProgramParams() {
    var valid: boolean[] = [];

    if (this.programs.size <= 0) {
      this.selectedProgramTypes.forEach(x => {
        this.validatePrograms.set(x.id, {
          ageFrom: "validate-error",
          ageTo: "validate-error",
          dateFrom: "validate-error",
          dateTo: "validate-error",
          documents: "validate-error",
          period: "validate-error",
          price: "validate-error"
        } as ValidateProgram);
      });
      valid.push(false);
    }    else {
      this.programs.forEach((x, y) => {
        var vp = this.validatePrograms.get(y) ?? new ValidateProgram();

        if (typeof x?.ageFrom != 'undefined' && x?.ageFrom) {
          this.addValid(vp, y, "ageFrom", "");
          valid.push(true);
        } else {
          this.addValid(vp, y, "ageFrom", "validate-error");
          valid.push(false);
        }

        if (typeof x?.ageTo != 'undefined' && x?.ageTo) {
          this.addValid(vp, y, "ageTo", "");
          valid.push(true);
        } else {
          this.addValid(vp, y, "ageTo", "validate-error");
          valid.push(false);
        }

        if (typeof x?.dateFrom != 'undefined' && x?.dateFrom) {
          this.addValid(vp, y, "dateFrom", "");
          valid.push(true);
        } else {
          this.addValid(vp, y, "dateFrom", "validate-error");
          valid.push(false);
        }

        if (typeof x?.dateTo != 'undefined' && x?.dateTo) {
          this.addValid(vp, y, "dateTo", "");
          valid.push(true);
        } else {
          this.addValid(vp, y, "dateTo", "validate-error");
          valid.push(false);
        }

        if (typeof x?.price != 'undefined' && x?.price) {
          this.addValid(vp, y, "price", "");
          valid.push(true);
        } else {
          this.addValid(vp, y, "price", "validate-error");
          valid.push(false);
        }

        if (typeof x?.documents != 'undefined' && x?.documents) {
          this.addValid(vp, y, "documents", "");
          valid.push(true);
        } else {
          this.addValid(vp, y, "documents", "validate-error");
          valid.push(false);
        }

        if (typeof x?.period != 'undefined' && x?.period) {
          this.addValid(vp, y, "period", "");
          valid.push(true);
        } else {
          this.addValid(vp, y, "period", "validate-error");
          valid.push(false);
        }
      });
    }

    return valid.reduce((sum, next) => sum && next, true);
  }

  private addValid(validateProgram: ValidateProgram, programId: number, fieldName: string, value: string) {
    validateProgram[fieldName] = value;
    this.validatePrograms.set(programId, validateProgram);
  }
}
