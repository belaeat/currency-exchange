interface Data {
  conversion_rates: Record<string, number>;
}

class FetchWrapper {
  baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  // get(endpoint: string): Promise<Data> {
  //   return fetch(this.baseURL + endpoint).then((response) => response.json());
  // }

  async get(endpoint: string): Promise<Data> {
    try {
      const response = await fetch(this.baseURL + endpoint);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  put(endpoint: string, body: any): Promise<any> {
    return this._send("put", endpoint, body);
  }

  post(endpoint: string, body: any): Promise<any> {
    return this._send("post", endpoint, body);
  }

  delete(endpoint: string, body: any): Promise<any> {
    return this._send("delete", endpoint, body);
  }

  _send(method: string, endpoint: string, body: any): Promise<any> {
    return fetch(this.baseURL + endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then((response) => response.json());
  }
}

//TODO
/* The goal of this project is to show the user the conversion rate between 2 currency pairs.
  The currency chosen on the left is the base currency and the currency chosen on the right is the target currency.
  The app starts at 1 USD = 1 USD.
  
  The API you need to use in this challenge is exchangerate-api.com.
  You can create a free account and browse the documentation.
  
  The free plan on this API allows you to perform 1,500 requests per month.
  Remember that every time you type in the editor, the browser preview will refresh,
  causing a new API request. In order not to exceed your limit, we recommend commenting out the
  fetch/FetchWrapper related code after you get it to work the first time. */

//Notes:
// Sign up for a free account on exchange <a href="https://www.exchangerate-api.com/">https://www.exchangerate-api.com/</a>
// Copy the example request
// Please check the documentation link, read Standard Requests documentation
// Sending a GET request to <a href="https://v6.exchangerate-api.com/v6/YOUR_API_KEY/latest/USD">https://v6.exchangerate-api.com/v6/YOUR_API_KEY/latest/USD</a>
// Above will give you exchange rate comapred to USD

// TODO: WRITE YOUR TYPESCRIPT CODE HERE

// A global variable that references the HTML select element with the id base-currency
// A global variable that stores the conversion rates for each currency pair as an array of arrays
// A global variable that references the HTML select element with the id target-currency
// A global variable that references the HTML paragraph element with the id conversion-result
// An instance of the FetchWrapper class with the base URL of the API
// A constant that stores the API key for authentication

// A call to the get method of the API instance with the endpoint that requests the latest conversion rates for the USD currency
// Assign the conversion_rates property of the response data to the rates variable

// Add an event listener to the base element that invokes the getConversionRates function when the user selects a new value
// base.addEventListener('change', getConversionRates);
// Add an event listener to the target element that invokes the getConversionRates function when the user selects a new value

// A function that performs the currency conversion and updates the UI

// Iterate over the rates array and find the rate that matches the target currency value
// If the currency name matches the target currency value
// Assign the conversion rate to the textContent property of the result element, which displays it on the web page

const baseCurrency = document.getElementById(
  "base-currency"
) as HTMLSelectElement;
const targetCurrency = document.getElementById(
  "target-currency"
) as HTMLSelectElement;

const api = new FetchWrapper("https://v6.exchangerate-api.com/v6/");
const API_key = "710f9c26aa72bb1730f5b178";

async function getConversionRates() {
  try {
    const data = await api.get(`${API_key}/latest/${baseCurrency.value}`);
    console.log("API Response:", data);

    // const rates = data.conversion_rates;

    // const rate = rates[targetCurrency.value];
  } catch (error) {
    console.log("Error:", error);
  }
}

baseCurrency.addEventListener("change", getConversionRates);
targetCurrency.addEventListener("change", getConversionRates);

getConversionRates();

document.addEventListener("DOMContentLoaded", function () {
  const baseCurrency = document.getElementById(
    "base-currency"
  )! as HTMLSelectElement;
  const targetCurrency = document.getElementById(
    "target-currency"
  )! as HTMLSelectElement;
  const amountInput = document.getElementById("amount")! as HTMLInputElement;
  const convertedAmount = document.getElementById(
    "converted-amount"
  )! as HTMLInputElement;
  const swapButton = document.getElementById("swap")! as HTMLButtonElement;
  const historyList = document.getElementById("history")! as HTMLUListElement;

  function convertCurrency() {
    if (!amountInput.value) return;
    const amount = parseFloat(amountInput.value) || 0;
    const from = baseCurrency.value;
    const to = targetCurrency.value;

    fetch(
      `https://v6.exchangerate-api.com/v6/710f9c26aa72bb1730f5b178/latest/${from}`
    )
      .then((response) => response.json())
      .then((data) => {
        const rate = data.conversion_rates[to];
        if (rate) {
          convertedAmount.value = (amount * rate).toFixed(2);
          addToHistory(amount, from, convertedAmount.value, to);
        }
      });
  }

  function addToHistory(
    amount: number,
    from: string,
    converted: string,
    to: string
  ) {
    if (!historyList) return;
    const listItem = document.createElement("li");
    listItem.textContent = `${amount} ${from} → ${converted} ${to}`;
    historyList.appendChild(listItem);
  }

  amountInput?.addEventListener("input", convertCurrency);
  convertedAmount?.addEventListener("input", () => {
    if (!convertedAmount.value) return;
    const converted = parseFloat(convertedAmount.value) || 0;
    const from = baseCurrency.value;
    const to = targetCurrency.value;

    fetch(
      `https://v6.exchangerate-api.com/v6/710f9c26aa72bb1730f5b178/latest/${to}`
    )
      .then((response) => response.json())
      .then((data) => {
        const rate = data.conversion_rates[from];
        if (rate) {
          amountInput.value = (converted * rate).toFixed(2);
          addToHistory(converted, to, amountInput.value, from);
        }
      });
  });

  swapButton?.addEventListener("click", () => {
    [baseCurrency.value, targetCurrency.value] = [
      targetCurrency.value,
      baseCurrency.value,
    ];
    convertCurrency();
  });
});
