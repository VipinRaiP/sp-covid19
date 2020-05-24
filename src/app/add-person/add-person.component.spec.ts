import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';
import { DateTimePickerModule } from '@progress/kendo-angular-dateinputs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from '../app.component';
import { ShowMapComponent } from '../show-map/show-map.component';
import { GooglemapComponent } from '../googlemap/googlemap.component';
import { AddPersonComponent } from './add-person.component';
import { MapService } from '../services/maps.service';
import { } from 'googlemaps';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { AddPersonService } from '../services/addPerson.service';


describe('AddPersonComponent', () => {
  let component: AddPersonComponent;
  let fixture: ComponentFixture<AddPersonComponent>;
  let element: HTMLElement;
  let addPersonService:AddPersonService;

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
        MatCardModule,
        LoggerModule.forRoot({
          serverLoggingUrl: 'http://52.170.156.240:3323/',
          level: NgxLoggerLevel.INFO,
          serverLogLevel: NgxLoggerLevel.WARN,
          disableConsoleLogging: false
        })
      ],
      providers: [MapService, AddPersonService],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPersonComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
    addPersonService = fixture.debugElement.injector.get(AddPersonService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update submit variable', () => {
    component.onFormSubmit();
    expect(component.submitted).toEqual(true);
  });

  it('should invalidate form if fields left empty', () => {
    component.onFormSubmit();
    expect(component.registerForm.invalid).toEqual(true);
  })

  it('should match userData', async(() => {
    //* arrange
    const userData = {
      PersonID: '1',
      Address: 'HSR Layout,Bengaluru',
      City: 'Bengaluru',
      State: 'Karnataka',
      Infected: true
    }
    let spy = spyOn(addPersonService,'addPersonDetails')
              .and.returnValue();

    fixture.detectChanges();
    component.testing = true;
    fixture.debugElement.query(By.css('#id')).nativeElement.value = userData.PersonID;
    fixture.debugElement.query(By.css('#address')).nativeElement.value = userData.Address;
    fixture.debugElement.query(By.css('#city')).nativeElement.value = userData.City;
    fixture.debugElement.query(By.css('#state')).nativeElement.value = userData.State;
    fixture.debugElement.query(By.css('#infected')).nativeElement.checked = userData.Infected;

    //let temp = fixture.debugElement.queryAll(By.css('.location'))[0].nativeElement.value;

    //* act
    fixture.whenStable().then(() => {
      component.onFormSubmit();
      // * assert
      expect(component.userData).toEqual(userData);
    })
  }));



});
