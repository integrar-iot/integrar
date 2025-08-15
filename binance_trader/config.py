# Binance API Configuration
# Important: Do not commit your actual API keys to version control.
# It's recommended to use environment variables for your API keys.
#
# To use environment variables:
# 1. Set BINANCE_API_KEY and BINANCE_API_SECRET in your environment.
#    Example (in bash):
#    export BINANCE_API_KEY="your_api_key_here"
#    export BINANCE_API_SECRET="your_api_secret_here"
# 2. In binance_client.py, you would then use os.environ.get('BINANCE_API_KEY')
#
# If you absolutely must use this file for keys (NOT RECOMMENDED FOR PRODUCTION):
# 1. Fill in your keys below.
# 2. Ensure this file (config.py) is listed in your .gitignore file to prevent accidental commits.

API_KEY = "YOUR_API_KEY"  # Replace with your actual API key or load from environment
API_SECRET = "YOUR_API_SECRET" # Replace with your actual API secret or load from environment

# Optional: Set to True if you are using Binance Testnet
USE_TESTNET = False
# Testnet URLs (if you were to use them directly, though python-binance handles this)
# TESTNET_API_URL = "https://testnet.binance.vision/api"
