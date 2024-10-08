import express from 'express';
import path from 'path';
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

	await client.connect();
	const db = client.db(DB_NAME);

	const app = express();
	app.use(express.json());

	app.use('/images', express.static(path.join(__dirname, '../assets')));

	app.use(
		express.static(path.resolve(__dirname, '../dist'), {
			maxAge: '1y',
			etag: false
		})
	);

	app.get('/api/products', async (req, res) => {
		const products = await db.collection('products').find({}).toArray();
		res.json(products);
	});

	async function populatedCartIds(ids) {
		return Promise.all(
			ids.map((id) => db.collection('products').findOne({ id }))
		);
	}

	app.get('/api/users/:userId/cart', async (req, res) => {
		const user = await db
			.collection('users')
			.findOne({ id: req.params.userId });
		res.json(await populatedCartIds(user?.cartItems || []));
	});

	app.get('/api/products/:productId', async (req, res) => {
		const productId = req.params.productId;
		const product = await db.collection('products').findOne({ id: productId });
		res.json(product);
	});

	app.post('/api/users/:userId/cart', async (req, res) => {
		const userId = req.params.userId;
		const productId = req.body.id;
		const existingUser = await db.collection('users').findOne({ id: userId });

		if (!existingUser) {
			await db.collection('users').insertOne({ id: userId, cartItems: [] });
		}

		await db.collection('users').updateOne(
			{ id: userId },
			{
				$push: { cartItems: productId }
			}
		);
		const user = await db.collection('users').findOne({ id: userId });
		res.json(await populatedCartIds(user?.cartItems || []));
	});

	app.delete('/api/users/:userId/cart/:productId', async (req, res) => {
		const userId = req.params.userId;
		const productId = req.params.productId;
		await db.collection('users').updateOne(
			{ id: userId },
			{
				$pull: { cartItems: productId }
			}
		);
		const user = await db.collection('users').findOne({ id: userId });
		res.json(await populatedCartIds(user?.cartItems || []));
	});

	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname, '../dist/index.html'));
	});

	const port = process.env.PORT || 8000;

	app.listen(port, () => {
		console.log('Server is listening on port ' + port);
	});
}

start();
