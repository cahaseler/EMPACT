# Release Scripts

The scripts in this folder are used by the github actions workflow to build and release the application to Docker and Exe formats available in the Github Release section. They're not intended to be used or modified by the end user or developers.

## Environment Variables and configuration

The following environment variables need to be configured in Github as secrets:

| Name | Description |
| DOCKER_REGISTRY_USER | The user name to authenticate with at the registry. |
| DOCKER_REGISTRY_PASSWORD | The password used for authentication at the registry. |
