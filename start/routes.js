'use strict';

const superagent = require('superagent');

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');

Route.on('/').render('welcome', { username: 'Steven' });
Route.on('/star-wars-card').render('star-wars-card', getInformation);

function getInformation(req, res, next) {
  console.log(`it's running friend`);
  superagent.get('https://swapi.co/api/people/v1')
    .then(res => {
      return {
        name: res.results.name,
        height: res.results.height,
        homeworld: res.results.homeworld,
      }
    })
    .catch(err => {
      console.error(err);
    })
}