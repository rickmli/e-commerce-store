import Product from "../models/Product.js";
import {
  deleteImageFromCloudinary,
  uploadImageToCloudinary,
} from "../services/cloudinaryService.js";
import {
  getFeaturedProductsFromRedis,
  storeFeaturedProductsToRedis,
} from "../services/redisService.js";

export const getAllProducts = async (req, res) => {
  const products = await Product.find();
  res.status(200).json(products);
};

export const getFeaturedProducts = async (req, res) => {
  let featuredProducts = await getFeaturedProductsFromRedis();
  if (featuredProducts) {
    return res.json(JSON.parse(featuredProducts));
  }

  // if not in redis, fetch from mongodb
  // .lean() is gonna return a plain javascript object instead of a mongodb document
  // which is good for performance
  featuredProducts = await Product.find({ isFeatured: true }).lean();

  if (!featuredProducts) {
    const error = new Error("No featured products found");
    error.status = 404;
    throw error;
  }

  // store in redis for future quick access

  await storeFeaturedProductsToRedis(JSON.stringify(featuredProducts));

  res.status(200).json(featuredProducts);
};

export const getRecommendedProducts = async (req, res) => {
  const products = await Product.aggregate([
    {
      $sample: { size: 4 },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        image: 1,
        price: 1,
      },
    },
  ]);

  res.json(products);
};

export const createProduct = async (req, res) => {
  const { name, description, price, image, category } = req.body;

  let cloudinaryResponse = null;
  if (image) {
    cloudinaryResponse = await uploadImageToCloudinary(image, "products");
  }

  const product = await Product.create({
    name,
    description,
    price,
    image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
    category,
  });

  res.status(201).json(product);
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    const error = new Error("Product not found");
    error.status = 404;
    throw error;
  }

  const { image } = product;
  if (image) {
    try {
      await deleteImageFromCloudinary(image, "products");
      console.log("Deleted image from cloudinary's products folder");
    } catch (error) {
      console.log("error deleting image from cloudinary's products folder");
    }
  }

  await Product.findByIdAndDelete(id);

  res.status(204).send();
};

export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  const products = await Product.find({ category });
  res.json({ products });
};

export const toggleFeaturedProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (product) {
    product.isFeatured = !product.isFeatured;
    const updatedProduct = await product.save();
    await updateFeaturedProductsCache();
    res.json(updatedProduct);
  } else {
    const error = new Error("Product not found");
    error.status = 404;
    throw error;
  }
};

async function updateFeaturedProductsCache() {
  const featuredProducts = await Product.find({ isFeatured: true }).lean();
  await storeFeaturedProductsToRedis(JSON.stringify(featuredProducts));
}
