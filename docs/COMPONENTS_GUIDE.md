# 🧩 Components Guide

A visual reference to all available UI components in the Wise design system. **Always use these instead of creating custom components!**

---

## Why Use Existing Components?

✅ **Maintain brand consistency** - Components follow Wise design standards
✅ **Save time** - No need to build from scratch
✅ **Mobile-optimized** - All components work perfectly on phones
✅ **Accessible** - Built with proper accessibility features
✅ **Battle-tested** - Used in production Wise apps

---

## Core Components

### Button

**When to use:** Any clickable action (submit, navigate, confirm, cancel)

**Variants:**
- `primary` - Main call-to-action (green)
- `secondary` - Alternative action
- `neutral` - Default action
- `neutral-grey` - Subtle action
- `danger` - Destructive action (delete, cancel)

**Sizes:** `small`, `medium`, `large`

**Example:**
```typescript
import Button from './components/Button';

<Button variant="primary" size="medium">
  Send Money
</Button>

<Button variant="neutral-grey" size="small" iconOnly>
  <Settings className="h-5 w-5" />
</Button>
```

**Ask Claude:**
```
"Add a primary button that says 'Continue' to my screen"
```

---

### FormInput

**When to use:** Any user input (text, numbers, email, password, dates, selections)

**Types:**
- `text` - General text input
- `email` - Email addresses
- `password` - Password fields
- `phone` - Phone numbers
- `number` - Numeric input
- `date` - Date picker
- `select` - Dropdown selection
- `textarea` - Multi-line text
- `search` - Search fields
- `range` - Slider input
- `file` - File upload

**Example:**
```typescript
import FormInput from './components/FormInput';

<FormInput
  type="text"
  label="Full Name"
  placeholder="Enter your name"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>

<FormInput
  type="select"
  label="Country"
  options={[
    { value: 'uk', label: 'United Kingdom' },
    { value: 'us', label: 'United States' }
  ]}
/>
```

**Ask Claude:**
```
"Add an email input field to my form"
"Add a date picker for selecting birth date"
```

---

### ListItem

**When to use:** Lists of items, transactions, recipients, accounts

**Features:**
- Avatar (icon, image, or initials)
- Primary and secondary text
- Right-side content (amount, chevron, toggle)
- Badges and flags
- Click actions

**Example:**
```typescript
import ListItem from './components/ListItem';

<ListItem
  avatar={{
    type: 'initials',
    content: 'JD',
    size: 48
  }}
  content={{
    largeText: 'John Doe',
    smallText: 'Sent yesterday'
  }}
  currency={{
    large: '100.00 GBP',
    isPositive: true
  }}
  rightElement={{
    type: 'chevron'
  }}
  onClick={() => console.log('Clicked!')}
/>
```

**Ask Claude:**
```
"Show a list of recent transactions using ListItem"
"Add a recipient list with avatars"
```

---

### AlertBanner

**When to use:** Important information at top of screen

**Types:**
- `info` - General information
- `warning` - Important warnings
- `error` - Error messages
- `success` - Success confirmation

**Example:**
```typescript
import AlertBanner from './components/AlertBanner';

<AlertBanner
  type="warning"
  message="Your transfer will arrive by Monday"
  dismissible={true}
/>
```

**Ask Claude:**
```
"Add a success banner at the top saying 'Transfer sent successfully'"
```

---

### AlertMessage

**When to use:** Inline messages within content

**Similar to AlertBanner but embedded in the flow rather than fixed at top.**

**Example:**
```typescript
import AlertMessage from './components/AlertMessage';

<AlertMessage
  type="info"
  title="Note"
  message="This transfer will be converted to USD"
/>
```

---

### BottomSheet

**When to use:** Modal overlays that slide up from bottom (mobile-friendly)

**Perfect for:**
- Selection lists
- Additional options
- Confirmations
- Detail views

**Example:**
```typescript
import { BottomSheet } from './components/BottomSheet';

<BottomSheet
  isOpen={showSheet}
  onClose={() => setShowSheet(false)}
>
  <h2>Select Recipient</h2>
  {/* Your content here */}
</BottomSheet>
```

**Ask Claude:**
```
"Add a bottom sheet for selecting payment methods"
```

---

### Avatar

**When to use:** User profiles, recipients, contacts

**Types:**
- `initials` - Letter(s) in a circle
- `image` - Profile photo
- `icon` - Icon representation

**Sizes:** `24`, `32`, `40`, `48`, `64`, `96`

**Example:**
```typescript
import Avatar from './components/Avatar';

<Avatar
  type="initials"
  content="JD"
  size={48}
/>

<Avatar
  type="image"
  src="/images/profile.jpg"
  alt="John Doe"
  size={64}
/>
```

---

### Footer

**When to use:** Bottom navigation bar (like iOS tab bar)

**Example:**
```typescript
import Footer from './components/Footer';
import { Home, CreditCard, Users } from 'lucide-react';

<Footer
  buttons={[
    {
      id: 'home',
      icon: <Home className="h-6 w-6" />,
      label: 'Home',
      isActive: true
    },
    {
      id: 'card',
      icon: <CreditCard className="h-6 w-6" />,
      label: 'Card',
      isActive: false
    }
  ]}
  layout="navigation"
/>
```

---

### SegmentedControl

**When to use:** Toggle between 2-4 options

**Example:**
```typescript
import SegmentedControl from './components/SegmentedControl';

<SegmentedControl
  options={[
    { label: 'Send', value: 'send' },
    { label: 'Receive', value: 'receive' }
  ]}
  value={mode}
  onChange={setMode}
/>
```

**Ask Claude:**
```
"Add a segmented control to switch between 'Weekly' and 'Monthly' views"
```

---

### Switch

**When to use:** On/off toggles

**Example:**
```typescript
import Switch from './components/Switch';

<Switch
  checked={enabled}
  onChange={setEnabled}
  label="Enable notifications"
/>
```

---

### Tasks

**When to use:** Checklist of items to complete

**Example:**
```typescript
import Tasks from './components/Tasks';

<Tasks
  tasks={[
    {
      id: '1',
      title: 'Verify your email',
      completed: true
    },
    {
      id: '2',
      title: 'Add a payment method',
      completed: false
    }
  ]}
/>
```

---

### SendReceiveInput

**When to use:** Currency input with inline currency selector (like the calculator)

**Example:**
```typescript
import SendReceiveInput from './components/SendReceiveInput';

<SendReceiveInput
  type="send"
  amount="1000"
  currency="GBP"
  onAmountChange={setAmount}
  onCurrencyChange={setCurrency}
/>
```

**Ask Claude:**
```
"Add a send money input for entering amounts"
```

---

### CurrencyDropdown

**When to use:** Selecting currencies with flags

**Example:**
```typescript
import CurrencyDropdown from './components/CurrencyDropdown';

<CurrencyDropdown
  selectedCurrency="GBP"
  onCurrencyChange={setCurrency}
/>
```

---

### MobileFrame

**When to use:** Wrapping your prototype to show it in a phone frame

**Example:**
```typescript
import MobileFrame from './components/MobileFrame';

<MobileFrame>
  {/* Your prototype screens */}
</MobileFrame>
```

**Note:** The prototype layout automatically wraps your content in MobileFrame - you usually don't need to add this yourself.

---

### Chips

**When to use:** Quick selection options (tags, filters, quick amounts)

**Example:**
```typescript
import Chips from './components/Chips';

<Chips
  options={[
    { label: '£50', value: '50' },
    { label: '£100', value: '100' },
    { label: '£200', value: '200' }
  ]}
  selected="100"
  onSelect={setAmount}
/>
```

---

### OverlayView

**When to use:** Full-screen overlays that slide in from right

**Perfect for:** Detail views, settings, sub-flows

**Example:**
```typescript
import OverlayView from './components/OverlayView';

<OverlayView
  isOpen={showOverlay}
  onClose={() => setShowOverlay(false)}
  title="Payment Methods"
>
  {/* Your content */}
</OverlayView>
```

---

## Specialized Components

### Nudge

**When to use:** Helpful tips and suggestions

**Example:**
```typescript
import Nudge from './components/Nudge';

<Nudge
  message="💡 Tip: Send before 3pm for same-day delivery"
  variant="info"
/>
```

---

### CheckboxRadio

**When to use:** Radio buttons and checkboxes

**Example:**
```typescript
import CheckboxRadio from './components/CheckboxRadio';

<CheckboxRadio
  type="radio"
  name="payment"
  value="card"
  checked={method === 'card'}
  onChange={() => setMethod('card')}
  label="Credit card"
/>
```

---

## Using Icons

All components use **Lucide React** for icons. Browse available icons at: https://lucide.dev

**Example:**
```typescript
import { Send, User, Settings, ArrowRight } from 'lucide-react';

<Send className="h-5 w-5" />
<User className="h-6 w-6 text-wise-content-primary" />
```

**Common icons:**
- `ArrowLeft`, `ArrowRight` - Navigation
- `Check`, `X` - Confirm/Cancel
- `User`, `Users` - People
- `Send`, `ArrowRightLeft` - Transfers
- `CreditCard`, `BanknoteIcon` - Money
- `Settings`, `Menu` - UI chrome
- `Eye`, `EyeOff` - Show/Hide
- `Search` - Search functionality

---

## Component Best Practices

### ✅ DO:
- **Use existing components** - Don't create custom ones
- **Follow variant patterns** - Use `primary` for main actions
- **Keep sizes consistent** - Use `medium` as default
- **Use semantic colors** - `wise-content-primary` for text, not hardcoded colors
- **Match existing patterns** - Look at Send Money flow for examples

### ❌ DON'T:
- Create custom buttons, inputs, or cards
- Use hardcoded colors like `#163300` - use Tailwind classes
- Mix different icon libraries - stick with Lucide
- Create one-off styles - use component variants
- Ignore mobile responsiveness - always test on phone

---

## Finding the Right Component

**"I need to..."**
- ↩️ Let user click something → `Button`
- 📝 Collect information → `FormInput`
- 📋 Show a list → `ListItem`
- ⚠️ Display a message → `AlertBanner` or `AlertMessage`
- 👤 Show a person → `Avatar`
- ☑️ Create a checklist → `Tasks`
- 🎚️ Toggle options → `SegmentedControl` or `Switch`
- 💰 Input money → `SendReceiveInput`
- 🌍 Select currency → `CurrencyDropdown`
- 📱 Show modal → `BottomSheet` or `OverlayView`
- 🏷️ Quick selections → `Chips`
- 💡 Show a tip → `Nudge`

---

## Viewing All Components

Visit **http://localhost:3000/components-showcase** to see all components in action with interactive examples!

---

## Asking Claude for Help

**Good prompts:**
```
"Add a Button component with variant='primary' and text 'Continue'"
"Show a list of transactions using ListItem components"
"Add a bottom sheet for selecting currencies"
"Create a form with name and email inputs using FormInput"
```

**Less helpful prompts:**
```
"Make a button" (Claude might not use the component)
"Add some styling" (too vague)
"Create a custom card" (should use existing components)
```

---

## Next Steps

- **[Brand Guidelines](BRAND_GUIDELINES.md)** - Color, typography, and spacing rules
- **[Prototype Guide](PROTOTYPE_GUIDE.md)** - Build complete flows
- **View live examples:** http://localhost:3000/components-showcase

---

**Remember:** If you're about to create a new component, check this guide first - it probably already exists! 🎨
