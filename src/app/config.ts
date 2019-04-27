import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

class UVTracksConnection {
  public protocol?: string;
  public hostname?: string;
  public port?: string;
}

class UVCockpitConfig {
  uvtracks: UVTracksConnection = new UVTracksConnection();
}

/**
 * Application configuration loaded from assets/config.json file.
 */
@Injectable({
  providedIn: 'root',
})
export class AppConfig {
  static settings: UVCockpitConfig;

  constructor(private http: HttpClient) { }

  static get uvTracksBaseURL() {
    return AppConfig.settings.uvtracks.protocol + '//' + AppConfig.settings.uvtracks.hostname +
           (AppConfig.settings.uvtracks.port ? ':' + AppConfig.settings.uvtracks.port : '');
  }

  load() {
    const jsonFile = 'assets/config.json';
    return new Promise<void>((resolve, reject) => {
      this.http.get<UVCockpitConfig>(jsonFile).toPromise().then((response: UVCockpitConfig) => {
        AppConfig.settings = response;
        console.log(`Configuration loaded from file '${jsonFile}'.`);
      })
      .catch((response: any) => {
        AppConfig.settings = new UVCockpitConfig();
        console.log(`Could not load file \'${jsonFile}\'`);
      })
      .finally(() => {
        if (!AppConfig.settings.uvtracks.hostname) {
          AppConfig.settings.uvtracks.protocol = location.protocol;
        }

        if (!AppConfig.settings.uvtracks.hostname) {
          AppConfig.settings.uvtracks.hostname = location.hostname;
        }

        if (!AppConfig.settings.uvtracks.port) {
          AppConfig.settings.uvtracks.port = location.port;
        }

        console.log('UV Tracks URL: ' + AppConfig.uvTracksBaseURL);
        resolve();
      });
    });
  }

}
