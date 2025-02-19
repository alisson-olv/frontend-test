export async function getProducts() {
  const response = await fetch(
    'https://alphalabs.webdiet.com.br/api/products',
    {
      headers: {
        Authorization: process.env.API_KEY,
      },
    }
  );
  if (!response.ok) throw new Error('Failed to fetch products');
  const productResponse = await response.text();
  return JSON.parse(productResponse);
}
