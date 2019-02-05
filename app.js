// app layer
const express = require('express');
const db = require('./db');

const app = express();
module.exports = app;

app.use((req, res, next) => {
	db.getPages()
		// attaches pages to req obj so can use in app.get below
		.then( pages => {
			req.pages = pages;
			next();
		})
		.catch(next);
});

// ** ?? can you do this 
// app.use((res, req, next) => {
// 	db.getContentForPage(page_id)  // ?? how to pass page_id into this?
// 		.then( pageContent => {
// 			req.pageContent = pageContent;
// 			next();
// 		})
// 		.catch(next);
// });

app.get('/', (req, res, next) => {
	// grab home page obj
	const homePage = req.pages.filter( page => page.is_home_page === true)[0];
	// redirect to home page
	res.redirect(`/pages/${homePage.id}`);
});

app.get('/pages/:id', (req, res, next) => {
	db.getContentForPage(req.params.id)
		// .then( page => res.send(page))  // array of page content
		.then( page => res.send(`
			<!DOCTYPE html>
			<html>
				<head>
					<link rel='stylesheet' type='text/css' href='https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css'/>
				</head>
				<body>
					<div class='container'>
						<header style='margin-bottom: 20px;'>
							<div>
								<a style='color: black; font-size: 2.5em;' href='/pages/1'>Acme Web</a>
							</div>
							<nav>
								<ul class='nav nav-tabs'>
									${ req.pages.map( page => {
										return `									
										<li class='nav-item'>
											<a class='nav-link ${page.id == req.params.id ? 'active' : ''}' href='/pages/${page.id}'>
												${page.name}
											</a>
										</li>
										`;
									}).join('')}
								</ul>
							</nav>
						</header>
						<main>
							<h1>${req.pages.filter( page => page.id == req.params.id)[0].name}</h1>
							<section>
								${ page.map( content_parts => {
									return `
										<h2>${content_parts.header_title}</h2>
										<p>${content_parts.body}</p>
									`;
								}).join('')}								
							</section>
						</main>
					</div>
				</body>
			</html>
		`))
		.catch(next);
});