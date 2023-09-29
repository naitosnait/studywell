import { Component } from '@angular/core';
import { Contacts, Catalog, FilterItem, Item, CountItem, Location, Page, Program } from '../../models/page';
import { Observable, Subject, concat, of } from 'rxjs';
import { CatalogService } from 'app/services/catalog.service';
import { PageService } from '../../services/page.service';
import { catchError, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'edit-page',
    templateUrl: './edit-page.component.html',
    styleUrls: ['./edit-page.component.css']
})
export class EditPageComponent {
    private orgType: any;
    private studyType: any;

    public countries: CountItem[] = [];
    public cities: CountItem[] = [];

    public studytypes: CountItem[] = [];
    public orgtypes: CountItem[] = [];

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

    public page: Page;

    constructor(private catalogService: CatalogService, private route: ActivatedRoute,private router: Router, private pageService: PageService) {
        this.route.params
            .pipe(switchMap(params => this.pageService.getPageById(params['id'])))
            .subscribe(res => {
                this.page = res;
                this.selectedEvents = this.convertFilterItemToItems(res.events);
                this.selectedLanguages = this.convertFilterItemToItems(res.language);
                this.selectedSubjects = this.convertFilterItemToItems(res.subjects);
            });

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
            subjects: this.convertItemsToFilterItem(this.selectedSubjects),
            language: this.convertItemsToFilterItem(this.selectedLanguages),
            events: this.convertItemsToFilterItem(this.selectedEvents),
            programs: this.convertItemsToProgram(this.selectedProgramTypes),
            images: [],
            videos: [],
            base_url: ""
        } as Page).subscribe(res => this.router.navigate(['/pages/page', res]));
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
                        console.log(this.selectedProgramTypes);
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

    private convertFilterItemToItems(arr: FilterItem[]) {
        var nerArr: CountItem[] = [];
        arr.forEach(e => nerArr.push({ id: e.id, name: e.name } as CountItem));
        return nerArr;
    }

    private convertItemsToProgram(arr: CountItem[]) {
        var nerArr: Program[] = [];
        arr.forEach(e => nerArr.push({ id: e.id } as Program));
        return nerArr;
    }
}
