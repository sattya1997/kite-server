const axios = require("axios");
const { parse } = require("date-fns");

class KiteApp {
  // Products
  static PRODUCT_MIS = "MIS";
  static PRODUCT_CNC = "CNC";
  static PRODUCT_NRML = "NRML";
  static PRODUCT_CO = "CO";

  // Order types
  static ORDER_TYPE_MARKET = "MARKET";
  static ORDER_TYPE_LIMIT = "LIMIT";
  static ORDER_TYPE_SLM = "SL-M";
  static ORDER_TYPE_SL = "SL";

  // Varieties
  static VARIETY_REGULAR = "regular";
  static VARIETY_CO = "co";
  static VARIETY_AMO = "amo";

  // Transaction type
  static TRANSACTION_TYPE_BUY = "BUY";
  static TRANSACTION_TYPE_SELL = "SELL";

  // Validity
  static VALIDITY_DAY = "DAY";
  static VALIDITY_IOC = "IOC";

  // Exchanges
  static EXCHANGE_NSE = "NSE";
  static EXCHANGE_BSE = "BSE";
  static EXCHANGE_NFO = "NFO";
  static EXCHANGE_CDS = "CDS";
  static EXCHANGE_BFO = "BFO";
  static EXCHANGE_MCX = "MCX";

  constructor(enctoken) {
    this.enctoken = enctoken;
    this.headers = {
      Authorization: `enctoken ${this.enctoken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    };
    this.root_url = "https://kite.zerodha.com/oms";
  }

  async instruments(exchange = null) {
    try {
      const response = await axios.get("https://api.kite.trade/instruments");
      const data = response.data.split("\n");
      const instruments = [];

      for (let i = 1; i < data.length - 1; i++) {
        const row = data[i].split(",");
        if (exchange === null || exchange === row[11]) {
          instruments.push({
            instrument_token: parseInt(row[0]),
            exchange_token: row[1],
            tradingsymbol: row[2],
            name: row[3].slice(1, -1),
            last_price: parseFloat(row[4]),
            expiry: row[5] ? new Date(row[5]) : null,
            strike: parseFloat(row[6]),
            tick_size: parseFloat(row[7]),
            lot_size: parseInt(row[8]),
            instrument_type: row[9],
            segment: row[10],
            exchange: row[11],
          });
        }
      }
      return instruments;
    } catch (error) {
      throw new Error(`Failed to fetch instruments: ${error.message}`);
    }
  }

  async historical_data(
    instrument_token,
    from_date,
    to_date,
    interval,
    continuous = false,
    oi = false
  ) {
    try {
      const params = {
        from: from_date,
        to: to_date,
        interval: interval,
        continuous: continuous ? 1 : 0,
        oi: oi ? 1 : 0,
      };

      const response = await axios.get(
        `${this.root_url}/instruments/historical/${instrument_token}/${interval}`,
        { params, headers: this.headers }
      );

      return response.data.data.candles.map((candle) => {
        const record = {
          date: new Date(candle[0]),
          open: candle[1],
          high: candle[2],
          low: candle[3],
          close: candle[4],
          volume: candle[5],
        };
        if (candle.length === 7) {
          record.oi = candle[6];
        }
        return record;
      });
    } catch (error) {
      throw new Error(`Failed to fetch historical data: ${error.message}`);
    }
  }

  async margins() {
    try {
      const response = await axios.get(`${this.root_url}/user/margins`, {
        headers: this.headers,
      });
      return response.data.data;
    } catch (error) {
      throw new Error(`Failed to fetch margins: ${error.message}`);
    }
  }

  async quotes(name, exchange) {
    try {
      const response = await axios.get(`https://kite.zerodha.com/oms/quote?i=${exchange}:${name}`);
      return response.data;
    } catch (error) {
      console.log(`Failed to fetch quotes: ${error}`);
    }
  }

  async profile() {
    try {
      const response = await axios.get(`${this.root_url}/user/profile`, {
        headers: this.headers,
      });
      return response.data.data;
    } catch (error) {
      throw new Error(`Failed to fetch profile: ${error.message}`);
    }
  }

  async orders() {
    try {
      const response = await axios.get(`${this.root_url}/orders`, {
        headers: this.headers,
      });
      return response.data.data;
    } catch (error) {
      throw new Error(`Failed to fetch orders: ${error.message}`);
    }
  }

  async positions() {
    try {
      const response = await axios.get(`${this.root_url}/portfolio/positions`, {
        headers: this.headers,
      });
      return response.data.data;
    } catch (error) {
      throw new Error(`Failed to fetch positions: ${error.message}`);
    }
  }

  async place_order(
    variety,
    exchange,
    tradingsymbol,
    transaction_type,
    quantity,
    product,
    order_type,
    price = null,
    validity = null,
    disclosed_quantity = null,
    trigger_price = null,
    squareoff = null,
    stoploss = null,
    trailing_stoploss = null,
    tag = null
  ) {
    try {
      const params = {
        variety,
        exchange,
        tradingsymbol,
        transaction_type,
        quantity,
        product,
        order_type,
        price,
        validity,
        disclosed_quantity,
        trigger_price,
        squareoff,
        stoploss,
        trailing_stoploss,
        tag,
      };

      // Remove null values
      Object.keys(params).forEach(
        (key) => params[key] === null && delete params[key]
      );

      const response = await axios.post(
        `${this.root_url}/orders/${variety}`,
        params,
        { headers: this.headers }
      );
      return response.data.data.order_id;
    } catch (error) {
      throw new Error(`Failed to place order: ${error.message}`);
    }
  }

  async modify_order(
    variety,
    order_id,
    parent_order_id = null,
    quantity = null,
    price = null,
    order_type = null,
    trigger_price = null,
    validity = null,
    disclosed_quantity = null
  ) {
    try {
      const params = {
        parent_order_id,
        quantity,
        price,
        order_type,
        trigger_price,
        validity,
        disclosed_quantity,
      };

      // Remove null values
      Object.keys(params).forEach(
        (key) => params[key] === null && delete params[key]
      );

      const response = await axios.put(
        `${this.root_url}/orders/${variety}/${order_id}`,
        params,
        { headers: this.headers }
      );
      return response.data.data.order_id;
    } catch (error) {
      throw new Error(`Failed to modify order: ${error.message}`);
    }
  }

  async cancel_order(variety, order_id, parent_order_id = null) {
    try {
      const params = parent_order_id ? { parent_order_id } : {};
      const response = await axios.delete(
        `${this.root_url}/orders/${variety}/${order_id}`,
        { data: params, headers: this.headers }
      );
      return response.data.data.order_id;
    } catch (error) {
      throw new Error(`Failed to cancel order: ${error.message}`);
    }
  }
}

// Helper function to get enctoken
async function getEnctoken(userid, password, twofa) {
  try {
    const session = axios.create();

    // First login request
    const loginResponse = await session.post(
      "https://kite.zerodha.com/api/login",
      {
        user_id: userid,
        password: password,
      }
    );

    // Second 2FA request
    const twofaResponse = await session.post(
      "https://kite.zerodha.com/api/twofa",
      {
        request_id: loginResponse.data.data.request_id,
        twofa_value: twofa,
        user_id: loginResponse.data.data.user_id,
      }
    );

    const cookies = twofaResponse.headers["set-cookie"];
    const enctoken = cookies
      ?.find((cookie) => cookie.startsWith("enctoken="))
      ?.split(";")[0]
      .split("=")[1];

    if (!enctoken) {
      throw new Error("Enter valid details !!!!");
    }

    return enctoken;
  } catch (error) {
    throw new Error(`Failed to get enctoken: ${error.message}`);
  }
}

module.exports = {
  KiteApp,
  getEnctoken,
};
