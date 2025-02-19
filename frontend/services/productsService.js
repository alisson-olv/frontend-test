export async function getProducts(productName = '') {
  try {
    const response = await fetch(
      `http://localhost:5000/api/products/${productName}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error('Error fetching products:', error.message);
    return [];
  }
}
