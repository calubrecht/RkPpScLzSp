import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';

import { GameComponent } from './game.component';

@Component({
  selector: 'app-msg',
  template: '<p>Msg</p>'
})
class MockMsg {}

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameComponent, MockMsg ],
      imports: [RouterTestingModule, HttpClientModule],
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
