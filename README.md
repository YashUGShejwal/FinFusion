# FinFusion 📊

**Investment Portfolio Tracker**

A modern, privacy-focused portfolio management tool that helps you track your investments across multiple apps with beautiful visualizations and comprehensive analytics.

![FinFusion Screenshot](https://via.placeholder.com/800x400/6366f1/ffffff?text=FinFusion+Dashboard)

## 🔒 Privacy First

**Your data stays with you!** FinFusion stores all your financial data locally in JSON files on your machine. No external servers, no data collection, no privacy concerns. Your investment information never leaves your computer.

## ✨ Features

- **📈 Multi-App Portfolio Tracking** - Track investments across different platforms (Zerodha, Groww, ETMoney, etc.)
- **📊 Beautiful Analytics** - Interactive pie charts and line graphs showing portfolio trends
- **💰 Comprehensive Metrics** - Net investment, current value, returns (absolute & percentage)
- **🔍 Advanced Filtering** - Filter by apps, date ranges, and custom criteria
- **📱 Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **🎨 Modern UI** - Clean, intuitive interface with glass-morphism design
- **📅 Historical Tracking** - Maintain complete history of all portfolio snapshots
- **🔄 Real-time Updates** - Instant updates when you add new data

## 🚀 Quick Start

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/finfusion.git
   cd finfusion
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see FinFusion in action!

### Production Build

To build the project for production:

```bash
npm run build
npm start
```

This creates an optimized build that you can deploy or run locally for regular use.

## 🛠️ Customization

### Adding/Removing Investment Apps

You can easily customize which investment apps appear in FinFusion by editing the `lib/calculations.ts` file:

```typescript
export const INVESTMENT_APPS = [
  'Zerodha',
  'Groww',
  'ETMoney',
  'Paytm Money',
  'HDFC Securities',
  'ICICI Direct',
  'Angel One',
  'Upstox',
  'Motilal Oswal',
  'Sharekhan',
  // Add your custom apps here
  'Your Custom App',
];
```

Simply add or remove app names from this array to customize the dropdown options throughout the application.

### Data Storage

All your data is stored in local JSON files:
- `data/transactions.json` - All your transaction records
- `data/portfolios.json` - Portfolio snapshots and valuations

These files are created automatically when you start using the app.

## 📱 Usage

### 1. Overview Tab
- View your complete portfolio summary
- See total investments, current values, and returns
- Filter and sort your app performance
- Get insights into your best and worst performing investments

### 2. Transactions Tab
- Add new deposits and withdrawals
- View complete transaction history
- Track money flow across different apps

### 3. Portfolio Tab
- Update current portfolio values
- View historical portfolio snapshots
- See when each app was last updated

### 4. Analytics Tab
- Interactive pie chart showing portfolio allocation
- Line chart displaying portfolio value trends over time
- Visual representation of your investment journey

## 🎨 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI Components**: Shadcn/ui, Tailwind CSS
- **Charts**: Recharts
- **Data Storage**: Local JSON files
- **Styling**: Glass-morphism design with purple gradient theme

## 📊 Screenshots

### Dashboard Overview
*Beautiful cards showing your investment performance across different apps*

### Analytics Page
*Interactive charts and visualizations of your portfolio data*

### Transaction Management
*Easy-to-use forms for adding and managing transactions*

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/finfusion/issues) page
2. Create a new issue with detailed information
3. Include screenshots if applicable

## 🌟 Acknowledgments

- Built with modern web technologies for optimal performance
- Designed with privacy and user experience in mind
- Inspired by the need for a simple, local portfolio tracker

---

**Made with ❤️ for investors who value privacy and simplicity**

*FinFusion - Your investments, your data, your control.*
