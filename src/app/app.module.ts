import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShowMapComponent } from './show-map/show-map.component';
import { GooglemapComponent } from './googlemap/googlemap.component';
import {  DateTimePickerModule } from '@progress/kendo-angular-dateinputs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MapService } from './services/maps.service';
import { AddPersonComponent } from './add-person/add-person.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

@NgModule({
  declarations: [
    AppComponent,
    ShowMapComponent,
    GooglemapComponent,
    AddPersonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DateTimePickerModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    LoggerModule.forRoot({
      serverLoggingUrl: 'http://52.170.156.240:3323/',
      level: NgxLoggerLevel.INFO,
      serverLogLevel: NgxLoggerLevel.WARN,
      disableConsoleLogging: false
    })
  ],
  providers: [MapService],
  bootstrap: [AppComponent]
})
export class AppModule { }
