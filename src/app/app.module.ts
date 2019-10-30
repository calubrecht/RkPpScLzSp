import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { LobbyComponent } from './lobby/lobby.component';
import { CustomerService } from './customer.service';
import { MsgService } from './msg.service';
import { NeedAuthGuardService } from './need-auth-guard.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';

import { APP_BASE_HREF } from '@angular/common';
import { MsgComponent } from './msg/msg.component';

@NgModule({
  imports:      [ 
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: LoginComponent },
      { path: 'login', component: LoginComponent },
      { path: 'lobby', component:LobbyComponent,    canActivate: [NeedAuthGuardService]  },
    ]),
    HttpClientModule,
     ],
  declarations: [ AppComponent, HelloComponent, HeaderComponent, LoginComponent, LobbyComponent, MsgComponent ],
  bootstrap:    [ AppComponent ],
  providers: [
	       CustomerService,
               MsgService,
               NeedAuthGuardService,
               {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi:true },
               {provide:APP_BASE_HREF, useValue : '/'}]
})
export class AppModule { }
