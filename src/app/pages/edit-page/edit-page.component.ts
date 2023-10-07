import { Component } from '@angular/core';
import { Contacts, Item, CountItem, Page, FilterItem, Program, Location, Catalog, Price } from '../../models/page';
import { Observable, Subject, concat, from, of } from 'rxjs';
import { CatalogService } from 'app/services/catalog.service';
import { PageService } from '../../services/page.service';
import { catchError, distinctUntilChanged, switchMap, tap, map, mergeAll } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { isNullOrUndefined } from 'app/utils/utils';
import { Currency, Date, NewProgram, ValidateDate, ValidateProgram } from './../../models/page';
import { emailExpression } from 'app/utils/consts';

@Component({
  selector: 'edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.css']
})
export class EditPageComponent {
  private addedPrograms: Map<number, NewProgram> = new Map<number, NewProgram>();
  private validatePrograms: Map<number, ValidateProgram> = new Map<number, ValidateProgram>();

  public studyType: FilterItem;

  public countries: CountItem[] = [];
  public cities: CountItem[] = [];

  public studytypes: FilterItem[] = [];

  public name: string = "";
  public description: string = "";
  public founded: string = "";
  public address: string = "";

  public site: string = "";
  public email: string = "";
  public tel: string = "";

  public events$: Observable<CountItem[]>;
  public eventsLoading = false;
  public eventInput$ = new Subject<string>();
  public selectedEvents: CountItem[] = <any>[];

  public languages$: Observable<CountItem[]>;
  public languagesLoading = false;
  public languageInput$ = new Subject<string>();
  public selectedLanguages: CountItem[] = <any>[];

  public subjects$: Observable<CountItem[]>;
  public subjectsLoading = false;
  public subjectInput$ = new Subject<string>();
  public selectedSubjects: CountItem[] = <any>[];

  public programTypes$: Observable<CountItem[]>;
  public programTypesLoading = false;
  public programTypeInput$ = new Subject<string>();
  public selectedProgramTypes: CountItem[] = [];

  public orgTypes$: Observable<CountItem[]>;
  public orgTypesLoading = false;
  public orgTypeInput$ = new Subject<string>();
  public selectedOrgTypes: CountItem[] = [];

  public currencies: Currency[];
  public livingForms: CountItem[];

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
  public validateOrgTypes: string;

  public validateMessages: string[] = [];

  public page: Page;

  constructor(private catalogService: CatalogService, private route: ActivatedRoute, private router: Router, private pageService: PageService) {
    this.route.params
      .pipe(switchMap(params => this.pageService.getPageById(params['id'])))
      .subscribe((page: Page) => {
        this.page = page;
        this.name = page.name;
        this.founded = page.founded;
        this.address = page.address;
        this.email = page.contacts?.email;
        this.tel = page.contacts?.tel;
        this.site = page.contacts.site;
        this.selectedEvents = this.convertFilterItemsToCountItems(page.events);
        this.selectedLanguages = this.convertFilterItemsToCountItems(page.language);
        this.selectedSubjects = this.convertFilterItemsToCountItems(page.subjects);
        this.selectedProgramTypes = this.convertProgramsToCountItems(page.programs);
        this.selectedOrgTypes = this.convertFilterItemsToCountItems(page.orgtypes);
        this.fillProgramParams();
      });

    this.catalogService.getStudyTypes()
      .subscribe((c: Catalog<CountItem>[]) => {
        var items = c[0].items
        this.studytypes = this.convertCountItemsToFilterItems(items);
      });

    this.loadEvents();
    this.loadLanguages();
    this.loadSubjects();
    this.loadProgramTypes();
    this.loadOrgTypes();

    this.catalogService.getCurrencies()
      .subscribe(s => this.currencies = s);

    this.catalogService.getLivingForms()
      .subscribe(s => this.livingForms = s);
  }

  public onChangeCountry(event: any) {
    var countryId = event.target.value;
    this.getCities(countryId).subscribe();
  }

  public onChangeOrgType(event: CountItem[]) {
    if (event.map(x => x.id).includes(1004))
      this.studyType = this.studytypes[0];
    else
      this.studyType = null;
  }

  public onChangeStudyType(event: any) {
    var id = event.target.value;
    this.studyType = this.studytypes?.find(x => x.id == id);
  }

  public onChangeProgram(event: CountItem[]) {
    this.selectedProgramTypes = event;

    if (this.selectedProgramTypes.length < this.addedPrograms.size) {
      var addedProgramIds = Array.from(this.addedPrograms.keys());
      var unselectedProgramIds = addedProgramIds.filter(s => !this.selectedProgramTypes.map(x => x.id)?.find(x => x == s));
      unselectedProgramIds.forEach(x => {
        this.addedPrograms.delete(x);
        this.validatePrograms.delete(x);
      });
    }

    this.selectedProgramTypes.forEach(x => {
      var addedProgram = this.addedPrograms.get(x.id);
      if (isNullOrUndefined(addedProgram)) {
        this.addedPrograms.set(x.id, new NewProgram());
      }
    });
  }

  public onChangeProgramParams(event: any, programId: number, fieldName: string) {
    var value = event.target.value;
    var addedProgram = this.addedPrograms.get(programId);

    switch (fieldName) {
      case "currency":
        value = this.currencies?.find(x => x.currency == value);
        break;
      case "living":
        value = this.livingForms?.find(x => x.id == value);
        break;
    }

    addedProgram[fieldName] = value;
    this.addedPrograms.set(programId, addedProgram);
  }

  public onChangeProgramDateParams(event: any, programId: number, fieldName: string, index: number) {
    var value = event.target.value;
    var addedProgram = this.addedPrograms.get(programId)
    var date = addedProgram.date[index];
    if (isNullOrUndefined(date.id))
      date.id = index + 1;
    date[fieldName] = value;
    addedProgram.date[index] = date;
    this.addedPrograms.set(programId, addedProgram);
  }

  public trackByFn(item: CountItem) {
    return item.id;
  }

  public editPage() {
    if (!this.validate()) {
      this.validateMessages.push("Please, fill in all required fields");
      return;
    } else {
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
              orgtypes: this.convertCountItemsToFilterItems(this.selectedOrgTypes),
              studytypes: isNullOrUndefined(this.studyType) ? [] : [this.studyType],
              founded: this.founded,
              subjects: this.convertCountItemsToFilterItems(this.selectedSubjects),
              language: this.convertCountItemsToFilterItems(this.selectedLanguages),
              events: this.convertCountItemsToFilterItems(this.selectedEvents),
              programs: this.getPrograms(),
              images: [],
              videos: [],
              base_url: ""
            } as Page;

            return p;
          }),
          tap(s => console.log(s)),
          switchMap(page => this.pageService.createPage(page)))
        .subscribe(res => this.router.navigate(['/pages/page', res]));
    }
  }

  public validateParam(programIs: number, paramName: string) {
    var vp = this.validatePrograms.get(programIs);
    return typeof vp != 'undefined' && vp ? vp[paramName] : "";
  }

  public validateDateParam(programId: number, paramName: string, index: number) {
    var vp = this.validatePrograms.get(programId);
    var date = vp?.date[index];
    return typeof date != 'undefined' && date ? date[paramName] : "";
  }

  public getDates(programId: number): Date[] {
    return this.addedPrograms.get(programId)?.date;
  }

  public getProgramParam(programId: number, fieldName: string) {
    var program = this.addedPrograms.get(programId);
    return program[fieldName];
  }

  public addDates(programId: number) {
    this.getDates(programId).push({} as Date);
  }

  public removeDates(programId: number, index: number) {
    this.getDates(programId).splice(index, 1);
  }

  public getValidationMessages(programId: number) {
    var vp = this.validatePrograms.get(programId);
    return vp?.messages;
  }

  public removeValidationMessages(programId: number, index: number) {
    var vp = this.validatePrograms.get(programId);
    vp?.messages.splice(index, 1);
  }

  public hideAddButtons(programId: number, index: number) {
    var date = this.getDates(programId);
    if (date.length > 1 && index + 1 != date.length) {
      return "none";
    }
    return "";
  }

  public hideRemoveButtons(programId: number, index: number) {
    var date = this.getDates(programId);
    if (date.length == 1 || index + 1 == date.length) {
      return "none";
    }
    return "";
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

  private loadOrgTypes() {
    this.orgTypes$ = concat(
      this.catalogService.getOrgTypes(), // default items
      this.orgTypeInput$.pipe(
        distinctUntilChanged(),
        tap(() => this.orgTypesLoading = true),
        switchMap(term => this.orgTypes$.pipe(
          catchError(() => of([])), // empty list on error
          map((orgTypes: CountItem[]) => orgTypes.filter(x => x.name.includes(term))),
          tap(s => {
            this.orgTypesLoading = false;
          })
        ))
      )
    );
  }

  private getCities(countryId: number): Observable<Catalog<CountItem>[]> {
    return this.catalogService.getCities(countryId)
      .pipe(tap((c: Catalog<CountItem>[]) => {
        var items = c[0].items
        this.cities = items;
      }));
  }

  private convertCountItemsToFilterItems(arr: CountItem[]): FilterItem[] {
    var newArr: FilterItem[] = [];
    arr.forEach(e => newArr.push({ id: e.id, name: e.name, filter: true } as FilterItem));
    return newArr;
  }

  private convertFilterItemsToCountItems(arr: FilterItem[]) {
    var newArr: CountItem[] = [];
    arr.forEach(e => newArr.push({ id: e.id, name: e.name } as CountItem));
    return newArr;
  }

  private convertProgramsToCountItems(arr: Program[]) {
    var newArr: CountItem[] = [];
    arr.forEach(e => newArr.push({ id: e.id, name: e?.name } as CountItem));
    console.log(newArr)
    return newArr;
  }

  private getPrograms(): Program[] {
    var newArr: Program[] = [];
    this.selectedProgramTypes.forEach(e => newArr.push(this.createProgram(e)));
    return newArr;
  }

  private createProgram(program: CountItem): Program {
    var addedProgram = this.addedPrograms.get(program.id);

    var date = [...addedProgram?.date];
    date.forEach(x => {
      x.documents = x.documents + "T00:00:00.036";
      x.enddate = x.enddate + "T00:00:00.036";
      x.startdate = x.startdate + "T00:00:00.036";
    });

    return {
      id: program.id,
      name: program.name,
      price: addedProgram?.calcprice?.price,
      age: this.getAge(addedProgram),
      date: date,
      living: addedProgram?.living ?? this.livingForms[0],
      period: addedProgram?.period,
      admission: addedProgram?.admission
    } as Program;
  }

  private price(): Observable<Observable<Price>> {
    return from(this.addedPrograms).pipe(map(x => this.calcPrice(+x[1].price, x[1].currency, x[0])));
  }

  private calcPrice(price: number, curr: Currency, programId: number): Observable<Price> {
    var currency: Currency = curr ?? this.currencies[0];
    var addedProgram = this.addedPrograms.get(programId);
    return this.pageService.calcPrice(price, currency.original_currency, currency.currency)
      .pipe(tap(res => addedProgram.calcprice = res));
  }

  private getAge(addedProgram: NewProgram): number[] {
    if (addedProgram?.ageFrom == null || addedProgram?.ageTo == null)
      return [];
    return [addedProgram?.ageFrom, addedProgram?.ageTo];
  }

  private validate(): boolean {
    var valid: boolean[] = [];
    this.validateMessages = [];

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
      if (!emailExpression.test(this.email)) {
        this.validateMessages.unshift("Wrong email format (mail@mail.com)");
      }
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

    if (this.selectedOrgTypes?.length > 0) {
      this.validateOrgTypes = "";
      valid.push(true);
    } else {
      this.validateOrgTypes = "validate-error";
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

  private validateProgramParams(): boolean {
    var valid: boolean[] = [];

    this.addedPrograms.forEach((np, programId) => {
      var vp = this.validatePrograms.get(programId) ?? new ValidateProgram();
      vp.messages = [];

      if (typeof np?.ageFrom != 'undefined' && np?.ageFrom) {
        if (np?.ageTo < np?.ageFrom) {
          vp.messages.push("Age from cannot be greater than age to");
          valid.push(false);
          this.addValid(vp, programId, "ageFrom", "validate-error");
        } else {
          this.addValid(vp, programId, "ageFrom", "");
          valid.push(true);
        }
      } else {
        this.addValid(vp, programId, "ageFrom", "validate-error");
        valid.push(false);
      }

      if (typeof np?.ageTo != 'undefined' && np?.ageTo) {
        this.addValid(vp, programId, "ageTo", "");
        valid.push(true);
      } else {
        this.addValid(vp, programId, "ageTo", "validate-error");
        valid.push(false);
      }

      if (typeof np?.price != 'undefined' && np?.price) {
        this.addValid(vp, programId, "price", "");
        valid.push(true);
      } else {
        this.addValid(vp, programId, "price", "validate-error");
        valid.push(false);
      }

      if (typeof np?.period != 'undefined' && np?.period) {
        this.addValid(vp, programId, "period", "");
        valid.push(true);
      } else {
        this.addValid(vp, programId, "period", "validate-error");
        valid.push(false);
      }

      if (typeof np?.admission != 'undefined' && np?.admission) {
        this.addValid(vp, programId, "admission", "");
        valid.push(true);
      } else {
        this.addValid(vp, programId, "admission", "validate-error");
        valid.push(false);
      }

      valid.push(this.validateDate(np, vp));
    });

    return valid.reduce((sum, next) => sum && next, true);
  }

  private validateDate(np: NewProgram, vp: ValidateProgram): boolean {
    var valid: boolean[] = [];

    np.date.forEach((x, i) => {
      var date = vp.date[i] ?? new ValidateDate();
      if (typeof x?.startdate != 'undefined' && x?.startdate) {
        date["startdate"] = "";
        valid.push(true);
      } else {
        date["startdate"] = "validate-error";
        valid.push(false);
      }

      if (typeof x?.enddate != 'undefined' && x?.enddate) {
        if (x?.enddate < x?.startdate) {
          vp.messages.push("Date to cannot be less than date from");
          valid.push(false);
          date["enddate"] = "validate-error";
        } else {
          date["enddate"] = "";
          valid.push(true);
        }
      } else {
        date["enddate"] = "validate-error";
        valid.push(false);
      }

      if (typeof x?.documents != 'undefined' && x?.documents) {
        if (x?.documents > x?.startdate) {
          vp.messages.push("Documents date cannot be greater than date from");
          valid.push(false);
          date["documents"] = "validate-error";
        } else {
          date["documents"] = "";
        }
        valid.push(true);
      } else {
        date["documents"] = "validate-error";
        valid.push(false);
      }

      vp.date[i] = date;
    });

    return valid.reduce((sum, next) => sum && next, true);
  }

  private addValid(validateProgram: ValidateProgram, programId: number, fieldName: string, value: string) {
    validateProgram[fieldName] = value;
    this.validatePrograms.set(programId, validateProgram);
  }

  private fillProgramParams() {
    this.page.programs.forEach(x => {

      var date = [...x?.date];
      date.forEach(x => {
        x.documents = x.documents.slice(0, 10);
        x.enddate = x.enddate.slice(0, 10);
        x.startdate = x.startdate.slice(0, 10);
      });

      this.addedPrograms.set(x.id, {
        date: date,
        ageFrom: x.age[0],
        ageTo: x.age[1],
        price: x.price?.original_price,
        currency: this.currencies?.find(s => s.currency == x.price?.currency),
        living: x.living,
        period: x.period,
        admission: x.admission
      } as NewProgram);
    });
  }
}
