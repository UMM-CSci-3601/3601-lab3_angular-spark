import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Observable} from 'rxjs';
import { of } from 'rxjs';
import {FormsModule} from '@angular/forms';


import {User} from './user';
import {UserListComponent} from './user-list.component';
import {UserService} from './user.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { RouterTestingModule } from '@angular/router/testing';
import { MatRadioButton } from '@angular/material/radio';

const COMMON_IMPORTS: any[] = [
  FormsModule,
  MatCardModule,
  MatFormFieldModule,
  MatSelectModule,
  MatOptionModule,
  MatButtonModule,
  MatInputModule,
  MatExpansionModule,
  MatTooltipModule,
  MatListModule,
  MatDividerModule,
  MatRadioButton,
  BrowserAnimationsModule,
  RouterTestingModule,
];

describe('User list', () => {

  let userList: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;

  let userServiceStub: {
    getUsers: () => Observable<User[]>
  };

  beforeEach(() => {
    // stub UserService for test purposes
    userServiceStub = {
      getUsers: () => of([
        {
          _id: 'chris_id',
          name: 'Chris',
          age: 25,
          company: 'UMM',
          email: 'chris@this.that',
          role: "admin",
          avatar: 'https://gravatar.com/avatar/8c9616d6cc5de638ea6920fb5d65fc6c?d=identicon'
        },
        {
          _id: 'pat_id',
          name: 'Pat',
          age: 37,
          company: 'IBM',
          email: 'pat@something.com',
          role: "editor",
          avatar: 'https://gravatar.com/avatar/b42a11826c3bde672bce7e06ad729d44?d=identicon'
        },
        {
          _id: 'jamie_id',
          name: 'Jamie',
          age: 37,
          company: 'Frogs, Inc.',
          email: 'jamie@frogs.com',
          role: "viewer",
          avatar: 'https://gravatar.com/avatar/d4a6c71dd9470ad4cf58f78c100258bf?d=identicon'
        }
      ])
    };

    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [UserListComponent],
      // providers:    [ UserService ]  // NO! Don't provide the real service!
      // Provide a test-double instead
      providers: [{provide: UserService, useValue: userServiceStub}]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(UserListComponent);
      userList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('contains all the users', () => {
    expect(userList.serverFilteredUsers.length).toBe(3);
  });

  it('contains a user named \'Chris\'', () => {
    expect(userList.serverFilteredUsers.some((user: User) => user.name === 'Chris')).toBe(true);
  });

  it('contain a user named \'Jamie\'', () => {
    expect(userList.serverFilteredUsers.some((user: User) => user.name === 'Jamie')).toBe(true);
  });

  it('doesn\'t contain a user named \'Santa\'', () => {
    expect(userList.serverFilteredUsers.some((user: User) => user.name === 'Santa')).toBe(false);
  });

  it('has two users that are 37 years old', () => {
    expect(userList.serverFilteredUsers.filter((user: User) => user.age === 37).length).toBe(2);
  });
});

describe('Misbehaving User List', () => {
  let userList: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;

  let userServiceStub: {
    getUsers: () => Observable<User[]>
  };

  beforeEach(() => {
    // stub UserService for test purposes
    userServiceStub = {
      getUsers: () => Observable.create(observer => {
        observer.error('Error-prone observable');
      })
    };

    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [UserListComponent],
      // providers:    [ UserService ]  // NO! Don't provide the real service!
      // Provide a test-double instead
      providers: [{provide: UserService, useValue: userServiceStub}]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(UserListComponent);
      userList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('generates an error if we don\'t set up a UserListService', () => {
    // Since the observer throws an error, we don't expect users to be defined.
    expect(userList.serverFilteredUsers).toBeUndefined();
  });
});
