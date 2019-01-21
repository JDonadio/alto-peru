import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../services/auth.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public user: any;
  public events: any;
  public loading: boolean;
  public showForm: boolean;
  public form: any;
  public readyFor: any;
  public confirmed: number;

  constructor(
    private db: AngularFireDatabase,
    private auth: AuthService
  ) {
    this.user = null;
    this.events = null;
    this.loading = false;
    this.showForm = false;
    this.readyFor = {};
    this.confirmed = 0;
    this.form = {
      title: '',
      time: '',
      isMandatory: false,
    };
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.db.object('users/' + this.user.nickname).valueChanges().subscribe((user: any) => {
      if (user && user.role == 'admin') this.user.role = 'admin';
    });
    this.loading = true;
    this.db.list('events').snapshotChanges().subscribe(events => {
      this.events = _.map(events, e => {
        let key = e.key;
        let data = e.payload.val();
        let result: any = Object.assign({key}, data);
        let userKeys = _.keys(result.users);
        let userValues = _.values(result.users);
        result.userList = _.map(userKeys, (k,i) => { return Object.assign(userValues[i]) });
        console.log(_.map(result.userList, u => { return u.ready == true }))
        result.confirmed = _.compact(_.map(result.userList, 'ready')).length;
        return result;
      });
      this.loading = false;
      console.log(this.events);
    }, error => {
      this.loading = false;
      console.log(error);
    });
  }

  apply(event) {
    var ref = this.db.object(`events/${event.key}/users`);
    var key = this.user.nickname;
    ref.update({ [key]: Object.assign(this.user, { ready: true }) });
    this.readyFor[event.key] = true;
  }

  undo(event) {
    var ref = this.db.object(`events/${event.key}/users`);
    var key = this.user.nickname;
    ref.update({ [key]: Object.assign(this.user, { ready: false }) });
    delete this.readyFor[event.key];
  }

  logout() {
    this.auth.logout();
  }

  createEvent() {
    console.log(this.form);
    let ref = this.db.list('events');
    ref.push(this.form);
    this.showForm = false;
  }
}
