[![Build Status](https://codebuild.us-west-2.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoidVBIOThUQlpSeGhzRjQwNUw4TFEySFcxWXE4NFRpaE1wemZ5d3pNcGR6TU5JZmRUZDkwMmVqQzVsaUQxaGQyUmM4eXgrVjBEVlJ3dUZPOFBTRGJGWDNBPSIsIml2UGFyYW1ldGVyU3BlYyI6IjNpOUV3VnhlSlNkWEI3QnQiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=master)](https://us-west-2.console.aws.amazon.com/codebuild/home?region=us-west-2#/projects/UVCockpit/view)

# UV Cockpit

SPL front end applications.

## Build
ng build --base-href /uvcockpit/
docker build -t uvcockpit .

# Run
docker run -p 80:80 -d uvcockpit