# ITB-Thesis.API #


## Description ##


* This is the api component of my thesis


## Software Architecture (High Level) ##


* This api is built on [Node.js](https://nodejs.org/en/).  It relies on [Foreman](https://github.com/strongloop/node-foreman) for managing the config values and running the application.


## Technical Requirements ##


* Node.js 6.3.1
* JavaScript ES6
* NPM ~3.10.3 
* Upstart


## How to set up a local environment ##

NPM and Bower install project dependencies (only needed once).  Grunt builds the frontend CSS and JS files

After cloning the repo:
```
gem install foreman
cp .env_example .env
npm install
npm install foreman nodemon -g
```


## How to run the project for development after setup ##

Nodemon is used in Procfile_dev so that any changes to the Node.js code are automatically applied and the app is restarted
```
npm run dev
```
The site is served at [http://localhost:3001](http://localhost:3001)


## How to run the project for production ##

[Upstart](http://upstart.ubuntu.com/) is used to daemonize the webapp and keep it alive.  Foreman exports the config values to the appropriate files for use by Upstart.
```
npm run export
sudo start foreman
```
The site is served at [http://localhost:3001](http://localhost:3001)