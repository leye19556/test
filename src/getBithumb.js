export let ticker3 = {};
export let 
export const getBithumb = async () => {
  try {
    const {
      data: { data },
    } = await axios.get("https://api.bithumb.com/public/ticker/ALL");
    Object.keys(data).forEach((coin) => {
      tickers3[coin] = data[coin].closing_price;
    });
    setTimeout(() => {
      getBithumb();
    }, 2000);
  } catch (e) {
    console.log(e);
  }
};
