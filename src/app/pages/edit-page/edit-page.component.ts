import { Component } from '@angular/core';
import { Contacts, Item, CountItem, Page, FilterItem, Program, Location, Catalog, Price } from '../../models/page';
import { Observable, Subject, concat, from, of } from 'rxjs';
import { CatalogService } from 'app/services/catalog.service';
import { PageService } from '../../services/page.service';
import { catchError, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
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
    private newPrograms: Map<number, NewProgram> = new Map<number, NewProgram>();
    private validatePrograms: Map<number, ValidateProgram> = new Map<number, ValidateProgram>();

    private orgType: FilterItem;
    public studyType: FilterItem;

    public countries: CountItem[] = [];
    public cities: CountItem[] = [];

    public studytypes: FilterItem[] = [];
    public orgtypes: FilterItem[] = [];

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

    public validateMessages: string[];

    public page: Page;

    constructor(private catalogService: CatalogService, private route: ActivatedRoute, private router: Router, private pageService: PageService) {
        this.route.params
            .pipe(switchMap(params => this.pageService.getPageById(params['id'])))
            .subscribe((res: Page) => {
                this.page = res;
                this.selectedEvents = this.convertFilterItemsToCountItems(res.events);
                this.selectedLanguages = this.convertFilterItemsToCountItems(res.language);
                this.selectedSubjects = this.convertFilterItemsToCountItems(res.subjects);
                this.selectedProgramTypes = this.convertProgramsToCountItems(res.programs);
                this.fillProgramParams();
            });

        this.catalogService.getOrgTypes()
            .subscribe((c: Catalog<CountItem>[]) => {
                var items = c[0].items
                this.orgtypes = this.convertCountItemsToFilterItems(items);
                // this.orgType = this.page.orgtypes;
            });

        this.catalogService.getStudyTypes()
            .subscribe((c: Catalog<CountItem>[]) => {
                var items = c[0].items
                this.studytypes = this.convertCountItemsToFilterItems(items);
                // this.studyType = this.page
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
        if (id != 1004)
            this.studyType = null;
        else
            this.studyType = this.studytypes[0];

        this.orgType = this.orgtypes.find(x => x.id == id);
    }

    public onChangeStudyType(event: any) {
        var id = event.target.value;
        this.studyType = this.studytypes.find(x => x.id == id);
    }

    public onChangeProgram(event: CountItem[]) {
        this.selectedProgramTypes = event;

        if (this.selectedProgramTypes.length < this.newPrograms.size) {
            var newProgramIds = Array.from(this.newPrograms.keys());
            var unselectedProgramIds = newProgramIds.filter(s => !this.selectedProgramTypes.map(x => x.id).find(x => x == s));
            unselectedProgramIds.forEach(x => {
                this.newPrograms.delete(x);
                this.validatePrograms.delete(x);
            });
        }

        this.selectedProgramTypes.forEach(x => {
            var newProgram = this.newPrograms.get(x.id);
            if (isNullOrUndefined(newProgram)) {
                this.newPrograms.set(x.id, new NewProgram());
            }
        });
    }

    public onChangeProgramParams(event: any, programId: number, fieldName: string) {
        var value = event.target.value;
        var newProgram = this.newPrograms.get(programId);

        switch (fieldName) {
            case "currency":
                value = this.currencies.find(x => x.currency = value);
                break;
            case "living":
                value = this.livingForms.find(x => x.id = value);
                break;
        }

        newProgram[fieldName] = value;
        this.newPrograms.set(programId, newProgram);
    }

    public onChangeProgramDateParams(event: any, programId: number, fieldName: string, index: number) {
        var value = event.target.value;
        var newProgram = this.newPrograms.get(programId)
        var date = newProgram.date[index];
        if (isNullOrUndefined(date.id))
            date.id = index + 1;
        date[fieldName] = value + "T00:00:00.036";
        newProgram.date[index] = date;
        this.newPrograms.set(programId, newProgram);
    }

    public trackByFn(item: CountItem) {
        return item.id;
    }

    public editPage() {
        this.pageService.editPage({
            id: this.page.id,
            name: this.page.name,
            address: this.page.address,
            description: this.page.description,
            country: { id: 17, name: "Великобритания" } as Item,
            city: { id: 252, name: "Лондон" } as Item,
            location: { coordinates: [0, 0] } as Location,
            contacts: {
                email: this.page.contacts.email,
                tel: this.page.contacts.tel,
                site: this.page.contacts.site
            } as Contacts,
            orgtypes: [this.orgType],
            studytypes: [this.studyType],
            founded: this.page.founded,
            subjects: this.convertCountItemsToFilterItems(this.selectedSubjects),
            language: this.convertCountItemsToFilterItems(this.selectedLanguages),
            events: this.convertCountItemsToFilterItems(this.selectedEvents),
            programs: this.getProgram(this.selectedProgramTypes),
            images: [],
            videos: [],
            base_url: ""
        } as Page).subscribe(res => this.router.navigate(['/pages/page', res]));
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
        return this.newPrograms.get(programId).date;
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

    private getCities(countryId: number): Observable<Catalog<CountItem>[]> {
        return this.catalogService.getCities(countryId)
            .pipe(tap((c: Catalog<CountItem>[]) => {
                var items = c[0].items
                this.cities = items;
            }));
    }

    private convertCountItemsToFilterItems(arr: CountItem[]): FilterItem[] {
        var nerArr: FilterItem[] = [];
        arr.forEach(e => nerArr.push({ id: e.id, name: e.name, filter: true } as FilterItem));
        return nerArr;
    }

    private convertFilterItemsToCountItems(arr: FilterItem[]) {
        var nerArr: CountItem[] = [];
        arr.forEach(e => nerArr.push({ id: e.id, name: e.name } as CountItem));
        return nerArr;
    }

    private convertProgramsToCountItems(arr: Program[]) {
        var nerArr: CountItem[] = [];
        arr.forEach(e => nerArr.push({ id: e.id, name: e.name } as CountItem));
        return nerArr;
    }

    private getPrograms(): Program[] {
        var nerArr: Program[] = [];
        this.selectedProgramTypes.forEach(e => nerArr.push(this.createNewProgram(e)));
        return nerArr;
    }

    private createNewProgram(program: CountItem): Program {
        var newProgram = this.newPrograms.get(program.id);

        return {
            id: program.id,
            name: program.name,
            price: newProgram.calcprice?.price,
            age: this.getAge(newProgram),
            date: newProgram.date,
            living: newProgram?.living ?? this.livingForms[0],
            period: newProgram?.period
        } as Program;
    }

    private price(): Observable<Observable<Price>> {
        return from(this.newPrograms).pipe(map(x => this.calcPrice(+x[1].price, x[1].currency, x[0])));
    }

    private calcPrice(price: number, curr: Currency, programId: number): Observable<Price> {
        var currency: Currency = curr ?? this.currencies[0];
        var newProgram = this.newPrograms.get(programId);
        return this.pageService.calcPrice(price, currency.original_currency, currency.currency)
            .pipe(tap(res => newProgram.calcprice = res));
    }

    private getAge(newProgram: NewProgram): number[] {
        if (newProgram?.ageFrom == null || newProgram?.ageTo == null)
            return [];
        return [newProgram?.ageFrom, newProgram?.ageTo];
    }

    private validate(): boolean {
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

        var expressionRes = emailExpression.test(this.email);
        if (typeof this.email != 'undefined' && this.email
            && expressionRes) {
            this.validateEmail = "";
            valid.push(true);
        } else {
            this.validateMessages.push("Wrong email format (format could be mail@mail.com)");
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

    private validateProgramParams(): boolean {
        var valid: boolean[] = [];

        this.newPrograms.forEach((np, programId) => {
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

            this.validateDate(np, vp);
        });

        return valid.reduce((sum, next) => sum && next, true);
    }

    private validateDate(np: NewProgram, vp: ValidateProgram): boolean {
        var valid: boolean[] = [];

        np.date.forEach((x, i) => {
            var date = vp.date[i] ?? new ValidateDate();
            if (typeof x?.startdate != 'undefined' && x?.startdate) {
                if (x?.enddate < x?.startdate) {
                    vp.messages.push("Date to cannot be less than date from");
                    valid.push(false);
                    date["startdate"] = "validate-error";
                } else {
                    date["startdate"] = "";
                    valid.push(true);
                }
            } else {
                date["startdate"] = "validate-error";
                valid.push(false);
            }

            if (typeof x?.enddate != 'undefined' && x?.enddate) {
                date["enddate"] = "";
                valid.push(true);
            } else {
                date["enddate"] = "validate-error";
                valid.push(false);
            }

            if (typeof x?.documents != 'undefined' && x?.documents) {
                if (x?.enddate < x?.startdate) {
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
            this.newPrograms.set(x.id, {
                date: x.date,
                ageFrom: x.age[0],
                ageTo: x.age[1],
                price: x.price?.original_price,
                currency: this.currencies.find(s => s.currency == x.price?.currency),
                living: x.living,
                period: x.period
            } as NewProgram);
        });
    }
}
