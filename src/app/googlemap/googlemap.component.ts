import { Component, OnInit, ViewChild } from '@angular/core';
import { } from 'googlemaps';
import { HttpClient } from '@angular/common/http';
import { MapService } from '../services/maps.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-googlemap',
  templateUrl: './googlemap.component.html',
  styleUrls: ['./googlemap.component.css']
})
export class GooglemapComponent implements OnInit {
  public tracksPlotted: boolean = false;
  private data: any;
  public markers = [];
  public tracks = [];

  @ViewChild('map', { static: true }) mapElement: any;
  public map: google.maps.Map;

  constructor(protected http: HttpClient, public mapService: MapService) { }

  ngOnInit() {

    this.mapService.plotTracksService.subscribe(() => {
      this.plotTracks();
    });

    this.mapService.searchService.subscribe((data) => {
      this.getSearchData(data);
    });

    const mapProperties = {
      center: new google.maps.LatLng(20.5937, 78.9629),
      zoom: 5,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapProperties);
    this.initialize();

  }

  initialize() {
    
    this.http.get<any>(environment.backendIp+environment.backendPort+"/getAllTravelData")
      .subscribe(data => {

        //console.log(data);
        this.data = data;
        this.plotPoints(data);
      });
  }

  getSearchData(date) {

    this.http.post<any>(environment.backendIp+environment.backendPort+"/getTravelData", date)
      .subscribe(resData => {
        this.data = resData;
        this.plotPoints(resData);
        if (this.tracksPlotted) {
          this.plotTracks();
        }
      });


  }

  plotPoints(data) {
    this.clearMarkers();
    this.markers.length = 0;
    //this.data = null;
    for (let i = 0; i < this.data.length; i++) {

      var p = data[i];
      var marker = new google.maps.Marker({
        position: { lat: p.Latitude, lng: p.Longitude },
        animation: google.maps.Animation.DROP,
        //map: this.map,
        icon: {
          url: "https://maps.gstatic.com/intl/en_us/mapfiles/markers2/measle.png",
          // url: "http://maps.gstatic.com/mapfiles/markers2/measle_blue.png",
          size: new google.maps.Size(10, 10),
          anchor: new google.maps.Point(3.5, 3.5)
        }

      });

      var content = "<b>Name: </b> " + p.PersonName + "<br>" +
        "<b>Location: </b>" + p.Location + "<br>" +
        "<b>From: </b>" + p.From_Time + "<br>" +
        "<b>To: </b>" + p.To_Time + "<br>" +
        "<b>Address: </b>" + p.Address

      var infowindow = new google.maps.InfoWindow()

      google.maps.event.addListener(marker, 'click', (function (marker, content, infowindow) {
        return function () {
          infowindow.setContent(content);
          infowindow.open(this.map, marker);
        };
      })(marker, content, infowindow));

      this.markers.push(marker);

    }

    this.setMarkers(this.map);

  }

  setMarkers(map) {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }
  }

  clearMarkers() {
    this.setMarkers(null);
  }

  plotTracks() {
    this.tracksPlotted = true;


    this.clearTracks();
    this.tracks.length = 0;
    //grouping data for line
    let group = this.data.reduce((r, a) => {
      r[a.PersonID] = [...r[a.PersonID] || [], { 'lat': a.Latitude, 'lng': a.Longitude }]
      return r;
    }, {});


    let keyArray = [...Object.keys(group)];
    console.log(keyArray);
    //console.log(group.length());
    const colors = ['#FF0000', '#000000'];

    // drawing line along the points
    for (var i = 0; i < Object.keys(group).length; i++) {  //hardcoded data

      var flightPath = new google.maps.Polyline({
        path: group[keyArray[i]],
        geodesic: true,
        strokeColor: colors[i - 1],
        strokeOpacity: 1.0,
        strokeWeight: 2
      });

      this.tracks.push(flightPath);
      //flightPath.setMap(this.map);
    }
    this.setTracks(this.map);


  }

  setTracks(map) {
    for (var i = 0; i < this.tracks.length; i++) {
      this.tracks[i].setMap(map);
    }
  }

  clearTracks() {
    this.setTracks(null);
  }
}
