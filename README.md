[![Build Status](https://codebuild.us-west-2.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoidVBIOThUQlpSeGhzRjQwNUw4TFEySFcxWXE4NFRpaE1wemZ5d3pNcGR6TU5JZmRUZDkwMmVqQzVsaUQxaGQyUmM4eXgrVjBEVlJ3dUZPOFBTRGJGWDNBPSIsIml2UGFyYW1ldGVyU3BlYyI6IjNpOUV3VnhlSlNkWEI3QnQiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=master)](https://us-west-2.console.aws.amazon.com/codebuild/home?region=us-west-2#/projects/UVCockpit/view)

# UV Cockpit Image 

UV Cockpit is an in-browser web application that visualizes data received from [UV Tracks](http://envirover.com/docs/uvtracks.html) web service. The container also forwards requests with path started with /uvtracks to URL specified by UVTRACKS_PRIVATE_URL environment variable.

## Build
ng build --base-href /uvcockpit/
docker build -t uvcockpit .

# Run
docker run -p 80:80 -d uvcockpit

## Quick Start

- Use [docker compose.yml](https://s3-us-west-2.amazonaws.com/envirover/spl/2.2.0/docker-compose.yml) file to start UV Hub, UV Tracks, and UV Cockpit on single machine.
- [Issues](https://github.com/envirover/support/issues)
- [Support](http://envirover.com/support/)

## System Requirements

- 128MB of RAM
- UV Tracks web service

## Ports

| Port  | Description                      |
|-------|----------------------------------|
| 80    | HTTP port of the web application |

## Environment Variables

| Environment Variable | Description                | Default          |
|----------------------|----------------------------|------------------|
| UVTRACKS_PROTOCOL    | UV Tracks service protocol |location.protocol |
| UVTRACKS_HOSTNAME    | UV Tracks service hostname |location.hostname |
| UVTRACKS_PORT        | UV Tracks service port     | location.port    |
| UVTRACKS_PRIVATE_URL | UV Tracks service private URL |               |

## License

View [license agreement](http://envirover.com/docs/uvhub-eula.html) for the software contained in this image.

As with all Docker images, these likely also contain other software which may be under other licenses (such as Bash, etc from the base distribution, along with any direct or indirect dependencies of the primary software being contained).

As for any pre-built image usage, it is the image user's responsibility to ensure that any use of this image complies with any relevant licenses for all software contained within.
