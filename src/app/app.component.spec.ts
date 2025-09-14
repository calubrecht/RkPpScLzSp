import { TestBed, waitForAsync } from '@angular/core/testing';
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

function configure() {
    return TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule],
    })
    .overrideComponent(AppComponent, {
      set: {imports: [MockHeader, MockMenu]}
    });
}
  
describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    })
    .overrideComponent(AppComponent, {
      set: {imports: [MockHeader, MockMenu, RouterTestingModule]}
    });
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should log version', () => {
    let logged =  [];
    spyOn(console, "log").and.callFake(l => logged.push(l));
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    app.ngOnInit();
    expect(console.log).toHaveBeenCalled();
    expect(logged[0].split(":")[0]).toBe("Version");
  });

});
