import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { EsriMapComponent } from './esri-map/esri-map.component';
import { HomePageComponent } from './home-page/home-page.component';
import { EsriSceneComponent } from './esri-scene/esri-scene.component';


const appRoutes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'uvtracks2d', component: EsriMapComponent },
  { path: 'uvtracks3d', component: EsriSceneComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    EsriMapComponent,
    HomePageComponent,
    EsriSceneComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
