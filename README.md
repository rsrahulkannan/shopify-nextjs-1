# Shopify Store

A simple Shopify storefront application with product listing, filtering, pagination, cart management, and checkout functionality.

## Installation

Follow these steps to set up the project:

1. **Download the ZIP file** and extract it.
2. Open a terminal and navigate to the project directory:
   ```bash
   cd your_project_directory
   ```
3. Install the dependencies using npm:
   ```bash
    npm install
   ```

## Configuration

1. Copy the env_demo file and rename it to .env.local:
   ```bash
   cp .env_demo .env.local
   ```
2. Open .env.local and update the required details:
- Storefront API Key
- Store URL
- Site URL
- Site Title
- Site Description

## Running the Development Server

1. Start the server using the following command:
   ```bash
    npm run dev
   ```
2. Once the server is running, open your browser and navigate to the provided local URL.

## Features

### Product Listing

- View a list of products with pagination.
- Use the filter options in the navbar to refine product searches.
- Click the Add to Cart button to add a product to the cart.

### Product Detail View

- Click on a product image or name to view detailed information.
- The detail view includes an Add to Cart button.

### Cart Management

- Click the Cart Icon in the navbar to view the cart.
- Update product quantities or remove items from the cart.
- Proceed to checkout, which redirects to the Shopify checkout page.

### Localization

- The application supports internationalization using i18n for multi-language support.

### Deployment

- To deploy the application, follow the recommended steps based on your hosting provider.