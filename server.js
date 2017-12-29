
const express = require('express');
const app = express()
const path = require('path');
const bodyparser = require('body-parser');
const mongo = require('./mongodb');

const collectionName = 'gushi';

app.use('/', express.static(path.join(__dirname, 'public')))
app.use(bodyparser.json());

app.get("/api/poems", (req, res) => {
	mongo.find(collectionName)
		.then((data) => res.json(data))
		.catch((err) => res.json([]))
})

app.get("/api/poems/:id", (req, res) => {
	console.log(req.params.id)
	mongo.find(collectionName, {text: req.params.id})
		.then((data) => {
			res.json(data && data !== undefined && data.length > 0 ? 'Found' : 'Not Found')
		})
		.catch((err) => res.json('Not Found'))
})

app.post("/api/poems", (req, res) => {
	mongo.create(collectionName, req.body)
		.then((data) => res.json({ result: 'success' }))
		.catch((err) => res.json({ result: 'fail' }))
})
