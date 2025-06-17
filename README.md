# create-privy-embedded-app

A CLI tool to quickly scaffold Privy embedded wallet applications with Next.js.

## Usage

### With npx (recommended)
```bash
npx create-privy-embedded-app my-app
```

### With npm
```bash
npm create privy-embedded-app my-app
```

### With pnpm
```bash
pnpm create privy-embedded-app my-app
```

### With yarn
```bash
yarn create privy-embedded-app my-app
```

## Options

- `[project-name]` - Optional project name. If not provided, you'll be prompted.
- `-y, --yes` - Skip all prompts and use defaults

## What's Included

The generated project includes:

- **Next.js 15** with TypeScript
- **Privy** embedded wallet integration
- **Wagmi** and **Viem** for Web3 interactions
- **Tailwind CSS** for styling
- **Multi-chain support** (all chains in Viem + more)
- **Dark/light theme** toggle
- **Responsive design**
- **Transaction examples**

## After Creation

1. Navigate to your project:
   ```bash
   cd my-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Add your Privy App ID to `.env.local`:
   ```env
   NEXT_PUBLIC_PROJECT_ID=your_privy_app_id_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Getting a Privy App ID

1. Visit [Privy Dashboard](https://dashboard.privy.io)
2. Create a new app or select an existing one
3. Copy your App ID from the dashboard
4. In your app settings, go to **Authentication** → **Advanced** → Enable **"Disable confirmation modals"**

## Support

- [Privy Documentation](https://docs.privy.io/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Wagmi Documentation](https://wagmi.sh/)

## License

MIT