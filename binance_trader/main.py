import argparse
import sys
from binance_trader import binance_client # Use absolute import from package

def main():
    parser = argparse.ArgumentParser(description="Simple Binance Trading CLI")
    parser.add_argument('--config-path', help='Path to the directory containing config.py if not in the same directory as binance_client.py. Not typically needed with current structure.')

    subparsers = parser.add_subparsers(dest='command', help='Available commands')
    subparsers.required = True

    # Command: balance
    balance_parser = subparsers.add_parser('balance', help='Fetch account balance for all assets.')
    balance_parser.add_argument('--filter-zero', action='store_true', help='Only show assets with a non-zero balance.')

    # Command: price
    price_parser = subparsers.add_parser('price', help='Get the current price for a trading pair.')
    price_parser.add_argument('symbol', type=str, help='Trading symbol (e.g., BTCUSDT)')

    # Command: buy
    buy_parser = subparsers.add_parser('buy', help='Place a market BUY order (USE WITH CAUTION).')
    buy_parser.add_argument('symbol', type=str, help='Trading symbol (e.g., BTCUSDT)')
    buy_parser.add_argument('quantity', type=float, help='Amount of the base asset to buy (e.g., for BTCUSDT, amount of BTC)')
    buy_parser.add_argument('--confirm', action='store_true', help='Confirm order execution (required for safety).')

    # Command: sell
    sell_parser = subparsers.add_parser('sell', help='Place a market SELL order (USE WITH CAUTION).')
    sell_parser.add_argument('symbol', type=str, help='Trading symbol (e.g., BTCUSDT)')
    sell_parser.add_argument('quantity', type=float, help='Amount of the base asset to sell (e.g., for BTCUSDT, amount of BTC)')
    sell_parser.add_argument('--confirm', action='store_true', help='Confirm order execution (required for safety).')

    args = parser.parse_args()

    # If config_path is provided, try to add it to sys.path
    # This is an advanced and somewhat fragile way to handle module resolution.
    # It's generally better if the project structure and PYTHONPATH are set up correctly.
    if args.config_path:
        sys.path.insert(0, args.config_path)

    # Re-import binance_client if config_path was set, to ensure it picks up the correct config
    # This is a bit of a hack. A better solution would be to pass config values directly or have a more robust config loading mechanism.
    # For this example, we assume binance_client.py can find its config.py via Python's import mechanisms.
    # from binance_trader import binance_client # Already imported, but if path changes, re-eval might be needed.

    if args.command == 'balance':
        print("Fetching account balance...")
        balances = binance_client.get_account_balance()
        if balances:
            print("\nAccount Balances:")
            for b in balances:
                free = float(b['free'])
                locked = float(b['locked'])
                if args.filter_zero and free == 0 and locked == 0:
                    continue
                print(f"- {b['asset']}: Free: {b['free']}, Locked: {b['locked']}")
        else:
            print("Could not retrieve account balance.")

    elif args.command == 'price':
        print(f"Fetching price for {args.symbol}...")
        price = binance_client.get_ticker_price(args.symbol.upper())
        if price:
            print(f"Price for {args.symbol.upper()}: {price}")
        else:
            print(f"Could not retrieve price for {args.symbol.upper()}.")

    elif args.command == 'buy':
        if not args.confirm:
            print("ERROR: You must use --confirm to execute a BUY order.")
            print("Example: python main.py buy BTCUSDT 0.001 --confirm")
            return
        print(f"ATTENTION: Preparing to place a MARKET BUY order for {args.quantity} of {args.symbol.upper()}.")
        print("This will use real funds if your API keys are for the mainnet.")
        user_confirmation = input("Type 'yes' to proceed, anything else to cancel: ")
        if user_confirmation.lower() == 'yes':
            order_response = binance_client.place_market_buy_order(args.symbol.upper(), args.quantity)
            if order_response:
                print(f"BUY order response: {order_response}")
            else:
                print("BUY order failed or no response.")
        else:
            print("BUY order cancelled by user.")

    elif args.command == 'sell':
        if not args.confirm:
            print("ERROR: You must use --confirm to execute a SELL order.")
            print("Example: python main.py sell BTCUSDT 0.001 --confirm")
            return
        print(f"ATTENTION: Preparing to place a MARKET SELL order for {args.quantity} of {args.symbol.upper()}.")
        print("This will use real funds if your API keys are for the mainnet.")
        user_confirmation = input("Type 'yes' to proceed, anything else to cancel: ")
        if user_confirmation.lower() == 'yes':
            order_response = binance_client.place_market_sell_order(args.symbol.upper(), args.quantity)
            if order_response:
                print(f"SELL order response: {order_response}")
            else:
                print("SELL order failed or no response.")
        else:
            print("SELL order cancelled by user.")

if __name__ == '__main__':
    # To make binance_trader.binance_client importable,
    # we need to ensure the parent directory of 'binance_trader' is in sys.path
    # when running main.py directly, if 'binance_trader' is not installed as a package.
    # This is often handled by running as a module: python -m binance_trader.main
    # Or by setting PYTHONPATH.
    # For simplicity in direct execution (python binance_trader/main.py):
    if __package__ is None or __package__ == '': # Script run directly
        import os
        # Add the directory containing 'binance_trader' to the Python path
        # This assumes main.py is inside 'binance_trader'
        project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        if project_root not in sys.path:
            sys.path.insert(0, project_root)

        # Now attempt the import again, it should work if structure is root/binance_trader/main.py
        # and root/binance_trader/binance_client.py
        from binance_trader import binance_client

    main()
