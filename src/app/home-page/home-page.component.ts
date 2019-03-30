import { Component, OnInit } from '@angular/core';
import { uvCockpitConfig } from '../config';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  constructor() {
  }

  get tracksUrl() {
    return uvCockpitConfig.uvTracksBaseURL + '/uvtracks/api/v1/tracks';
  }

  get missionsUrl() {
    return uvCockpitConfig.uvTracksBaseURL + '/uvtracks/api/v1/missions';
  }

  ngOnInit() {
  }

}
