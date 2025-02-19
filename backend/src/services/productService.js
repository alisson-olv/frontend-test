import { convertUsdToBrl } from './currencyService.js';

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
        if (item.pricing) {
          if (item.pricing.price_usd) {
            item.pricing.price_brl = await convertUsdToBrl(
              parseFloat(
                item.pricing.price_usd.replace('$', '').replace(',', '')
              )
            );
          }

          if (item.pricing.discount) {
            item.pricing.discount_brl = await convertUsdToBrl(
              parseFloat(item.pricing.discount)
            );
            item.pricing.final_price_brl = parseFloat(
              item.pricing.price_brl - item.pricing.discount_brl
            ).toFixed(2);
          }
        }

        try {
          const cepResponse = await fetch(
            `https://viacep.com.br/ws/${item.cep}/json/`
          );
          const cepData = await cepResponse.json();

          if (cepData.erro) {
            console.error(`CEP ${item.cep} not found!`);
            item.state = 'Erro não encontrado';
          } else {
            item.state = cepData.uf;
          }
        } catch (error) {
          console.error(`Error fetching CEP ${item.cep}:`, error);
          item.state = 'Erro ao buscar o estado';
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
