import { EventEmitter } from '@angular/core';


export class MapService
{
    public plotTracksService = new EventEmitter<any>();
    public searchService = new EventEmitter<any>();
    public mergeDataService = new EventEmitter<any>();
}