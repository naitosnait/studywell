import { Component, OnInit } from '@angular/core';

declare var $:any;

declare interface TableData {
    headerRow: string[];
    dataRows: string[][];
}

@Component({
    selector: 'users',
    templateUrl: 'users.component.html'
})

export class UsersComponent implements OnInit{
    public tableData1: TableData;

    state_plain: boolean = true;

    ngOnInit(){

        this.tableData1 = {
            headerRow: [ '#', 'Name', 'Job Position', 'Since', 'Salary', 'Actions'],
            dataRows: [
                ['1', 'Andrew Mike', 'Develop', '2013', '99,225',''],
                ['2', 'John Doe', 'Design', '2012', '89,241', ''],
                ['3', 'Alex Mike', 'Design', '2010', '92,144', ''],
                ['4','Mike Monday', 'Marketing', '2013', '49,990', ''],
                ['5', 'Paul Dickens', 'Communication', '2015', '69,201', '']
            ]
        };
    }

    ngAfterViewInit(){
    }
}
