export async function convertUsdToBrl(amountInUsd) {
  try {
    const response = await fetch(
      'https://api.exchangerate-api.com/v4/latest/USD'
    );
    const data = await response.json();

    if (!data || !data.rates || !data.rates.BRL) {
      throw new Error('Failed to get BRL exchange rate');
    }

    const exchangeRate = data.rates.BRL;
    const amountInBrl = amountInUsd * exchangeRate;

    return amountInBrl.toFixed(2);
  } catch (error) {
    console.error('Error converting currency:', error);
    throw error;
  }
}
