import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {MatCardModule} from '@angular/material/card';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';
import {  DateTimePickerModule } from '@progress/kendo-angular-dateinputs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from '../app.component';
import { ShowMapComponent } from '../show-map/show-map.component';
import { GooglemapComponent } from '../googlemap/googlemap.component';
import { AddPersonComponent } from '../add-person/add-person.component';
import { MapService } from '../services/maps.service';
import { } from 'googlemaps';

/*
describe('GooglemapComponent', () => {
  let component: GooglemapComponent;
  let fixture: ComponentFixture<GooglemapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
        MatCardModule
      ],
      providers: [MapService],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GooglemapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    //expect(component).toBeTruthy();
  });
});

*/