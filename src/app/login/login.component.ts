import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public nickname: string;
  public form: any;
  public positionList: string[];
  public selectedPosition: string;

  constructor(
    private auth: AuthService
  ) {
    this.positionList = ['PO','LI','DFI','DFC','DFD','LD','MCD','MC','MI','MD','MCO','EI','ED','DC'];
    this.selectedPosition = this.positionList[0];
    this.form = {
      nickname: '',
      position: this.selectedPosition,
      number: 1,
    }
  }

  ngOnInit() {
    let user: any = JSON.parse(localStorage.getItem('user'));
    console.log(user)
    if (user == null) return;

    this.form.nickname = user.nickname;
    this.selectedPosition = user.position;
    this.form.number = user.number;
  }

  login() {
    if (!this.form.nickname || this.form.nickname == '' || !this.form.number) return;

    this.form.position = this.selectedPosition;
    this.auth.login(this.form);
  }
}
