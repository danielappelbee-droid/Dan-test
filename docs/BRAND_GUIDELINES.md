# 🎨 Wise Brand Guidelines

Keep your prototypes on-brand by following these design rules. **Brand consistency is paramount!**

---

## Core Principle

> **"If it exists in a component, use the component. If it doesn't, match the style exactly."**

The Wise design system ensures consistency across all products. Every color, font, and spacing has been carefully chosen to maintain our brand identity.

---

## Color System

### Primary Colors

**Wise Green** (Our signature color)
- `wise-green-bright` - #9FE870 (Accent, highlights)
- `wise-green-forest` - #163300 (Primary actions, text)

**When to use:**
- Primary buttons
- Links
- Active states
- Brand moments

### Content Colors (Text)

Use these for ALL text:
- `text-wise-content-primary` - #0E0F0C (Main text, headings)
- `text-wise-content-secondary` - #454745 (Supporting text)
- `text-wise-content-tertiary` - #6A6C6A (Subtle text, hints)

**❌ DON'T use:** `text-black`, `text-gray-700`, or hardcoded hex values

### Interactive Colors

**Buttons and controls:**
- `bg-wise-interactive-primary` - #163300 (Primary button background)
- `bg-wise-interactive-accent` - #9FE870 (Accent backgrounds)
- `bg-wise-interactive-neutral-grey` - #EDEFEC (Neutral buttons)
- `text-wise-interactive-primary` - #163300 (Button text)

**Links:**
- `text-wise-link-content` - #163300 (All clickable links)

### Background Colors

- `bg-wise-background-screen` - #FFFFFF (Page background)
- `bg-wise-background-elevated` - #FFFFFF (Cards, panels)
- `bg-wise-background-neutral` - rgba(22, 51, 0, 0.08) (Subtle backgrounds)

### Border Colors

- `border-wise-border-neutral` - rgba(14, 15, 12, 0.12) (Default borders)
- `border-wise-border-overlay` - #0E0F0C (Stronger borders)

### Sentiment Colors

**Status messages:**
- `text-wise-sentiment-positive` - #2F5711 (Success)
- `text-wise-sentiment-negative` - #A8200D (Errors)
- `text-wise-sentiment-warning` - #EDC843 (Warnings)

---

## Typography

### Font Families

**Headers:**
```css
font-wise
```
Use for: H1 titles, large prominent text
Stack: WiseSans → Inter → system fonts

**Body:**
```css
font-body
```
Use for: All other text (paragraphs, labels, buttons)
Stack: Inter → system fonts

### Font Sizes

**Don't use arbitrary sizes!** Use Tailwind's scale:
- `text-sm` - Small text (12-14px)
- `text-base` - Body text (16px)
- `text-lg` - Large text (18px)
- `text-xl` - Large headings (20px)
- `text-2xl` - Section titles (24px)
- `text-4xl` - Page titles (36px)
- `text-5xl` - Hero text (48px)

**Example:**
```tsx
// ✅ Correct
<h1 className="font-wise text-5xl text-wise-content-primary">
  Send Money
</h1>

// ❌ Wrong
<h1 style={{ fontSize: '48px', color: '#000000' }}>
  Send Money
</h1>
```

---

## Spacing & Layout

### Border Radius

**Wise uses large, friendly rounded corners:**
- Buttons: `rounded-full` (fully rounded pills)
- Cards: `rounded-[40px]` (large 40px radius)
- Small elements: `rounded-2xl` (16px)
- Inputs: `rounded-xl` (12px)

**❌ DON'T use:** `rounded-sm`, `rounded-md`, or `rounded-lg` - too small!

### Padding & Margins

Use Tailwind's spacing scale:
- `p-4` - 16px padding (standard for cards)
- `p-6` - 24px padding (generous spacing)
- `p-8` - 32px padding (large cards)
- `gap-4` - 16px gap (between items)
- `mb-6` - 24px bottom margin (between sections)

### Mobile-First Layout

**Always design for mobile first!**
- Use `px-4` for horizontal screen padding
- Use `py-6` for vertical screen padding
- Keep touch targets at least 44×44px
- Test on actual phones frequently

---

## Component Styling Rules

### Buttons

**✅ DO:**
```tsx
<Button variant="primary" size="medium">
  Continue
</Button>
```

**❌ DON'T:**
```tsx
<button className="bg-green-500 px-4 py-2 rounded">
  Continue
</button>
```

### Cards

**✅ DO:**
```tsx
<div className="bg-wise-background-elevated rounded-[40px] p-8 border border-wise-border-neutral">
  {/* content */}
</div>
```

**❌ DON'T:**
```tsx
<div style={{
  background: '#fff',
  borderRadius: '8px',
  padding: '20px'
}}>
  {/* content */}
</div>
```

### Text

**✅ DO:**
```tsx
<p className="text-wise-content-secondary text-lg leading-relaxed">
  Your transfer will arrive by Monday
</p>
```

**❌ DON'T:**
```tsx
<p style={{ color: '#666', fontSize: '18px' }}>
  Your transfer will arrive by Monday
</p>
```

---

## Animations

### Motion Principles

Wise animations are:
- **Smooth** - Use easing functions, not linear
- **Quick** - 200-400ms typical duration
- **Purposeful** - Animations guide attention

### Common Patterns

**Framer Motion is already imported as `motion`:**

**Fade in:**
```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
```

**Slide in:**
```tsx
<motion.div
  initial={{ x: "100%" }}
  animate={{ x: 0 }}
  transition={{
    type: "spring",
    stiffness: 400,
    damping: 40
  }}
>
```

**Hover:**
```tsx
<motion.div
  whileHover={{ y: -4 }}
  whileTap={{ scale: 0.98 }}
>
```

---

## Icons

### Using Lucide Icons

**✅ DO:**
```tsx
import { Send, User, Settings } from 'lucide-react';

<Send className="h-5 w-5 text-wise-content-primary" />
```

**Icon Sizes:**
- Small: `h-4 w-4` (16px) - Inline with text
- Medium: `h-5 w-5` (20px) - Standard buttons
- Large: `h-6 w-6` (24px) - Tab bar, headers

**Icon Colors:**
Always use Wise color classes:
- `text-wise-content-primary` - Main icons
- `text-wise-content-secondary` - Supporting icons
- `text-wise-interactive-primary` - Action icons

**❌ DON'T:**
- Use different icon libraries (Font Awesome, Material Icons)
- Hardcode icon colors
- Use inconsistent sizes

---

## Brand Compliance Checklist

Before finalizing your prototype, check:

### Colors ✅
- [ ] Using `wise-*` color classes, not hardcoded hex
- [ ] Text uses `text-wise-content-*` classes
- [ ] Buttons use `wise-interactive-*` backgrounds
- [ ] Links are `text-wise-link-content`

### Typography ✅
- [ ] Headers use `font-wise`
- [ ] Body text uses `font-body` (or nothing - it's default)
- [ ] Font sizes from Tailwind scale, not custom
- [ ] Line height is `leading-relaxed` for body text

### Spacing ✅
- [ ] Cards use `rounded-[40px]`
- [ ] Buttons use `rounded-full`
- [ ] Consistent padding (p-4, p-6, p-8)
- [ ] Touch targets at least 44px

### Components ✅
- [ ] Using Wise components from `COMPONENTS_GUIDE.md`
- [ ] Not creating custom buttons, inputs, cards
- [ ] Icons from Lucide React only
- [ ] Animations use Framer Motion

### Mobile ✅
- [ ] Tested on actual phone (see `PHONE_ACCESS.md`)
- [ ] Touch targets are large enough
- [ ] Text is readable at mobile sizes
- [ ] No horizontal scrolling

---

## Common Mistakes

### ❌ Creating Custom Buttons
```tsx
// Wrong - custom button
<button className="bg-green-500 px-4 py-2">Click me</button>

// Right - use Button component
<Button variant="primary">Click me</Button>
```

### ❌ Hardcoded Colors
```tsx
// Wrong
<div style={{ backgroundColor: '#9FE870' }}>

// Right
<div className="bg-wise-interactive-accent">
```

### ❌ Custom Font Sizes
```tsx
// Wrong
<h1 style={{ fontSize: '52px' }}>

// Right
<h1 className="font-wise text-5xl">
```

### ❌ Mixing Design Systems
```tsx
// Wrong - using Material UI alongside Wise
import Button from '@mui/material/Button';

// Right - use Wise Button
import Button from './components/Button';
```

---

## Examples: Good vs Bad

### Card Design

**❌ Bad:**
```tsx
<div style={{
  background: 'white',
  borderRadius: '8px',
  padding: '16px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
}}>
  <h2 style={{ color: '#333', fontSize: '20px' }}>Title</h2>
  <p style={{ color: '#666' }}>Description</p>
</div>
```

**✅ Good:**
```tsx
<div className="bg-wise-background-elevated rounded-[40px] p-6 border border-wise-border-neutral">
  <h2 className="text-2xl font-semibold text-wise-content-primary mb-2">
    Title
  </h2>
  <p className="text-wise-content-secondary leading-relaxed">
    Description
  </p>
</div>
```

### Button Group

**❌ Bad:**
```tsx
<div className="flex gap-2">
  <button className="bg-green-500 text-white px-6 py-3">Send</button>
  <button className="bg-gray-200 px-6 py-3">Cancel</button>
</div>
```

**✅ Good:**
```tsx
<div className="flex gap-3">
  <Button variant="primary" size="medium">Send</Button>
  <Button variant="neutral" size="medium">Cancel</Button>
</div>
```

---

## Getting Color Values

Need to reference exact hex values? Check `tailwind.config.ts`:

```typescript
// Location: /tailwind.config.ts
theme: {
  extend: {
    colors: {
      wise: {
        green: {
          bright: '#9FE870',
          forest: '#163300'
        },
        content: {
          primary: '#0E0F0C',
          secondary: '#454745',
          tertiary: '#6A6C6A'
        }
        // ... etc
      }
    }
  }
}
```

---

## Asking Claude for Help

**Good prompts:**
```
"Style this card using Wise brand guidelines"
"Make sure this button follows Wise design system"
"Check if my colors match the brand guidelines"
"Update this to use proper Wise typography"
```

**Questions to ask:**
```
"What color class should I use for this text?"
"Which button variant should I use for a cancel action?"
"Am I using the right font for this heading?"
```

---

## Resources

- **See all colors in action:** http://localhost:3000/components-showcase
- **Component examples:** [COMPONENTS_GUIDE.md](COMPONENTS_GUIDE.md)
- **Tailwind config:** `/tailwind.config.ts`
- **Lucide icons:** https://lucide.dev

---

**Remember:** When in doubt, copy from the Send Money flow - it's fully on-brand! 🎨
