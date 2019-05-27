'use strict';

const express = require('express');

const cwd = process.cwd();

const router = express.Router();

const superagent = require('superagent');

const swagger = require('swagger-ui-express');
const swaggerDocs = require('../../docs/config/swagger.json');

const modelFinder = require(`${cwd}/src/middleware/model-finder.js`);

router.use('/api/v1/doc', swagger.serve, swagger.setup(swaggerDocs));
router.use('/docs', express.static('docs'));
router.param('model', modelFinder);

//api routes

// Set the view engine for server-side templating
router.set('view engine', 'ejs');

// API Routes
router.get('/', getBooks);
router.post('/searches', createSearch);
router.get('/searches/new', newSearch);
router.get('/books/:id', getBook);
router.post('/books', createBook);
router.put('/books/:id', updateBook);
router.delete('/books/:id', deleteBook);

router.get('*', (request, response) =>
  response.status(404).send('This route does not exist')
);

// HELPER FUNCTIONS

function getBooks(request, response, next) {
  request.model
    .get()
    .then(data => {
      if (!data.length) {
        response.render('pages/searches/new');
      } else {
        response.render('pages/index', { books: data.rows });
      }
    })
    .catch(err => handleError(err, response));
}

function createSearch(request, response) {
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';

  if (request.body.search[1] === 'title') {
    url += `+intitle:${request.body.search[0]}`;
  }
  if (request.body.search[1] === 'author') {
    url += `+inauthor:${request.body.search[0]}`;
  }

  superagent
    .get(url)
    .then(apiResponse =>
      apiResponse.body.items.map(bookResult => new Book(bookResult.volumeInfo))
    )
    .then(results =>
      response.render('pages/searches/show', { results: results })
    )
    .catch(err => handleError(err, response));
}

function newSearch(request, response) {
  response.render('pages/searches/new');
}

function getBook(request, response, next) {
  request.model
    .get(request.params.id)
    .then(result => response.render('pages/books/show', result[0]))
    .catch(next);
}

function createShelf(shelf) {
  let normalizedShelf = shelf.toLowerCase();
  return bookshelves.findOneAndUpdate(
    { bookshelf: normalizedShelf },
    { bookshelf: normalizedShelf },
    { upsert: true, new: true }
  );
}

function createBook(request, response, next) {
  createShelf(request.body.bookshelf).then(shelf => {
    let record = request.body;
    record.bookshelf_id = shelf._id;
    let book = new books(record);
    book
      .save()
      .then(result => response.redirect(`/books/${result._id}`))
      .catch(next);
  });
}

function updateBook(request, response, next) {
  request.model
    .put()
    .then(response.redirect(`/books/${request.params.id}`))
    .catch(next);
}

function deleteBook(request, response, next) {
  request.model
    .delete()
    .then(response.redirect('/'))
    .catch(next);
}

function handleError(error, response) {
  response.render('pages/error', { error: error });
}

module.exports = router;
