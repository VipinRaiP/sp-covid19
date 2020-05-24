import { Component, OnInit, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-testinglabs',
  templateUrl: './testinglabs.component.html',
  styleUrls: ['./testinglabs.component.css']
})
export class TestinglabsComponent implements OnInit {

  labdetails :any =[];
  slicelabdetails:any = [];
  data:any = [];
  @ViewChild('TestLabmap', { static: true }) mapElement: any;
  public map: google.maps.Map;

  constructor(private http: HttpClient) { }


  ngOnInit() {

    const mapProperties = {
      center: new google.maps.LatLng(20.5937, 78.9629),
      zoom: 6,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapProperties);

    this.getData();
  }


  onFileUploadlab(){
    var sfile = (<HTMLInputElement>document.getElementById('labfile')).files[0];
    console.log(sfile);
    var reader = new FileReader();
    var userDataArray = [];
    //this.travelDataArray = [];
    reader.onload = (event) => {
      var data = reader.result;
      var workbook = XLSX.read(data, {
        type: 'binary'
      });
      
      workbook.SheetNames.forEach((sheetName) => {

        var XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        for (var i = 0; i < XL_row_object.length; i++) {

          var labdata:any ={};

          labdata.name  = XL_row_object[i]["lab"];
          labdata.address = XL_row_object[i]["address"]
          labdata.type = XL_row_object[i]["type"]

          this.labdetails.push(labdata);
          //console.log(labdata);
        }

      });
      this.getLatLang();
      //console.log(this.labdetails);
    }
    reader.onerror = function (event) {
      console.error("File could not be read! Code ");
    };
    reader.readAsBinaryString(sfile);

    


  }

  getLatLang(){
    var locationArray = [];


    this.slicelabdetails = this.labdetails.slice(250,267);
    console.log(this.labdetails);
    this.slicelabdetails.forEach((lab, index) => {
      var noOfLocations = this.slicelabdetails.length;
      
       
        this.http.get<any>('https://maps.googleapis.com/maps/api/geocode/json?&key=AIzaSyC6XaqrE4rLEskBpcUihpdDw3kRaW70pj8&address=' + this.slicelabdetails[index].address + ' India' )
        .subscribe((response) => {
        
          if(response.status == "INVALID_REQUEST")
          {
            console.log(this.slicelabdetails[index].address);
          }
          else{
            console.log(response.status);
          var labData: any = {};
          console.log(index);
          labData.name = this.slicelabdetails[index].name;
          labData.address = this.slicelabdetails[index].address;
          labData.type = this.slicelabdetails[index].type;
          if(response.status=="OK")
          {
          labData.Latitude = response.results[0].geometry.location.lat;
          labData.Longitude = response.results[0].geometry.location.lng;
          }
          else{
            labData.Latitude =0;
            labData.Longitude=0;
          }
          locationArray.push(labData);
          if (locationArray.length == noOfLocations) {
            console.log(locationArray);
            this.addTestLabDetails(locationArray);
            //this.addPersonService.addTravelDetails(locationArray);
          }
        }
        });

       
      //console.log('https://maps.googleapis.com/maps/api/geocode/json?&key=AIzaSyC6XaqrE4rLEskBpcUihpdDw3kRaW70pj8&address=' + this.labdetails[index].address + ' India');
      
    });


    //this.addTestLabDetails(locationArray);
    console.log(locationArray);
  }
  
  addTestLabDetails(locationArray)
  {
    let postData = {
      LocationArray: locationArray
  }
  console.log("ADDING TESTING LABS");
  console.log(postData);
  this.http.post<any>(environment.backendIp + environment.backendPort + "/addTestingLabDetails", postData)
      .subscribe((res) => {
  })
  }

  getData(){
    this.http.get<any>(environment.backendIp + environment.backendPort + "/getAllTestingLabData")
      .subscribe(data => {
        this.data = data;
        //this.data.sort(this.getSortOrderBy("From_Time"));
        console.log("ALL DATA: ")
        console.log(this.data);
        this.plotPoints(data);
      });
  }

  plotPoints(data) {
    //this.clearMarkers();
    //this.markers.length = 0;
    //this.data = null;
    console.log("PLOT POINTS")
    for (let i = 0; i < this.data.length; i++) {

      var p = data[i];
      //console.log(p);
      var marker = new google.maps.Marker({
        position: { lat: p.Latitude, lng: p.Longitude },
        animation: google.maps.Animation.DROP,
        map: this.map,
        icon: {
        
          url: "http://maps.google.com/mapfiles/ms/icons/hospitals.png",
          
          //size: new google.maps.Size(30, 30),
          //anchor: new google.maps.Point(3.5, 3.5)
        }

      });

      var content = "<b>Name: </b> " + p.Name + "<br>" +
        "<b>Type: </b>" + p.Type 
     

        
      var infowindow = new google.maps.InfoWindow()

      google.maps.event.addListener(marker, 'click', (function (marker, content, infowindow) {
        return function () {
          infowindow.setContent(content);
          infowindow.open(this.map, marker);
        };
      })(marker, content, infowindow));

      //this.markers.push(marker);

    }

    //this.setMarkers(this.map);

  }

}

//addTestingLabDetails