# Binance Trading CLI

This Python application provides a simple command-line interface (CLI) to interact with your Binance account for trading. It allows you to check balances, fetch market prices, and execute market buy/sell orders.

**DISCLAIMER: Trading cryptocurrencies involves significant risk. This tool can execute real trades using your Binance API keys. Use with extreme caution, especially the `buy` and `sell` commands. It is highly recommended to use testnet API keys for initial testing or understand the risks thoroughly before using mainnet keys. The developers of this tool are not responsible for any financial losses.**

## Features

*   Check account balances for all assets.
*   Filter balances to show only non-zero assets.
*   Fetch current market prices for any trading pair.
*   Place market buy orders (with multiple confirmations for safety).
*   Place market sell orders (with multiple confirmations for safety).

## Project Structure

*   `main.py`: The main CLI entry point.
*   `binance_client.py`: Handles all interactions with the Binance API.
*   `config.py`: Used for API key configuration (though environment variables are recommended).
*   `requirements.txt`: Lists necessary Python dependencies.

## Setup

1.  **Clone the Repository (if applicable):**
    If you haven't already, clone the repository where this tool is located.

2.  **Navigate to the Directory:**
    ```bash
    cd path/to/your_repo/binance_trader
    ```

3.  **Create a Python Virtual Environment (Recommended):**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

4.  **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

5.  **Configure API Keys (IMPORTANT):**
    You need to provide your Binance API Key and Secret Key. The recommended method is using environment variables:
    ```bash
    export BINANCE_API_KEY="your_api_key_here"
    export BINANCE_API_SECRET="your_api_secret_here"
    ```
    Alternatively, you can modify the `config.py` file directly:
    ```python
    # In binance_trader/config.py
    API_KEY = "your_api_key_here"
    API_SECRET = "your_api_secret_here"
    ```
    **If you use `config.py` directly, make ABSOLUTELY SURE it is added to your `.gitignore` file to prevent accidentally committing your keys.** The application will prioritize environment variables if both are set.

    **For Testnet:**
    If you want to use the Binance Testnet:
    *   Make sure your API keys are generated from the [Binance Spot Testnet](https://testnet.binance.vision/).
    *   Set `USE_TESTNET = True` in `config.py`.

## Usage

Run the CLI from within the `binance_trader` directory (or ensure the `binance_trader` parent directory is in your `PYTHONPATH`).

**General Syntax:**
```bash
python main.py <command> [options]
```
Or, if `binance_trader`'s parent directory is in `PYTHONPATH` or `binance_trader` is installed:
```bash
python -m binance_trader.main <command> [options]
```

**Available Commands:**

*   **Check Balance:**
    ```bash
    python main.py balance
    ```
    To show only non-zero balances:
    ```bash
    python main.py balance --filter-zero
    ```

*   **Get Price:**
    ```bash
    python main.py price <SYMBOL>
    # Example:
    python main.py price BTCUSDT
    ```

*   **Market Buy Order (USE WITH EXTREME CAUTION):**
    Requires `--confirm` flag and interactive confirmation.
    ```bash
    python main.py buy <SYMBOL> <QUANTITY> --confirm
    # Example: Buy 0.001 BTC using USDT
    python main.py buy BTCUSDT 0.001 --confirm
    ```
    The tool will ask for a final 'yes' confirmation before placing the order.

*   **Market Sell Order (USE WITH EXTREME CAUTION):**
    Requires `--confirm` flag and interactive confirmation.
    ```bash
    python main.py sell <SYMBOL> <QUANTITY> --confirm
    # Example: Sell 0.001 BTC for USDT
    python main.py sell BTCUSDT 0.001 --confirm
    ```
    The tool will ask for a final 'yes' confirmation before placing the order.

## Development Notes

*   The `binance_client.py` contains functions for interacting with the Binance API. It uses the `python-binance` library.
*   Logging is implemented using Python's `logging` module. Messages are printed to the console.
*   Error handling is included for API calls, but always ensure your inputs (like symbols and quantities) are correct.

## Disclaimer

Ensure you understand the risks involved in trading and using API keys. Test thoroughly with small amounts or on the testnet before committing significant funds. The creators are not liable for any losses incurred.
