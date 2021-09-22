import { Component } from '@angular/core';
import packageInfo from '../../package.json';

@Component({
  selector: 'app-rock',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  name = 'Angular';
  
  ngOnInit() {
    console.log("Version:" + packageInfo.version);
  }
}
