import { Component } from '@angular/core';
import packageInfo from '../../package.json';
import {RouterModule} from '@angular/router';

import {HeaderComponent} from './header/header.component';
import {MenubarComponent} from './menubar/menubar.component';

@Component({
  selector: 'app-rock',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ],
  imports: [ HeaderComponent, MenubarComponent, RouterModule]
})
export class AppComponent  {
  name = 'Angular';
  
  ngOnInit() {
    console.log("Version:" + packageInfo.version);
  }
}
