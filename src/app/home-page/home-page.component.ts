import { Component, OnInit } from '@angular/core';
import { AppConfig } from '../config';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  constructor() {
  }

  get tracksUrl() {
    return AppConfig.uvTracksBaseURL + '/uvtracks/api/v2/tracks';
  }

  get missionsUrl() {
    return AppConfig.uvTracksBaseURL + '/uvtracks/api/v2/missions';
  }

  ngOnInit() {
  }

}
