<div align="center">
    <h1>Mealy</h1>
</div>

<br />

Mealy is a food ordering application that allows customers to browse available food and place orders, while giving food vendors a clear view of what their customers want to eat.

## Tech stack

- React + JavaScript + CSS + Vite Front-end
- <!-- Add back-end technology -->
- <!-- Add database -->
- <!-- Add other services or APIs -->

## Features

- **Food Ordering**: Customers can browse available food and place orders
- **Order Management**: Customers can view and manage their orders
- **Vendor Dashboard**: Food vendors can view incoming customer orders
- **Menu Management**: Vendors can manage the food available to customers
- **Order Details**: Vendors can see the items and quantities requested by each customer

## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/larrythuku18-lab/Mealy-Front---End-build-.git

cd Mealy-Front---End-build-

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at the URL provided by Vite in the terminal.

### Build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Application Flow

### Customer

1. Browse the available food
2. Select the food they want
3. Specify quantities and other required details
4. Place an order
5. View their order and its status

### Food Vendor

1. View incoming customer orders
2. See which food items customers have requested
3. Review order quantities and customer information
4. Manage the status of orders

## Project Structure

```text
.
├── README.md                    # Project documentation
├── package.json                 # Project dependencies and npm scripts
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript configuration
├── index.html                   # HTML entry point
└── src/                         # Front-end source code
    ├── main.tsx                 # React application entry point
    ├── App.tsx                  # Root application component
    ├── index.css                # Global application styles
    ├── components/              # Reusable React components
    ├── pages/                   # Application pages
    ├── assets/                  # Static assets such as images and icons
    └── ...
```

## Notes

- The customer interface is responsible for browsing food and submitting orders.
- The vendor interface is responsible for viewing and managing incoming orders.
- API endpoints and backend details should be added once the backend implementation is available.
