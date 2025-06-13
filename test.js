const { KiteApp } = require('./helper');

async function main() {
    try {
        // Get enctoken
        const enctoken = "KQmu3oh6Og5899HgReR2hsZNU3Fn2jHpTUK4TT1rYVeADX8HLuwDu3B/1e5d4iBMuV41jSBLuadsTXznv1tdBYTtz91IWqon7gOkEib1mIqVFi4gnCbWww=="
        
        // Initialize KiteApp
        const kite = new KiteApp(enctoken);
        
        // Use any of the methods
        const profile = await kite.profile();
        console.log(profile);
        
        // Place an order
        // const orderId = await kite.place_order(
        //     KiteApp.VARIETY_REGULAR,
        //     KiteApp.EXCHANGE_NSE,
        //     'RELIANCE',
        //     KiteApp.TRANSACTION_TYPE_BUY,
        //     1,
        //     KiteApp.PRODUCT_MIS,
        //     KiteApp.ORDER_TYPE_MARKET
        // );
        //console.log('Order placed:', orderId);
    } catch (error) {
        console.error('Error:', error.message);
    }
}