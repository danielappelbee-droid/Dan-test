# Wise Design Demos

A Next.js application showcasing interactive prototypes and design components from the Wise design system. Built for designers and product teams to rapidly prototype mobile app flows in the Wise.com style.

---

## 🚀 Quick Start

**New here?** Start with these guides:

1. **[Quick Start Guide](docs/QUICK_START.md)** - Get up and running in 3 steps
2. **[Prototype Guide](docs/PROTOTYPE_GUIDE.md)** - Build your first prototype
3. **[Components Guide](docs/COMPONENTS_GUIDE.md)** - Explore available UI components
4. **[Brand Guidelines](docs/BRAND_GUIDELINES.md)** - Stay on-brand
5. **[AI Integration](docs/AI_INTEGRATION_GUIDE.md)** - Add intelligent features (VPN required)

---

## Features

- **Complete Send Money Flow**: Production-quality reference implementation
- **Wise Design System**: Comprehensive collection of reusable UI components
- **Mobile-First Design**: Responsive layouts optimized for mobile devices
- **Real-time Currency Conversion**: Exchange rates and fee calculations
- **Claude Code Optimized**: Built for AI-assisted development
- **AI Integration Ready**: Secure LLM access via Wise's internal gateway

## Tech Stack

- **Framework**: Next.js 15.3.4 with TypeScript
- **Styling**: Tailwind CSS with custom Wise design tokens
- **Animation**: Framer Motion for smooth transitions
- **Icons**: Lucide React
- **Fonts**: Custom WiseSans typography

## Repository Access

To request access to this repository, please fill out the form:
**https://forms.gle/9dktMJ8v4ZKmhtno7**

## Getting Started

### Download and Setup

**Important:** Please download the project as a ZIP file rather than forking or branching. This ensures you have your own independent version.

#### Step 1: Create Your Own GitHub Repository

1. **Download the project:**
   - Click the green "Code" button on GitHub
   - Select "Download ZIP"

2. **Create a new repository on GitHub:**
   - Download Github Desktop Kandji Self Service (Wise) or https://desktop.github.com/download/
   - Name your repository (e.g., `my-wisedemos`)
   - Make it private
   - Unzip the contents 'wisedemos' folder into the 'my-wisedemos' folder. 

3. **Install dependencies:**
 - Download Homebrew via Kandji Self Service (Wise) or https://brew.sh/

   ```bash
   cd my-wisedemos
   npm install
   ```

   The PIN hash will be automatically configured during installation.

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Environment Setup

The PIN hash is automatically generated when you run `npm install`. The default PIN is **8549**.

To change the PIN, run:

```bash
node scripts/generatePinHash.js YOUR_PIN
```

Then update your `.env.local` file with the generated hash:

```bash
NEXT_PUBLIC_PIN_HASH=your_generated_pin_hash
```

### Development

```bash
npm run dev
```

Visit `http://localhost:3000` to view the application.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
src/app/
├── screens/                 # Core screen library (stable patterns to copy)
│   ├── dashboard-home/      # Multi-card dashboard
│   ├── detail-list/         # Scrollable list with search
│   ├── selection-screen/    # Option picker
│   ├── form-screen/         # Input collection
│   └── progress-tracker/    # Checklist/stepper
├── prototypes/              # Experimental prototypes (self-contained)
│   ├── calculator/          # Currency calculator flow
│   ├── home/               # Home dashboard
│   └── ... (7 total)
├── components/              # UI component library (shared)
└── utils/                  # Service layer and utilities
```

### Architecture

The project uses a **two-tier system**:
- **Core Screens**: Stable reference patterns to copy from
- **Prototypes**: Self-contained experiments where you can iterate freely
- **Components**: Shared UI building blocks used everywhere

## Key Components

- **Calculator**: Interactive currency conversion with payment methods
- **Mobile Frame**: Device frame wrapper for prototype presentation
- **PIN Protection**: Security layer for controlled access
- **Design System**: Buttons, forms, alerts, and layout components

## Customization

The application supports customizing primary interaction colors (buttons and links) and typography (H1 headers) through Tailwind configuration. The design system maintains Wise's visual identity while allowing for flexible theming.

## Security

The application includes PIN-based authentication using SHA-256 hashing with salt. Access is session-based with configurable timeouts and attempt limits.

## Development with Claude Code

This project is optimized for development with [Claude Code](https://docs.claude.com/en/docs/claude-code/setup), Anthropic's official CLI tool for AI-assisted development.

### Setup Claude Code

1. **Install Claude Code:**
   Follow the official setup guide at https://docs.claude.com/en/docs/claude-code/setup

2. **Navigate to the project:**
   ```bash
   cd /path/to/my-wisedemos
   ```

3. **Start developing:**
   ```bash
   claude
   ```
4. Ask claude to \setup your .gitignore'

5. **Push your project to your new repository using github desktop**

### Project Context

When working with Claude Code on this project:

**About wiseDemos:**
A Next.js web application showcasing mobile-responsive prototype pages and flows in the Wise.com style. Built with Tailwind CSS and Lucide icons, with customizable interaction colors, button styles, and typography (particularly H1 headers).

**Development Guidelines:**
- Focus on mobile-first responsive design
- Maintain consistency with Wise design system
  
## Deployment

### Deploy to Netlify via GitHub

This project is optimized for deployment on Netlify with continuous deployment from GitHub.

#### Connect to Netlify

1. **Sign up or login to [Netlify](https://app.netlify.com)**

2. **Import your project:**
   - Click "Add new site" → "Import an existing project"
   - Select "Deploy with GitHub"
   - Authorize Netlify to access your GitHub account
   - Select your wisedemos repository

3. **Configure build settings:**
   - Build command: `npm run build`
   - Publish directory: `out`
   - Click "Deploy site"

4. **Add environment variables:**
   - Go to Site settings → Environment variables
   - Click "Add a variable"
   - Key: `NEXT_PUBLIC_PIN_HASH`
   - Value: Your generated PIN hash (from `node scripts/generatePinHash.js YOUR_PIN`)
   - Click "Save"

5. **Trigger a new deploy:**
   - Go to Deploys tab
   - Click "Trigger deploy" → "Deploy site"

Your site will now automatically deploy whenever you push changes to your GitHub repository!

## License

This project is private and proprietary to Wise.
