// UV Cockpit web applications configuration

const UVTRACKS_PROTOCOL = location.protocol;
const UVTRACKS_HOSTNAME = location.hostname;
const UVTRACKS_PORT = ':8080'; // location.port ? ':' + location.port : '';
// Base URL of UV Tracks web service
const UVTRACKS_BASE_URL = UVTRACKS_PROTOCOL + '//' + UVTRACKS_HOSTNAME + UVTRACKS_PORT;

export const uvCockpitConfig = {
     uvTracksBaseURL :  UVTRACKS_BASE_URL
};
