'use strict';

const express = require('express');

// const cwd = process.cwd();

const router = express.Router();

const superagent = require('superagent');

// const swagger = require('swagger-ui-express');
// const swaggerDocs = require('../../docs/config/swagger.json');

const modelFinder = require(`../middleware/model-finder.js`);
router.use(express.urlencoded({ extended: true }));
router.use(express.static('public'));

// router.use('/api/v1/doc', swagger.serve, swagger.setup(swaggerDocs));
router.use('/docs', express.static('docs'));
router.param('model', modelFinder);
router.use(modelFinder);

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

function Book(info) {
  const placeholderImage = 'https://i.imgur.com/J5LVHEL.jpg';

  this.title = info.title ? info.title : 'No title available';
  this.author = info.authors ? info.authors[0] : 'No author available';
  this.isbn = info.industryIdentifiers
    ? `ISBN_13 ${info.industryIdentifiers[0].identifier}`
    : 'No ISBN available';
  this.image_url = info.imageLinks
    ? info.imageLinks.smallThumbnail
    : placeholderImage;
  this.description = info.description
    ? info.description
    : 'No description available';
  this.id = info.industryIdentifiers
    ? `${info.industryIdentifiers[0].identifier}`
    : '';
}

function getBooks(request, response) {
  console.log('getting books');
  console.log(request.model);
  request.model
    .get()
    .then(data => {
      console.log('this is get books!', data);
      if (data[0].rows.rowCount === 0) {
        response.render('pages/searches/new');
      } else {
        response.render('pages/index', { books: data[0].rows });
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

function getBook(request, response) {
  request.model
    .get(request.params.id)
    .then(data => {
      response.render('pages/books/show', {
        book: data[0].rows[0],
        bookshelves: data[1].rows
      });
    })
    .catch(err => {
      err, response;
    });
}

function createBook(request, response) {
  request.model
    .post(request.body)
    .then(result => {
      console.log(result, 'thisis the resut!!');
      response.redirect(`/books/${result.rows[0].id}`);
    })
    .catch(err => {
      handleError(err, response);
    });
}

function updateBook(request, response) {
  request.model
    .put(request.body, request.params.id)
    .then(response.redirect(`/books/${request.params.id}`))
    .catch(err => handleError(err.response));
}

function deleteBook(request, response) {
  request.model
    .delete(request.params.id)
    .then(response.redirect('/'))
    .catch(err => handleError(err, response));
}

function handleError(error, response) {
  response.render('pages/error', { error: error });
}

module.exports = router;
