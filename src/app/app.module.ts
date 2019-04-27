import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { EsriMapComponent } from './esri-map/esri-map.component';
import { HomePageComponent } from './home-page/home-page.component';
import { EsriSceneComponent } from './esri-scene/esri-scene.component';
import { AppConfig } from './config';


const appRoutes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'uvtracks2d', component: EsriMapComponent },
  { path: 'uvtracks3d', component: EsriSceneComponent }
];

export function initializeApp(appConfig: AppConfig) {
  return () => appConfig.load();
}

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
  providers: [
    AppConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfig],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
