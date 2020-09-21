import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';

import { AppComponent } from './app.component';

@Component({
  selector: 'app-header',
  template: '<p>Header</p>'
})
class MockHeader {
}
@Component({
  selector: 'app-menubar',
  template: '<p>Menu</p>'
})
class MockMenu {
}
  

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule],
      declarations: [
        AppComponent, MockHeader, MockMenu
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

});
