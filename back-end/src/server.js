import express from 'express';
import { MongoClient } from 'mongodb';
import {
	cartItems as cartItemsRaw,
	products as productsRaw,
} from './temp-data.js';

const DB_NAME = 'linkedin-full-stack';
require('dotenv').config({ path: './.env' });
const MONGO_PW = process.env.mongoPassword;

let cartItems = cartItemsRaw;
let products = productsRaw;

const client = new MongoClient(
	`mongodb+srv://vmaldosan:` +
		MONGO_PW +
		`@cluster0.ftmqp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
);

const app = express();

app.use(express.json());

app.get('/products', async (req, res) => {
	await client.connect();
	const db = client.db(DB_NAME);
	const products = await db.collection('products').find({}).toArray();
	res.json(products);
});

async function populatedCartIds(ids) {
	await client.connect();
	const db = client.db(DB_NAME);
	return Promise.all(
		ids.map((id) => db.collection('products').findOne({ id }))
	);
}

app.get('/users/:userId/cart', async (req, res) => {
	await client.connect();
	const db = client.db(DB_NAME);
	const user = await db.collection('users').findOne({ id: req.params.userId });
	res.json(await populatedCartIds(user.cartItems));
});

app.get('/products/:productId', async (req, res) => {
	const productId = req.params.productId;
	const product = products.find((product) => product.id === productId);
	res.json(product);
});

app.post('/cart', (req, res) => {
	cartItems.push(req.body.id);
	res.json(populatedCartIds(cartItems));
});

app.delete('/cart/:productId', (req, res) => {
	const productId = req.params.productId;
	cartItems = cartItems.filter((id) => id !== productId);
	res.json(populatedCartIds(cartItems));
});

app.listen(8000, () => {
	console.log('Server is listening on port 8000');
});
