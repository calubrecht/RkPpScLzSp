import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { APP_BASE_HREF } from '@angular/common';


import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { LobbyComponent } from './lobby/lobby.component';
import { MsgComponent } from './msg/msg.component';
import { AuthInterceptor } from './auth.interceptor';

import { UserLoginService } from './user-login.service';
import { MsgService } from './msg.service';
import { NeedAuthGuardService } from './need-auth-guard.service';
import { ApiService } from './api.service';
import { SubscriptionService } from './subscription.service';
import { GameService } from './game.service';

import { environment } from '../environments/environment';
import { ChatboxComponent } from './chatbox/chatbox.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { FindGameWidgetComponent } from './find-game-widget/find-game-widget.component';


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
  declarations: [ AppComponent, HelloComponent, HeaderComponent, LoginComponent, LobbyComponent, MsgComponent, ChatboxComponent, UserDetailComponent, FindGameWidgetComponent ],
  bootstrap:    [ AppComponent ],
  providers: [
	       UserLoginService,
	       MsgService,
         ApiService,
	       NeedAuthGuardService,
         SubscriptionService,
         GameService,
	       {provide: LocationStrategy, useClass: HashLocationStrategy },
               {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi:true },
               {provide:APP_BASE_HREF, useValue : environment.appRoot }]
})
export class AppModule { }
