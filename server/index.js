const agent = require('express');
const server = agent();
const path = require('path');

server.use((require('cors'))());
server.use(agent.json());

const data = require('./product.json');
const users = require('./users.json');

const fileSystem = require('fs/promises');

//Check User
server.post('/login',(req,res) => {
	if( req.body.username == undefined || req.body.password == undefined )
		return res.sendStatus(400);

	const foundUser = Object.values(users).find(user => user.username == req.body.username && user.password == req.body.password);

	if( foundUser == undefined ) {
		res.send(JSON.stringify({
			status: 'FAILED'
		}));
	}else {
		res.send(JSON.stringify({
			status: 'SUCCESS'
		}));
	}

	res.end();
});

//Create User
server.post('/register',async (req,res) => {
	if( req.body.name == undefined
	||	req.body.username == undefined
	||	req.body.password == undefined
	||	req.body.email == undefined
	||	req.body.phone == undefined
	) return res.sendStatus(400);

	const userSearch = Object.values(users).find(user => user.username == req.body.username || user.email == req.body.email);
	if( userSearch != undefined ) {
		res.send(JSON.stringify({
			'status': "EXISTS"
		}));
	}else {

		users[Object.keys(users).length] = {
			name: req.body.name,
			username: req.body.username,
			phone: req.body.phone,
			email: req.body.email,
			password: req.body.password
		};

		const usersFileHandler = await fileSystem.open(path.join(__dirname, 'users.json'),'r+');
		usersFileHandler.write(JSON.stringify(users));

		res.sendStatus(201);
	}

	res.end();
});

//All Products
server.get('/',(req,res) => {
	if( req.query['category'] === undefined ) {
		res.send({count: data.products.length,data: data.products});
	}else {
		if( /^[a-z]{1,15}$/i.test(req.query['category']) ) {
			const d = data.products.filter(product => product.category === req.query['category']);
		res.send({count: d.length, data: d});
		}
		else {
			res.sendStatus(403);
		}
	}
})

//Search Products
server.get('/search/:query',(req,res) => {
	const searchQuery = req.params['query'];
	if( !/[a-z]{1,20}/i.test(searchQuery) )
		return res.sendStatus(400);

	const resultData = data['products'].filter(product => product.name.toLowerCase().indexOf(searchQuery.toLowerCase()) != -1);

	res.send(JSON.stringify({
		count: resultData.length,
		data: resultData
	}));
});

//Single Product
server.get('/:productId',(req,res) => {
	const productId = Number(req.params['productId']);

	const productData = data['products'].find(product => product.id == productId);

	if( productData == undefined ) {
		res.sendStatus(404);
	}else {
		res.send(JSON.stringify(productData));
	}
});

server.listen(8000,() => {
  console.log('Server running on http://localhost:8000');
});
