import express from 'express';
import { MongoClient } from 'mongodb';

require('dotenv').config({ path: './.env' });

const DB_NAME = 'linkedin-full-stack';
const MONGO_PW = process.env.mongoPassword;

async function start() {
	const client = new MongoClient(
		`mongodb+srv://vmaldosan:` +
			MONGO_PW +
			`@cluster0.ftmqp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
	);

	const app = express();

	await client.connect();
	const db = client.db(DB_NAME);
	app.use(express.json());

	app.get('/products', async (req, res) => {
		const products = await db.collection('products').find({}).toArray();
		res.json(products);
	});

	async function populatedCartIds(ids) {
		return Promise.all(
			ids.map((id) => db.collection('products').findOne({ id }))
		);
	}

	app.get('/users/:userId/cart', async (req, res) => {
		const user = await db
			.collection('users')
			.findOne({ id: req.params.userId });
		res.json(await populatedCartIds(user.cartItems));
	});

	app.get('/products/:productId', async (req, res) => {
		const productId = req.params.productId;
		const product = await db.collection('products').findOne({ id: productId });
		res.json(product);
	});

	app.post('/users/:userId/cart', async (req, res) => {
		const userId = req.params.userId;
		const productId = req.body.id;
		db.collection('users').updateOne(
			{ id: userId },
			{
				$push: { cartItems: productId },
			}
		);
		const user = await db.collection('users').findOne({ id: userId });
		res.json(await populatedCartIds(user.cartItems));
	});

	app.delete('/cart/:productId', (req, res) => {
		const productId = req.params.productId;
		cartItems = cartItems.filter((id) => id !== productId);
		res.json(populatedCartIds(cartItems));
	});

	app.listen(8000, () => {
		console.log('Server is listening on port 8000');
	});
}

start();
