import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { StatusBarComponent } from './status-bar/status-bar.component';
import { TextChatComponent } from './text-chat/text-chat.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { HeaderBarComponent } from './header-bar/header-bar.component';
import { LocalVideoComponent } from './local-video/local-video.component';
import { RemoteVideoComponent } from './remote-video/remote-video.component';


@NgModule({
  declarations: [
    AppComponent,
    StatusBarComponent,
    TextChatComponent,
    ChatWindowComponent,
    HeaderBarComponent,
    LocalVideoComponent,
    RemoteVideoComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
