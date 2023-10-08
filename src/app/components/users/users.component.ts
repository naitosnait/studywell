import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User } from 'app/models/user';
import { UserService } from './../../services/user.service';
import { Component } from '@angular/core';

@Component({
  selector: 'users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {

  public users: Observable<User[]>;
  public page = 1;
  public size = 10;
  public totalItems: number;

  public showPaging = false;
  constructor(private userService: UserService) {
    this.getUsers(this.page);
  }

  public getUsers(page: number) {
    this.users = this.userService.getUsers(page, this.size).pipe(
      tap(res => {
        this.showPaging = true;
        this.totalItems = res.c_users;
        // if(this.asyncIndex < 150){
        //   this.asyncIndex += 10; // increment index to show total changing
        // }
        this.page = page;
      }),
      map(res => res.users));
  }

  public banUser(userName: string, value: boolean){
    this.userService.userBan(userName, value).subscribe();
  }
}
