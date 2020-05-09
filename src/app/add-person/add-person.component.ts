<<<<<<< HEAD
import { Component, OnInit } from '@angular/core';
=======
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as $ from 'jquery';
import { HttpClient } from '@angular/common/http';
>>>>>>> f53007666f81665dc2105827f728db66898642a0

@Component({
  selector: 'app-add-person',
  templateUrl: './add-person.component.html',
  styleUrls: ['./add-person.component.css']
})
export class AddPersonComponent implements OnInit {

<<<<<<< HEAD
  constructor() { }

  ngOnInit() {
  }

=======
  @ViewChild('name',{static:true} ) name: ElementRef;
  @ViewChild('id',{static:true} ) id: ElementRef;
  @ViewChild('address',{static:true} ) address: ElementRef;
  @ViewChild('city',{static:true} ) city: ElementRef;
  @ViewChild('infected',{static:true} ) infected: ElementRef;

  constructor(protected http: HttpClient) { }

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


  getFormData(){
    var userData = {
      PersonID: Number,
      PersonName: String,
      Address: String,
      City: String,
      Infected: Boolean
    }

    userData.PersonID = this.id.nativeElement.value;
    //+document.getElementById("id").value;
    userData.PersonName = this.name.nativeElement.value;
    //document.getElementById("name").value;
     userData.Address = this.address.nativeElement.value;
     //document.getElementById("address").value;
     userData.City = this.city.nativeElement.value;
    //document.getElementById("city").value;                  
    userData.Infected = (this.infected.nativeElement.checked);
    //(document.getElementById("infected").checked) ? 1 : 0;

    console.log(userData);

    var locationArray = [];

    var locations = [];
    var fromTime = [];
    var toTime = [];

    document.getElementsByName("location").forEach((d) => {
      locations.push((<HTMLInputElement>d).value);
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

    console.log(locations);
    console.log(fromTime);
    console.log(toTime);


    for (var i = 0; i < locations.length; i++) {
      var location = locations[i];
      var nolocations = locations.length;
      var PersonID = (<HTMLInputElement>document.getElementById("id")).value;
      this.http.get<any>('https://maps.googleapis.com/maps/api/geocode/json?&key=AIzaSyC6XaqrE4rLEskBpcUihpdDw3kRaW70pj8&address=' + location+' Karnataka')
      .subscribe((data) => {

        // var locationData = {};
        //     console.log(this.indexValue);
        //     locationData.PersonID = PersonID;
        //     locationData.Latitude = response.results[0].geometry.location.lat;
        //     locationData.Longitude = response.results[0].geometry.location.lng;
        //     locationData.Address = response.results[0].formatted_address;
        //     locationData.Location = locations[this.indexValue];
        //     locationData.FromTime = fromTime[this.indexValue];
        //     locationData.ToTime = toTime[this.indexValue];
        //     locationArray.push(locationData);
        //     if(locationArray.length==this.noOflocations){
        //       console.log(locationArray);  
        //       addTravelDetails(locationArray);
        //     }
      });

      // $.ajax({
      //   url: 'https://maps.googleapis.com/maps/api/geocode/json?&key=AIzaSyC6XaqrE4rLEskBpcUihpdDw3kRaW70pj8&address=' + location+' Karnataka',
      //   type: 'GET',
      //   indexValue: i,
      //   noOflocations : nolocations,
      //   success: function (response) {
      //     console.log(response)
      //     if (response.status !== 'OK') {
      //       alert("Invalid location details")
      //     }
      //     else {
      //       var locationData = {};
      //       console.log(this.indexValue);
      //       locationData.PersonID = PersonID;
      //       locationData.Latitude = response.results[0].geometry.location.lat;
      //       locationData.Longitude = response.results[0].geometry.location.lng;
      //       locationData.Address = response.results[0].formatted_address;
      //       locationData.Location = locations[this.indexValue];
      //       locationData.FromTime = fromTime[this.indexValue];
      //       locationData.ToTime = toTime[this.indexValue];
      //       locationArray.push(locationData);
      //       if(locationArray.length==this.noOflocations){
      //         console.log(locationArray);  
      //         addTravelDetails(locationArray);
      //       }
      //     }
      //   }
      // })    
    }

    }

>>>>>>> f53007666f81665dc2105827f728db66898642a0
}
