import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AddPersonService {

    public onPersonAdded = new EventEmitter<any>();

    constructor(private http: HttpClient) {

    }

    public addPersonDetails(postData) {
        console.log("ADD PERSON SERVICE : One person");
        console.log(postData);
        this.http.post<any>(environment.backendIp + environment.backendPort + "/addPersonDetails", postData)
            .subscribe((res) => {
                if (res != true) {
                    this.onPersonAdded.emit(false)
                }
                else {
                    console.log("ADD PERSON : Person details added");
                    this.onPersonAdded.emit(true);
                }
            })
    }

    public addAllPersonDetails(userDataArray) {
        console.log("ADD PERSON SERVICE: All Person");
        let postData = {
            PersonDetailsArray : userDataArray
        }
        console.log(postData);    
        this.http.post<any>(environment.backendIp + environment.backendPort + "/addAllPersonDetails", postData)
            .subscribe((res) => {
                if (res != true) {
                    this.onPersonAdded.emit(false)
                }
                else {
                    console.log("ADD PERSON : Person details added");
                    this.onPersonAdded.emit(true);
                }
            })
    }


    public addTravelDetails(travelData) {
        let postData = {
            LocationArray: travelData
        }
        console.log("ADD PERSON SERVICE : Travel Details");
        console.log(postData);
        this.http.post<any>(environment.backendIp + environment.backendPort + "/addTravelDetails", postData)
            .subscribe((res) => {
        })
    }

}