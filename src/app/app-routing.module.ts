import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddPersonComponent } from './add-person/add-person.component';
import { ShowMapComponent } from './show-map/show-map.component';


const routes: Routes = [
  {path:"addPerson",component:AddPersonComponent},
  {path:"showMap",component:ShowMapComponent},
  {path:"**",redirectTo:"addPerson"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
