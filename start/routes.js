'use strict'
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
/** @type {import('@adonisjs/framework/src/Route/Manager'} */
const Route = use('Route')
// Route.on('/').render('welcome').as('welcome')
Route.get('/', 'IndexController.index')
Route.get('/insere', 'IndexController.insere')
Route.on('/chat').render('index').as('index')
//Route.on('/chat2').render('chat').as('chat')
Route.get('/chat2', 'ChatController.index')
Route.on('/novochat').render('novochat2')