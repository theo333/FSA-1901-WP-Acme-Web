// app layer

const express = require('express');

const db = require('./db');

const app = express();
module.exports = app;

app.use((req, res, next) => {
	db.getPages()
		// attaches pages to req obj
		.then( pages => {
			req.pages = pages;
			next();
		})
		.catch(next);
});

app.get('/', (req, res, next) => {
	// stopped here
	// create a header string outside of here (put in views folder) that  checks if is_home_page and redirects to that by default
});

app.get('/pages/:id', (req, res, next) => {
	// pull in header
	// need to pull in pages info and content info where pages.id = content.page_id
	// loop through content array - create content_block string outside of here (?)
});