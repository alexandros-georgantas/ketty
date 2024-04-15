The following steps must be performed in order for a new release to happen.

**On the server side**

- First, a new server version needs to be published (if there are changes in the server). Merge your branch into `dev` and then into `main`. The pipelines on `main` will create the new version number and add the appropriate tag.
- Git checkout locally on the newly created tag.
- Manually build & publish the image on dockerhub (eg. for version 1.2.3):
  `docker buildx build --push --platform linux/arm64,linux/amd64 --tag cokoapps/ketty-server:latest --tag cokoapps/ketty-server:1.2.3 .`

**On the client side**

- Merge your changes into `develop`, then into `main`
- Pipelines will run on those branches and update the deployments (ketidatest.cloud68.co & ketida.cokodemo.net)

:::note
For the time being, Ketty client releases do not have versions. This means that images published in dockerhub will have tags that reflect the last commit in the repo at the time.
