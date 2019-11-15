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

async function getInformation(url) {
  let person = await getPerson(url);
  person.homeworld = await getHomeworld(person.homeworld);
  console.log(person.films);
  person.films = await getFilms(person.films);
  console.log(person.films);
  return person;
}
  
async function getPerson(url) {
  let res = await superagent.get(url);
  return new Person(res.body);
}

async function getHomeworld(url) {
  let res = await superagent.get(url);
  return new Homeworld(res.body);
}

async function getFilms(urls) {
  let films = [];
  urls.forEach(async url => {
    let res = await superagent.get(url)
    let film = new Film(res.body);
    films.push(film.title);
  })
  return films.join(', ');
}

Route.on('/').render('welcome', { username: 'Steven' });
Route.get('/star-wars-card/:id', async ({ params, view }) => {
  let data = await getInformation(`https://swapi.co/api/people/${params.id}`) // returns Promise that resolves with data
  return view.render('star-wars-card', data);
});

class Film {
  constructor(data) {
    this.title = data.title,
    this.release = data.release_date
  }
}

class Homeworld {
  constructor(data) {
    this.name = data.name,
    this.population = data.population,
    this.climate = `${data.climate} ${data.terrain}`
  }
}

class Person {
  constructor(data) {
    this.name = data.name,
    this.height = data.height,
    this.homeworld = data.homeworld,
    this.gender = data.gender,
    this.pronoun = this.pronounCheck(),
    this.pastTense = this.pastPronoun(),
    this.pronounFollower = this.proVerb(),
    this.birthyear = data.birth_year,
    this.films = data.films
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

  proVerb() {
    if(this.gender === 'n/a') {
      return 'are';
    } else {
      return 'is';
    }
  }
}