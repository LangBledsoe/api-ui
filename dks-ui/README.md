# DevOps Knowledge Share UI (DKS UI)

The DevOps Knowledge Share UI is a React application containing a simple form and table which
allows users to submit links to articles, blogs, or sites containing knowledge they would like to share with others.
The application works in conjunction with the [DevOps Knowledge Share API](https://github.com/liatrio/dks-api),
a simple Spring Boot application that provides a RESTful API for the DevOps Knowledge Share application.
The purpose of DKS UI is to act as an example of a simple React application allowing us to demonstrate
how one might build, test, and deploy a React application.

## Prerequisites

This project requires the following tools to be installed on your machine:

- [Make](https://www.gnu.org/software/make/#download)
- [Docker](https://docs.docker.com/get-docker/)
  - [Docker Compose](https://docs.docker.com/compose/install/#scenario-one-install-docker-desktop) _(v2.11.2+)_
- [pre-commit](https://pre-commit.com/#install) _(v3.2.0+)_

## Running and developing locally

We use `make` to run commands during local development and leverage Docker and Docker Compose for execution so users do not need to install Node or other dependencies - everything runs in a consistent, containerized manner.

After cloning this repository you can run `make` or  `make help` to see a list of available commands.

```bash
make
```

### Setup dependencies

Before attempting to run or develop against the application we need to setup our project's dependencies which can
be done by running the following command:

```bash
make deps-check
```

This command does the following:

- Creates a `.env` file in the project's root directory if one does not exist using `.env.template` as a template
- Checks that the `.env` file contains the required environment variables
  - This process compares the keys defined in `.env.template` to those defined in `.env`
- Sets up local Git hooks for the project
  - :information_source: This requires `pre-commit` to be installed. [(_See **Prerequisites** for instructions on installing pre-commit_)](#prerequisites)

Once these dependencies are in place, **review the values in `.env` and update them as necessary before continuing**.

> :information_source: Under the hood the `deps-check` Make target simply calls the `envfile` and `local-git-hooks` Make targets
and provides helpful console output. Both of those Make targets can be called individually if you find a need to
do so by running `make envfile` and `make local-git-hooks` respectively. Most of the other Make targets for this
project have `deps-check` or `envfile` as dependencies so you'll see them run when you perform other actions through
Make.

### Runnning the application

The DKS UI is designed to work with [DKS API]((https://github.com/liatrio/dks-api)) so if you want a fully functioning
application make sure the DKS API is running locally by following the instructions in that project. The DKS UI webpage
will still render without DKS API running, but it will have limited functionality.

#### Build application Docker image and run it via Docker Compose

To build and run the application the easiest way is to run the command below. It builds a Docker image
and names it based on the value of the `APP_NAME` variable in the `.env` file, then it runs the application as a
Docker Compose service. You can then access the application at [http://localhost:3000](http://localhost:3000).

```bash
make up
```

View the running application at [http://localhost:3000](http://localhost:3000).

> :warning: Please note that if the DKS API is not running locally or is but is inaccessible a message will appear
stating so in place of the table of blogs you'd normally see. If you have DKS API running locally but still see
a `504` error, verify the value of `DKS_API_BASE_URL` in the `.env` file.

### Developing the application

#### Running the application in development mode

If you want to make changes to the application and see those changes reflected quickly follow the steps below.

1. Install dependencies

   ```bash
   make install
   ```

2. Run the application in development mode (includes hot-code reloading)

   ```bash
   make dev
   ```

3. View the running application at [http://localhost:3000](http://localhost:3000). The application will automatically
   reload when changes are made to the source code.

#### Linting and formatting

To lint and format the codebase run the following command:

```bash
make lint
```

#### Running unit tests

To run the unit tests for the application run the following command:

```bash
make test
```

#### Running functional tests

To run the functional tests for the application run the following command:

```bash
make functional-test
```

> :information_source: Ensure the application is running before executing the above command.

#### Running an arbitrary `npm` command

To run an arbitrary `npm` command you can use the `npm` Make target. For example, to run `npm run build` you would
run the following command:

```bash
make npm run build
```

If any arguments must be passed to the `npm` command, they should be passed after the `make npm` command.
Additionally, if your `npm` command needs to include a hyphen (`-`) or double hyphen (`--`) you will
need to use the `--` flag to separate the `make` arguments from the `npm` arguments. For example, to run
`npm install --save-dev foo` you would run the following command:

```bash
make npm -- install --save-dev foo
```

#### Building the Docker image

To build the Docker image for the application run the following command:

```bash
make docker-build
```

## Feature Flags

We currently have an example feature flag that is set via the environment variable `ENABLE_IMAGE_URL`.
When set, the application will render a new `Image Url` field as an input. This is meant to serve as an example of
merging in code that is not ready to be released and delivering work in small batches.

### Enabling/disabling the Flag

- Prior to starting the application, update the value of `ENABLE_IMAGE_URL` in the `.env` file to `true` or `false`.


## Steps to access the API and application index page

1. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

2. [API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

3. The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.
