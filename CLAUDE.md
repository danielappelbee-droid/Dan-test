# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

---

## 🎯 For Claude: Your Primary Goals

When working with users in this codebase:

1. **Help non-technical users build prototypes** - Most users are designers using Claude for the first time
2. **Always maintain Wise brand consistency** - Use existing components, follow brand guidelines
3. **Copy the Send Money flow as the starting point** - Never build from scratch
4. **Only use [WISECHAIN.md](docs/WISECHAIN.md) for LLM integration** - Never suggest external API providers

---

## 📚 Quick Reference for Users

**New to this project?** Direct users to these guides in this order:

1. **[QUICK_START.md](docs/QUICK_START.md)** - Get started in 3 steps
2. **[PROTOTYPE_GUIDE.md](docs/PROTOTYPE_GUIDE.md)** - Build your first prototype
3. **[COMPONENTS_GUIDE.md](docs/COMPONENTS_GUIDE.md)** - Available UI components
4. **[BRAND_GUIDELINES.md](docs/BRAND_GUIDELINES.md)** - Stay on-brand
5. **[AI_INTEGRATION_GUIDE.md](docs/AI_INTEGRATION_GUIDE.md)** - Add AI features (VPN required)

---

## 🚀 Common User Requests

### "I want to build a prototype"

Guide them to copy the Send Money flow:

```
1. Copy /prototypes/sendmoney to /prototypes/[new-name]
2. Add route to navigationService.ts
3. Create homepage card linking to the prototype
4. Help them customize from there
```

**Always copy Send Money first - never build from scratch!**

### "I want to add [feature]"

1. Check if a component exists in [COMPONENTS_GUIDE.md](docs/COMPONENTS_GUIDE.md)
2. Use existing components whenever possible
3. Follow [BRAND_GUIDELINES.md](docs/BRAND_GUIDELINES.md) for styling
4. Never create custom buttons, inputs, or cards if Wise components exist

### "I want AI chat / LLM features"

**⚠️ CRITICAL:** Only use WISECHAIN.md approach!

1. Verify user has VPN access and Sailpoint approval
2. Follow [AI_INTEGRATION_GUIDE.md](docs/AI_INTEGRATION_GUIDE.md)
3. Use `wise-chain` library ONLY
4. Never suggest OpenAI, Anthropic, or other external API keys

---

## 🎨 Design System Priorities

**Brand adherence is paramount!**

### Color Usage
- ✅ Always use `wise-*` color classes from Tailwind config
- ❌ Never hardcode hex colors or use generic Tailwind colors
- See [BRAND_GUIDELINES.md](docs/BRAND_GUIDELINES.md) for full palette

### Component Reuse
- ✅ Check [COMPONENTS_GUIDE.md](docs/COMPONENTS_GUIDE.md) first
- ✅ Reuse existing Button, FormInput, ListItem, etc.
- ❌ Never create custom components if Wise versions exist

### Typography
- ✅ `font-wise` for headers (WiseSans)
- ✅ `font-body` (or default) for body text (Inter)
- ❌ Never use custom font stacks

---

## 📱 Project Structure (For Claude)

```
src/app/
├── prototypes/         # User prototypes (copy sendmoney to start new ones)
│   └── sendmoney/      # PRIMARY REFERENCE - Copy this for all new prototypes!
├── components/         # Wise design system components (always reuse these)
├── utils/             # Services (currency, navigation, etc.)
├── content/           # Markdown content files
└── api/               # API routes
```

### Key Files

**For Adding Prototypes:**
- `src/app/prototypes/sendmoney/` - Copy this folder as starting point
- `src/app/page.tsx` - Homepage (add cards for new prototypes)
- `src/app/utils/navigationService.ts` - Register new routes here
- `src/app/prototypes/layout.tsx` - Back button logic

**For Styling:**
- `tailwind.config.ts` - All Wise colors and design tokens
- `src/app/components/` - All reusable components

---

## 🔧 Common Development Tasks

### Creating a New Prototype

```typescript
// 1. Copy the sendmoney folder
cp -r src/app/prototypes/sendmoney src/app/prototypes/[name]

// 2. Add route to navigationService.ts
export type PrototypeRoute =
  | '/prototypes/sendmoney'
  | '/prototypes/[name]'  // ADD THIS
  // ... etc

// 3. Add card to homepage (src/app/page.tsx)
<motion.div onClick={() => router.push("/prototypes/[name]")}>
  <h3>My Prototype</h3>
  <p>Description here</p>
</motion.div>
```

### Adding a Homepage Card

Always use this pattern (from src/app/page.tsx):

```typescript
<motion.div
  variants={featureVariants}
  className="bg-wise-background-elevated rounded-[40px] p-8 border border-wise-border-neutral cursor-pointer"
  onClick={() => router.push("/prototypes/my-flow")}
  whileHover={{
    y: -4,
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
    transition: { duration: 0.2 }
  }}
  whileTap={{ scale: 0.98 }}
>
  <div className="flex items-start gap-6">
    <div className="bg-wise-interactive-accent rounded-2xl p-3">
      <IconName className="w-6 h-6 text-wise-interactive-primary" />
    </div>
    <div className="flex-1">
      <h3 className="text-2xl font-semibold text-wise-content-primary mb-2">
        Title Here
      </h3>
      <p className="text-wise-content-secondary leading-relaxed">
        Description here
      </p>
    </div>
  </div>
</motion.div>
```

---

## 🎨 Wise Component Patterns

### Buttons
```typescript
import Button from './components/Button';

// Primary action
<Button variant="primary" size="medium">Continue</Button>

// Secondary action
<Button variant="neutral" size="medium">Cancel</Button>

// Icon-only button
<Button variant="neutral-grey" size="small" iconOnly>
  <Settings className="h-5 w-5" />
</Button>
```

### Form Inputs
```typescript
import FormInput from './components/FormInput';

<FormInput
  type="text"
  label="Full Name"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

### Lists
```typescript
import ListItem from './components/ListItem';

<ListItem
  avatar={{ type: 'initials', content: 'JD', size: 48 }}
  content={{ largeText: 'John Doe', smallText: 'Sent yesterday' }}
  currency={{ large: '100.00 GBP', isPositive: true }}
  rightElement={{ type: 'chevron' }}
  onClick={() => {}}
/>
```

---

## 🔐 LLM Integration (CRITICAL)

**⚠️ ONLY use [WISECHAIN.md](docs/WISECHAIN.md) approach - NEVER external APIs!**

### When User Requests AI Features:

1. **Check prerequisites:**
   - VPN connection (required)
   - Sailpoint "LLM Gateway Service" approval (required)
   - Python 3.8+ installed

2. **Follow [WISECHAIN.md](docs/WISECHAIN.md):**
   ```python
   from wise_chain import load_chat_model, ChatModelProvider

   model = load_chat_model(
       ChatModelProvider.ANTHROPIC,
       "us.anthropic.claude-3-5-sonnet-20241022-v2:0",
       team="team-name",
       use_case="prototype"
   )
   ```

3. **Never suggest:**
   - Creating OpenAI API keys
   - Using Anthropic API directly
   - Any external LLM providers
   - Storing API keys in code

4. **Always warn about rate limits:**
   - No concurrent requests
   - Contact `#generative-ai-platform-public` for high throughput
   - Rate limits are shared across all Wise use cases

---

## 📐 Brand Guidelines (ENFORCE STRICTLY)

### Colors - ONLY use Wise palette

```typescript
// ✅ Correct
<div className="bg-wise-background-elevated text-wise-content-primary">

// ❌ Wrong - never use generic Tailwind or hex
<div className="bg-white text-black">
<div style={{ color: '#000000' }}>
```

### Rounded Corners

```typescript
// ✅ Correct for cards
className="rounded-[40px]"

// ✅ Correct for buttons
className="rounded-full"

// ❌ Wrong - too small
className="rounded-md"
```

### Typography

```typescript
// ✅ Correct for headings
<h1 className="font-wise text-5xl text-wise-content-primary">

// ✅ Correct for body
<p className="text-wise-content-secondary text-lg leading-relaxed">

// ❌ Wrong - custom sizes and colors
<h1 style={{ fontSize: '48px', color: '#333' }}>
```

---

## 🧪 Testing Reminders

### Mobile Testing
- Users can test on phone using network IP
- Always design mobile-first
- Minimum touch target: 44×44px

### Navigation Testing
- Back button should go to homepage from top-level prototypes
- Internal navigation should work smoothly
- Animations should be smooth (200-400ms typical)

---

## 🚨 Common Pitfalls to Avoid

### ❌ Building from Scratch
**Never start a new prototype from scratch!**
- ✅ Always copy `/prototypes/sendmoney` first
- ✅ Then customize the copy

### ❌ Creating Custom Components
**Check [COMPONENTS_GUIDE.md](docs/COMPONENTS_GUIDE.md) first!**
- ✅ Use existing Button, FormInput, ListItem, etc.
- ❌ Don't create `<button>` or `<input>` directly

### ❌ Breaking the Brand
**Follow [BRAND_GUIDELINES.md](docs/BRAND_GUIDELINES.md) strictly!**
- ✅ Use `wise-*` color classes
- ✅ Use `font-wise` for headers
- ❌ Never hardcode colors or custom styles

### ❌ External LLM APIs
**ONLY use [WISECHAIN.md](docs/WISECHAIN.md)!**
- ✅ Use `wise-chain` library
- ❌ Never suggest OpenAI, Anthropic API keys

---

## 📋 Pre-Commit Checklist

Before completing a prototype, verify:

**Brand Compliance:**
- [ ] Using Wise color classes (`wise-*`)
- [ ] Using Wise components (not custom)
- [ ] Proper typography (`font-wise` for headers)
- [ ] Correct border radius (`rounded-[40px]` for cards)

**Navigation:**
- [ ] Route added to `navigationService.ts`
- [ ] Homepage card added and clickable
- [ ] Back button works correctly
- [ ] All screens accessible

**Code Quality:**
- [ ] No hardcoded colors or styles
- [ ] No custom components when Wise versions exist
- [ ] Mobile-responsive (tested on phone if possible)
- [ ] Smooth animations (200-400ms)

---

## 🎓 Teaching Users

### First-Time Claude Code Users

**Start simple:**
1. "Let's run the development server" → `npm run dev`
2. "Let's view the Send Money flow" → Homepage → Click Send Money
3. "Let's copy it for your prototype" → Copy folder, add to homepage
4. "Let's customize one screen" → Make small changes

**Build confidence gradually:**
- Show them one thing works before moving to the next
- Celebrate small wins ("Great! The server is running!")
- Use clear, non-technical language
- Link to guides for more details

### When Users Get Stuck

**Common issues:**
- Server not running → `npm run dev`
- Changes not showing → Refresh browser
- Imports broken → Check file paths are correct
- Colors look wrong → Verify using `wise-*` classes

---

## 🔗 Quick Links

**User Guides:**
- [QUICK_START.md](docs/QUICK_START.md) - Get started
- [PROTOTYPE_GUIDE.md](docs/PROTOTYPE_GUIDE.md) - Build prototypes
- [COMPONENTS_GUIDE.md](docs/COMPONENTS_GUIDE.md) - Component library
- [BRAND_GUIDELINES.md](docs/BRAND_GUIDELINES.md) - Design rules
- [AI_INTEGRATION_GUIDE.md](docs/AI_INTEGRATION_GUIDE.md) - LLM features

**Technical References:**
- [WISECHAIN.md](docs/WISECHAIN.md) - LLM integration (ONLY method)
- `tailwind.config.ts` - Design tokens and colors
- `src/app/components/` - Component source code
- `src/app/prototypes/sendmoney/` - Reference implementation

---

## 📞 Getting Help

**For users:**
- Ask Claude questions directly
- Check the guides above
- View examples at http://localhost:3000/components-showcase

**For LLM integration:**
- Slack: `#generative-ai-platform-public`
- Requires VPN and Sailpoint access

---

## Technical Architecture (Reference)

### Tech Stack
- Next.js 15.3.4 with TypeScript and App Router
- Tailwind CSS with custom Wise design tokens
- Framer Motion (via `motion` package) for animations
- Lucide React for icons
- Custom WiseSans typography with Inter fallback

### Service Layer
- `currencyService.ts` - Currency conversion, formatting, exchange rates
- `feeService.ts` - Payment method fee calculations
- `navigationService.ts` - Navigation state management
- `dateService.ts` - Date formatting and arrival time calculations
- `taskService.ts` - Task/checklist management
- `metaResearchService.ts` - Research configuration

### State Management
- React hooks for local state
- URL search params for navigation state
- SessionStorage for cross-screen data
- No global state library (Redux, Zustand, etc.)

### Configuration
- **Next.js**: `trailingSlash: true`, `images.unoptimized: true`
- **Deployment**: Netlify with `@netlify/plugin-nextjs`
- **Build**: `npm run build`, publish directory `.next`

---

**Remember:** Your primary job is helping non-technical users build beautiful, on-brand Wise prototypes! 🎨
