import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as $ from 'jquery';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-person',
  templateUrl: './add-person.component.html',
  styleUrls: ['./add-person.component.css']
})
export class AddPersonComponent implements OnInit {

  //@ViewChild('name',{static:true} ) name: ElementRef;
  @ViewChild('id', { static: true }) id: ElementRef;
  @ViewChild('address', { static: true }) address: ElementRef;
  @ViewChild('city', { static: true }) city: ElementRef;
  @ViewChild('state', { static: true }) state: ElementRef;
  @ViewChild('infected', { static: true }) infected: ElementRef;
  
  constructor(private http: HttpClient) { }

  ngOnInit() {

    $(document).ready(function () {

      $(".add-more").click(function () {
        var html = $(".copy").html();
        $(".after-add-more").after(html);
      });


      $("body").on("click", ".remove", function () {
        $(this).parents(".control-group").remove();
      });

    });
  }

  onFormSubmit() {
    var userData = {
      PersonID: Number,
      Address: String,
      City: String,
      State: String,
      Infected: Boolean
    }

    userData.PersonID = this.id.nativeElement.value;
    userData.Address = this.address.nativeElement.value;
    userData.City = this.city.nativeElement.value;
    userData.State = this.state.nativeElement.value;
    userData.Infected = (this.infected.nativeElement.checked);
    console.log(userData);

    this.addPersonDetails(userData);

    var locationArray = [];

    var locations = [];
    var fromTime = [];
    var toTime = [];
    var modeOfTransport = [];

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

    locations = locations.slice(0, locations.length - 1);
    fromTime = fromTime.slice(0, fromTime.length - 1);
    toTime = toTime.slice(0, toTime.length - 1);
    modeOfTransport = modeOfTransport.slice(0, modeOfTransport.length - 1);
    console.log(locations);
    console.log(fromTime);
    console.log(toTime);
    console.log(modeOfTransport);

    locations.forEach((location, index) => {
      console.log(index);
      var noOfLocations = locations.length;
      var PersonID = (<HTMLInputElement>document.getElementById("id")).value;
      this.http.get<any>('https://maps.googleapis.com/maps/api/geocode/json?&key=AIzaSyC6XaqrE4rLEskBpcUihpdDw3kRaW70pj8&address=' + location + ' Karnataka')
        .subscribe((response) => {

          var locationData: any = {};
          console.log(index);
          locationData.PersonID = PersonID;
          locationData.Latitude = response.results[0].geometry.location.lat;
          locationData.Longitude = response.results[0].geometry.location.lng;
          locationData.Address = response.results[0].formatted_address;
          locationData.Location = locations[index];
          locationData.FromTime = fromTime[index];
          locationData.ToTime = toTime[index];
          locationData.Mode_of_Transportation = modeOfTransport[index];
          locationArray.push(locationData);
          if (locationArray.length == noOfLocations) {
            console.log(locationArray);
            this.addTravelDetails(locationArray);
          }
      });
    })
  }

  /* Add person details */

  addPersonDetails(postData) {
    this.http.post<any>(environment.backendIp + environment.backendPort + "/addPersonDetails", postData)
      .subscribe((res) => {
        if (res != true)
          alert(res.sqlMessage)
        else
          console.log("ADD PERSON : Person details added");
      })
  }

  /* Add person travel details */

  addTravelDetails(travelData) {
    let postData  = {
      LocationArray : travelData
    }
    this.http.post<any>(environment.backendIp + environment.backendPort + "/addTravelDetails", postData)
      .subscribe((res) => {
        if (res != true)
          alert(res.sqlMessage)
        else
          console.log("ADD PERSON : Travel details added");
      })
  }

}
