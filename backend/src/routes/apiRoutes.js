import express from 'express';
import { getProducts } from '../services/productService.js';
import { getAddressByCep } from '../services/cepService.js';

const router = express.Router();

router.get('/products/:productName?', async (req, res) => {
  try {
    const { productName } = req.params;
    const products = await getProducts(productName);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.get('/cep/:cep', async (req, res) => {
  try {
    const { cep } = req.params;
    const address = await getAddressByCep(cep);
    res.json(address);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch address' });
  }
});

export default router;
