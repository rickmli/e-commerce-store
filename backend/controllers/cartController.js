import Product from "../models/Product.js";

export const getCartItems = (req, res) => {
  const user = req.user;
  res.json(user.cartItems);
};

export const addToCart = async (req, res) => {
  const { id: productId } = req.params;
  const user = req.user;

  const databaseProduct = await Product.findById(productId);
  if (!databaseProduct) {
    const error = new Error("Product not found in database");
    error.status = 404;
    throw error;
  }

  const cartItem = user.cartItems.find((item) =>
    item.product.equals(productId)
  );
  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    user.cartItems.push({ product: productId, quantity: 1 });
  }

  await user.save();
  res.status(200).json(user.cartItems);
};

export const removeFromCart = async (req, res) => {
  const { id: productId } = req.params;
  const user = req.user;
  const updatedCartItems = user.cartItems.filter(
    (item) => !item.product.equals(productId)
  );
  user.cartItems = updatedCartItems;
  await user.save();
  res.status(200).json(user.cartItems);
};

export const removeAllFromCart = async (req, res) => {
  const user = req.user;
  user.cartItems = [];
  await user.save();
  res.status(200).json([]);
};

export const updateQuantity = async (req, res) => {
  const { id: productId } = req.params;
  const { quantity } = req.body;
  const user = req.user;

  const databaseItem = await Product.findById(productId);
  if (!databaseItem) {
    const error = new Error("Product not found in database");
    error.status = 404;
    throw error;
  }

  const cartItem = cartItems.find((item) => item.product.equals(productId));

  if (cartItem.quantity === 0) {
    const updatedCartItems = user.cartItems.filter(
      (item) => !item.product.equals(productId)
    );
    user.cartItems = updatedCartItems;
  } else {
    cartItem.quantity = quantity;
  }

  await user.save();
  res.status(200).json(user.cartItems);
};
