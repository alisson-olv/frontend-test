export async function getProducts(productName = '') {
  const url = productName
    ? `https://alphalabs.webdiet.com.br/api/products?keyword=${productName}`
    : 'https://alphalabs.webdiet.com.br/api/products';

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: process.env.API_KEY,
      },
    });

    if (!response.ok) {
      console.error(
        'Error fetching products:',
        response.status,
        response.statusText
      );
      throw new Error('Failed to fetch products');
    }

    const productResponse = await response.text();
    const responseCep = JSON.parse(productResponse);

    const productsWithState = await Promise.all(
      responseCep.items.map(async (item) => {
        try {
          const cepResponse = await fetch(
            `https://viacep.com.br/ws/${item.cep}/json/`
          );
          const cepData = await cepResponse.json();

          if (cepData.erro) {
            console.error(`CEP ${item.cep} not found!`);
            item.state = 'State not found';
          } else {
            item.state = cepData.uf;
          }
        } catch (error) {
          console.error(`Error fetching CEP ${item.cep}:`, error);
          item.state = 'Error fetching state';
        }

        return item;
      })
    );

    return { ...responseCep, items: productsWithState };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { error: error.message };
  }
}
