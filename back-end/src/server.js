import express from "express";
import {
	cartItems as cartItemsRaw,
	products as productsRaw,
} from "./temp-data.js";

let cartItems = cartItemsRaw;
let products = productsRaw;

const app = express();

app.use(express.json());

app.get("/hello", (req, res) => {
	res.send("Hey yourself!");
});

app.get("/products", (req, res) => {
	res.json(products);
});

function populatedCartIds(ids) {
	return ids.map((id) => products.find((product) => product.id === id));
}

app.get("/cart", (req, res) => {
	res.json(populatedCartIds(cartItems));
});

app.get("/products/:productId", (req, res) => {
	const productId = req.params.productId;
	const product = products.find((product) => product.id === productId);
	res.json(product);
});

app.post("/cart", (req, res) => {
	cartItems.push(req.body.id);
	res.json(populatedCartIds(cartItems));
});

app.delete("/cart/:productId", (req, res) => {
	const productId = req.params.productId;
	cartItems = cartItems.filter((id) => id !== productId);
	res.json(populatedCartIds(cartItems));
});

app.listen(8000, () => {
	console.log("Server is listening on port 8000");
});
