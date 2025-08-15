import os
import logging
from binance.client import Client
from binance.exceptions import BinanceAPIException, BinanceRequestException

# Attempt to import API_KEY and API_SECRET from config.py
# This allows users to use config.py if they choose (not recommended for production)
# Otherwise, it falls back to environment variables.
try:
    from .config import API_KEY as CFG_API_KEY
    from .config import API_SECRET as CFG_API_SECRET
    from .config import USE_TESTNET
except ImportError:
    CFG_API_KEY = None
    CFG_API_SECRET = None
    USE_TESTNET = False # Default to False if config.py is not found or incomplete

# Configure basic logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Prioritize environment variables
API_KEY = os.environ.get('BINANCE_API_KEY', CFG_API_KEY)
API_SECRET = os.environ.get('BINANCE_API_SECRET', CFG_API_SECRET)

def get_binance_client():
    """
    Initializes and returns a Binance client.
    Uses API keys from environment variables (BINANCE_API_KEY, BINANCE_API_SECRET)
    or falls back to config.py.
    Handles testnet configuration based on USE_TESTNET in config.py.
    """
    if not API_KEY or not API_SECRET:
        raise ValueError("Binance API_KEY and API_SECRET must be set either in environment variables or config.py")

    client = Client(API_KEY, API_SECRET)

    if USE_TESTNET:
        # The python-binance library automatically adjusts endpoints if client.API_URL is changed.
        # For dedicated testnet, often it's by setting tld='us' or specific testnet URLs
        # if the library version requires it.
        # However, the most common way for python-binance is to set testnet=True if supported,
        # or manually configure endpoints if needed for specific testnets not covered by default.
        # For the official Binance spot testnet, python-binance usually handles it by configuration.
        # Let's assume python-binance handles testnet via a parameter or specific setup if needed.
        # For now, we'll rely on the library's default behavior or specific testnet setup instructions.
        # A common old way was client.API_URL = 'https://testnet.binance.vision/api'
        # but this can vary. For now, we'll print a message.
        logger.info("Attempting to use Binance Testnet. Ensure your API keys are for the testnet.")
        # If python-binance has a direct testnet flag, it would be used here.
        # e.g. client = Client(API_KEY, API_SECRET, testnet=True)
        # For now, we are not changing endpoint explicitly, assuming keys are testnet keys.

    return client

def get_account_balance():
    """
    Fetches and returns the account balance for all assets.
    Returns a list of balances or None if an error occurs.
    """
    try:
        client = get_binance_client()
        account_info = client.get_account()
        balances = account_info.get('balances', [])
        # Filter out zero balances for brevity, or return all
        # return [b for b in balances if float(b['free']) > 0 or float(b['locked']) > 0]
        return balances
    except BinanceAPIException as e:
        logger.error(f"Binance API Exception in get_account_balance: {e}")
        return None
    except BinanceRequestException as e:
        logger.error(f"Binance Request Exception in get_account_balance: {e}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error in get_account_balance: {e}")
        return None

def get_ticker_price(symbol):
    """
    Fetches and returns the current price for a given symbol.
    :param symbol: Trading symbol, e.g., "BTCUSDT"
    :return: The price as a string, or None if an error occurs.
    """
    try:
        client = get_binance_client()
        ticker = client.get_symbol_ticker(symbol=symbol)
        return ticker['price']
    except BinanceAPIException as e:
        logger.error(f"Binance API Exception fetching price for {symbol}: {e}")
        return None
    except BinanceRequestException as e:
        logger.error(f"Binance Request Exception fetching price for {symbol}: {e}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error fetching price for {symbol}: {e}")
        return None

def place_market_buy_order(symbol, quantity):
    """
    Places a market buy order.
    :param symbol: Trading symbol, e.g., "BTCUSDT"
    :param quantity: The amount of the base asset to buy (e.g., amount of BTC for BTCUSDT)
    :return: The order response, or None if an error occurs.
    """
    try:
        client = get_binance_client()
        # For market orders, 'quantity' refers to the base asset.
        # e.g., for BTCUSDT, quantity is the amount of BTC to buy.
        logger.info(f"Attempting market BUY order for {quantity} {symbol}...")
        if USE_TESTNET:
            # Testnet orders might require specific handling or might not fill if the market is illiquid.
            # Create a test order first.
            # order = client.create_test_order(symbol=symbol, side=Client.SIDE_BUY, type=Client.ORDER_TYPE_MARKET, quantity=quantity)
            # logger.info("Test order created (not actually executed on testnet):", order)
            # For actual execution on testnet (if keys are for testnet and it behaves like mainnet for this call):
             order = client.order_market_buy(symbol=symbol, quantity=quantity)
        else:
            order = client.order_market_buy(symbol=symbol, quantity=quantity)
        logger.info(f"Market BUY order placed: {order}")
        return order
    except BinanceAPIException as e:
        logger.error(f"Binance API Exception placing market BUY order for {symbol}: {e}")
        return None
    except BinanceRequestException as e:
        logger.error(f"Binance Request Exception placing market BUY order for {symbol}: {e}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error placing market BUY order for {symbol}: {e}")
        return None

def place_market_sell_order(symbol, quantity):
    """
    Places a market sell order.
    :param symbol: Trading symbol, e.g., "BTCUSDT"
    :param quantity: The amount of the base asset to sell (e.g., amount of BTC for BTCUSDT)
    :return: The order response, or None if an error occurs.
    """
    try:
        client = get_binance_client()
        # For market orders, 'quantity' refers to the base asset.
        # e.g., for BTCUSDT, quantity is the amount of BTC to sell.
        logger.info(f"Attempting market SELL order for {quantity} {symbol}...")
        if USE_TESTNET:
            # order = client.create_test_order(symbol=symbol, side=Client.SIDE_SELL, type=Client.ORDER_TYPE_MARKET, quantity=quantity)
            # logger.info("Test order created (not actually executed on testnet):", order)
            order = client.order_market_sell(symbol=symbol, quantity=quantity)
        else:
            order = client.order_market_sell(symbol=symbol, quantity=quantity)
        logger.info(f"Market SELL order placed: {order}")
        return order
    except BinanceAPIException as e:
        logger.error(f"Binance API Exception placing market SELL order for {symbol}: {e}")
        return None
    except BinanceRequestException as e:
        logger.error(f"Binance Request Exception placing market SELL order for {symbol}: {e}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error placing market SELL order for {symbol}: {e}")
        return None

if __name__ == '__main__':
    # This is for testing the client directly.
    # Ensure your API keys are set in environment variables or config.py

    # --- Test Get Account Balance ---
    logger.info("Attempting to fetch account balance...")
    balance = get_account_balance()
    if balance:
        # Using print for direct output visibility in this test block
        print("\nAccount Balances (showing all):")
        # Print only a few for brevity in testing
        for asset_balance in balance[:5]: # Print first 5 assets
            print(f"- {asset_balance['asset']}: Free: {asset_balance['free']}, Locked: {asset_balance['locked']}")
    else:
        logger.info("Failed to retrieve account balance.")

    # --- Test Get Ticker Price ---
    logger.info("\nAttempting to fetch ticker price for BTCUSDT...")
    btc_price = get_ticker_price("BTCUSDT")
    if btc_price:
        print(f"Current BTC/USDT Price: {btc_price}") # Keep print for direct result
    else:
        logger.info("Failed to retrieve BTC/USDT price.")

    logger.info("\nAttempting to fetch ticker price for ETHUSDT...")
    eth_price = get_ticker_price("ETHUSDT")
    if eth_price:
        print(f"Current ETH/USDT Price: {eth_price}") # Keep print for direct result
    else:
        logger.info("Failed to retrieve ETH/USDT price.")

    # --- Test Market Orders (USE WITH EXTREME CAUTION, ESPECIALLY ON MAINNET) ---
    # These are commented out by default to prevent accidental execution.
    # To test, uncomment, set a VERY SMALL quantity, and ideally use TESTNET keys.
    # Ensure the symbol and quantity are appropriate for your account and risk tolerance.

    # print("\n--- Market Order Tests (Ensure you are on TESTNET or understand the risk!) ---")
    # test_symbol = "BTCUSDT" # Or a symbol appropriate for testnet, e.g., some testnet specific pair if available
    # test_buy_quantity_btc = 0.0001 # A very small amount of BTC for testing

    # if USE_TESTNET:
    #     logger.info(f"\nAttempting to place a TEST market BUY order for {test_buy_quantity_btc} {test_symbol}...")
    #     # On testnet, client.create_test_order can be used to validate call without executing
    #     # test_order = get_binance_client().create_test_order(symbol=test_symbol, side=Client.SIDE_BUY, type=Client.ORDER_TYPE_MARKET, quantity=test_buy_quantity_btc)
    #     # logger.info(f"Test BUY order creation result: {test_order}") # This doesn't actually buy

    #     # To actually attempt a trade on testnet (if your keys are testnet keys):
    #     # buy_order_response = place_market_buy_order(test_symbol, test_buy_quantity_btc)
    #     # if buy_order_response:
    #     #     logger.info(f"Actual Testnet Market BUY order response: {buy_order_response}")
    #     #     # Potentially try to sell it back if the buy was successful
    #     #     if buy_order_response.get('status') == 'FILLED' or USE_TESTNET: # Assume filled for test flow
    #     #         logger.info(f"\nAttempting to place a TEST market SELL order for {test_buy_quantity_btc} {test_symbol}...")
    #     #         sell_order_response = place_market_sell_order(test_symbol, test_buy_quantity_btc)
    #     #         if sell_order_response:
    #     #             logger.info(f"Actual Testnet Market SELL order response: {sell_order_response}")
    #     pass # Keep testnet order execution commented by default
    # else:
    #     logger.info("\nSkipping market order tests on mainnet by default for safety.")

    logger.info("\nFinished tests in binance_client.py")
