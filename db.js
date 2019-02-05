// data layer
const pg = require('pg');
const client = new pg.Client('postgres://localhost/acme_web_db');

const getPages = () => {
	// returns array of page objs
	return client.query('SELECT * FROM pages') 
		.then(response => response.rows)
		.catch( ex => console.log(ex));
}

const getContentForPage = (pageId) => {
	// returns array of content objs for a specified page
	return client.query('SELECT * FROM content WHERE page_id=$1', [ pageId ])  
		.then( response => response.rows)
		.catch( ex => console.log(ex));

}

// seeds db
const sync = () => {
	return client.query(SEED);
}

const SEED = `
	DROP TABLE IF EXISTS content;
	DROP TABLE IF EXISTS pages;
	CREATE TABLE pages(
		id SERIAL PRIMARY KEY,
		name VARCHAR(50),
		is_home_page BOOLEAN
	);
	CREATE TABLE content(
		id SERIAL PRIMARY KEY,
		header_title VARCHAR(50),
		body VARCHAR(255),
		page_id INTEGER REFERENCES pages(id)
	);

	INSERT INTO pages(name, is_home_page) VALUES('Home', TRUE);
	INSERT INTO pages(name, is_home_page) VALUES('Employees', FALSE);
	INSERT INTO pages(name, is_home_page) VALUES('Contact', FALSE);

	INSERT INTO content(header_title, body, page_id) VALUES('Welcome to the Home Page', 'So looking forward to having you browser our site', 1);

	INSERT INTO content(header_title, body, page_id) VALUES('Moe', 'Moe is our CEO!!!', 2);
	INSERT INTO content(header_title, body, page_id) VALUES('Larry', 'Larry is our CTO!!!', 2);
	INSERT INTO content(header_title, body, page_id) VALUES('Curly', 'Curly is the COO!!!', 2);

	INSERT INTO content(header_title, body, page_id) VALUES('Phone', 'calls us 212-555-1212', 3);
	INSERT INTO content(header_title, body, page_id) VALUES('Fax', 'fax us 212-555-1212', 3);
`;

client.connect()
	// ** used for dev & troubleshooting
	// .then(() => console.log('seeded'))
	// .then( () => getPages())
	// .then( pages => console.log(pages.rows))
	// .then( () => getContentForPage(3))
	// .then( content => console.log(content.rows)) 
	.catch( ex => console.log(ex));

module.exports = {
	getPages,
	getContentForPage,
	sync
};