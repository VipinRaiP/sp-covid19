import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as $ from 'jquery';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';
import { CustomValidators } from 'ng4-validators';
import { MatCardModule } from '@angular/material/card';
import { NGXLogger } from 'ngx-logger';
import { AddPersonService } from '../services/addPerson.service';
import { visitAll } from '@angular/compiler';

@Component({
  selector: 'app-add-person',
  templateUrl: './add-person.component.html',
  styleUrls: ['./add-person.component.css']
})
export class AddPersonComponent implements OnInit {

  registerForm: FormGroup;
  submitted = false;
  //@ViewChild('name',{static:true} ) name: ElementRef;
  @ViewChild('id', { static: true }) id: ElementRef;
  @ViewChild('address', { static: true }) address: ElementRef;
  @ViewChild('city', { static: true }) city: ElementRef;
  @ViewChild('state', { static: true }) state: ElementRef;
  @ViewChild('infected', { static: true }) infected: ElementRef;

  public userData: any = {}; 
  public travelDataArray = [];
  public testing  = false;
  public ft = [];

  constructor(private http: HttpClient, private formBuilder: FormBuilder, private logger: NGXLogger,
              private addPersonService:AddPersonService) { }

  ngOnInit() {

    this.logger.info("Add Persons INIT");
    this.registerForm = this.formBuilder.group({
      id: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      location: ['', Validators.required],
      mot: ['', Validators.required],
      from: ['', [Validators.required,, CustomValidators.date]],
      //to :['', Validators.required].
      to: ['', [Validators.required, CustomValidators.date]],

    });


    $(document).ready(function () {

      $(".add-more").click(function () {
        var html = $(".copy").html();
        $(".after-add-more").after(html);
      });


      $("body").on("click", ".remove", function () {
        $(this).parents(".control-group").remove();
      });


    });

    this.addPersonService.onPersonAdded.subscribe((data)=>{
      if(data==true){
        this.gatherTravelDetails();
      }
      else{
        alert("Cannot add to Database");
      }
    })


  }
  get f() { return this.registerForm.controls; }

  onFormSubmit() {

    this.logger.info("Form Submitted");
    this.submitted = true;
    this.travelDataArray = [];
    // stop here if form is invalid
    if (!this.testing && this.registerForm.invalid) {
      console.log("INVALID")
      this.logger.error("Incorrect Form Field");
      alert("Please Enter all fields");
      return;
    }

    let emptylocation = 0;
    let emptymot = 0;
    let emptyto = 0;
    let emptyfrom = 0;

    document.getElementsByName("location").forEach((d) => {
      if ((<HTMLInputElement>d).value == "") {
        emptylocation++;
      }

    });

    document.getElementsByName("mot").forEach((d) => {
      if ((<HTMLInputElement>d).value == "") {
        emptymot++;
      }
    });
    
    document.getElementsByName("from").forEach((d) => {
      if ((<HTMLInputElement>d).value == "") {
        emptyfrom++;
      }
    });

    document.getElementsByName("to").forEach((d) => {
      if ((<HTMLInputElement>d).value == "") {
        emptyto++;
      }
    });
   
    if ((!this.testing) && (emptylocation > 1 || emptyfrom > 1 || emptyto > 1 || emptymot > 1)) {
      this.logger.error("Incorrect Form Field");
      alert("Please Enter all fields");
      return;
    }

    this.logger.info("Form Fields are correct");

    this.userData.PersonID = this.id.nativeElement.value;
    this.userData.Address = this.address.nativeElement.value;
    this.userData.City = this.city.nativeElement.value;
    this.userData.State = this.state.nativeElement.value;
    this.userData.Infected = (this.infected.nativeElement.checked);
    console.log("ADD PERSON : User Data")
    console.log(this.userData);

    /* Obtain travel details */
  
    var locations = [];
    var modeOfTransport = [];
    var fromTime = [];
    var toTime = [];
    
    document.getElementsByName("location").forEach((d) => {
      locations.push((<HTMLInputElement>d).value);
    });

    document.getElementsByName("mot").forEach((d) => {
      modeOfTransport.push((<HTMLInputElement>d).value);
    });

    document.getElementsByName("from").forEach((d) => {
      fromTime.push((<HTMLInputElement>d).value);
    });

    document.getElementsByName("to").forEach((d) => {
      toTime.push((<HTMLInputElement>d).value);
    });

    this.ft = fromTime;  

    locations = locations.slice(0, locations.length - 1);
    fromTime = fromTime.slice(0, fromTime.length - 1);
    toTime = toTime.slice(0, toTime.length - 1);
    modeOfTransport = modeOfTransport.slice(0, modeOfTransport.length - 1);


    console.log(locations);
    console.log(fromTime);
    console.log(toTime);
    console.log(modeOfTransport);

    for(let i=0;i<locations.length;i++){
      var travelData: any = {};
      travelData.PersonID = this.userData.PersonID;
      travelData.From_Time = fromTime[i];
      travelData.To_Time = toTime[i]
      travelData.Mode_of_Transportation = modeOfTransport[i]
      travelData.Location = locations[i];
      this.travelDataArray.push(travelData);
    }

    //this.addPersonDetails(this.userData);
    this.addPersonService.addPersonDetails(this.userData);

  }

  gatherTravelDetails() {
    var locationArray = [];
    
    this.travelDataArray.forEach((location, index) => {
      var noOfLocations = this.travelDataArray.length;
<<<<<<< HEAD
      
      // //var PersonID = (<HTMLInputElement>document.getElementById("id")).value;
      this.http.get<any>('https://maps.googleapis.com/maps/api/geocode/json?&key=AIzaSyC6XaqrE4rLEskBpcUihpdDw3kRaW70pj8&address=' + this.travelDataArray[index].location + ' Karnataka')
=======
      //var PersonID = (<HTMLInputElement>document.getElementById("id")).value;
      this.http.get<any>('https://maps.googleapis.com/maps/api/geocode/json?&key=AIzaSyC6XaqrE4rLEskBpcUihpdDw3kRaW70pj8&address=' + this.travelDataArray[index].Location + ' Karnataka')
>>>>>>> 862d97e1b79e83959c791d589ef88ddec83aea10
        .subscribe((response) => {

          var locationData: any = {};
          console.log(index);
          locationData.PersonID = this.travelDataArray[index].PersonID;
          locationData.Latitude = response.results[0].geometry.location.lat;
          locationData.Longitude = response.results[0].geometry.location.lng;
          locationData.Address = response.results[0].formatted_address;
          locationData.Location = this.travelDataArray[index].Location;
          locationData.From_Time = this.travelDataArray[index].From_Time;
          locationData.To_Time = this.travelDataArray[index].To_Time;
          locationData.Mode_of_Transportation = this.travelDataArray[index].Mode_of_Transportation;
          locationArray.push(locationData);
          if (locationArray.length == noOfLocations) {
            console.log(locationArray);
            //this.addTravelDetails(locationArray);
            this.addPersonService.addTravelDetails(locationArray);
          }
        });
    });
  }

  onFileUpload() {
    var sfile = document.querySelector('input').files[0];
    console.log(sfile);
    var reader = new FileReader();
    var userDataArray = [];
    this.travelDataArray = [];
    reader.onload = (event) => {
      var data = reader.result;
      var workbook = XLSX.read(data, {
        type: 'binary'
      });
      
  
      workbook.SheetNames.forEach((sheetName) => {

        //var XL_row_object = <any>XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        var XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        //var json_object = JSON.stringify(XL_row_object);
        
        for (var i = 0; i < XL_row_object.length; i++) {

          if (sheetName === "Person data") {

            var userData:any  = {};

            userData.PersonID = XL_row_object[i]["Person_ID"];
            userData.Address = XL_row_object[i]["Home_Street_address"];
            userData.City = XL_row_object[i]["City_Town_Village"];
            userData.State = XL_row_object[i]["State"];
            userData.Infected = XL_row_object[i]["Infected_0_1"];

            console.log(userData);
            userDataArray.push(userData)
          }
          else {

            var location = XL_row_object[i]["Location_travelled_to_Street_Address"]
              + " " + XL_row_object[i]["City_Town_Village"] + " " + XL_row_object[i]["State"];

            //////date
            var date_from = XL_row_object[i]["Reached_at_Date_YYYYMMDD"];//
            var date_to = XL_row_object[i]["Left_at_Date_YYYYMMDD"];// 

            var datefromD = new Date(date_from);
            var datetoD = new Date(date_to);

            // Javascript format to SQL format
            var dateto = datetoD.toISOString().slice(0, 10);
            var datefrom = datefromD.toISOString().slice(0, 10);

            var fromDate = datefrom + " " + XL_row_object[i]["Reached_at_Time_hhmm"];
            var toDate = dateto + " " + XL_row_object[i]["Left_at_Time_hhmm"];


            var travelData: any = {};
            travelData.PersonID = XL_row_object[i]["Person_ID"];
            travelData.From_Time = fromDate;
            travelData.To_Time = toDate;
            travelData.Mode_of_Transportation = XL_row_object[i]["Mode_of_Transportation"];
            travelData.Location = location;

            this.travelDataArray.push(travelData);
          }

        }

      });
      console.log("Data from file");
      console.log(userDataArray);
      console.log(this.travelDataArray);
      this.addPersonService.addAllPersonDetails(userDataArray);
    };
    reader.onerror = function (event) {
      console.error("File could not be read! Code ");
    };
    reader.readAsBinaryString(sfile);
  }

}
