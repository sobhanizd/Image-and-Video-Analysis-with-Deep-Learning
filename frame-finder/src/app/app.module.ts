import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { VideoItemComponent } from './video-item/video-item.component';
import { VideoListComponent } from './video-list/video-list.component';
import {FormsModule} from "@angular/forms";
import {provideHttpClient} from "@angular/common/http";
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {MatDialogModule} from "@angular/material/dialog";
import {VideoPlayerDialogComponent} from "./video-player-dialog/video-player-dialog.component";
import {MatButton} from "@angular/material/button";


@NgModule({
  declarations: [
    AppComponent,
    SearchBarComponent,
    VideoItemComponent,
    VideoListComponent,
    LoadingSpinnerComponent,
    VideoPlayerDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatDialogModule,
    MatButton,

  ],
  providers: [provideHttpClient(), provideAnimationsAsync()],
  bootstrap: [AppComponent]
})
export class AppModule { }
