import { Component, OnInit, ViewChild } from '@angular/core';
import {} from 'googlemaps';

@Component({
  selector: 'app-googlemap',
  templateUrl: './googlemap.component.html',
  styleUrls: ['./googlemap.component.css']
})
export class GooglemapComponent implements OnInit {

  @ViewChild('map',{ static: true }) mapElement: any;
  public map: google.maps.Map;
  constructor() { }

  ngOnInit() {
    const mapProperties = {
      center: new google.maps.LatLng(20.5937, 78.9629),
      zoom: 5,
      mapTypeId: google.maps.MapTypeId.ROADMAP
 };
 this.map = new google.maps.Map(this.mapElement.nativeElement,    mapProperties);

 var marker = new google.maps.Marker({
  position: { lat: 14.581383, lng: 75.634712 },
  map: this.map,
  // icon: {
  //     //url: "https://maps.gstatic.com/intl/en_us/mapfiles/markers2/measle.png",
  //     url: "http://maps.gstatic.com/mapfiles/markers2/measle_blue.png",
  //     size: new google.maps.Size(9, 9),
  //     anchor: new google.maps.Point(3.5, 3.5)
  // }

});

  }

}
