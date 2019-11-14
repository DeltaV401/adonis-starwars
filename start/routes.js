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

function getInformation(url) {
  console.log(`it's running friend`);
  return superagent.get(url)
    .then(res => {
      console.log(res.body)
      return new Person(res.body);
    })
    // .catch(err => {
    //   console.error(err);
    // })
}

Route.on('/').render('welcome', { username: 'Steven' });
Route.get('/star-wars-card/:id', ({ params, view }) => {
  return getInformation(`https://swapi.co/api/people/${params.id}`) // returns Promise that resolves with data
    .then(data => {
      return view.render('star-wars-card', data)
    })
})

class Person {
  constructor(data) {
    this.name = data.name,
    this.height = data.height,
    this.homeworld = data.homeworld,
    this.gender = data.gender,
    this.pronoun = this.pronounCheck(),
    this.pastTense = this.pastPronoun()
  }

  pronounCheck() {
    if(this.gender === 'male') {
      return 'He';
    } else if(this.gender === 'female') {
      return 'She';
    } else if(this.gender === 'n/a') {
      return 'They';
    }
  }

  pastPronoun() {
    if(this.gender === 'male') {
      return 'his';
    } else if(this.gender === 'female') {
      return 'her';
    } else if(this.gender === 'n/a') {
      return 'their';
    }
  }
}