# 📱 Building Your Own Prototype

This guide shows you how to create a new prototype by copying and customizing the Send Money flow.

---

## Why Copy the Send Money Flow?

The Send Money flow is a complete, production-quality prototype with:
- ✅ Multiple connected screens
- ✅ Animations and transitions
- ✅ Form inputs and validation
- ✅ Navigation between views
- ✅ Mobile-responsive design
- ✅ All Wise brand components

**Instead of starting from scratch, copy it and modify what you need!**

---

## Step-by-Step: Create Your Prototype

### Step 1: Ask Claude to Copy the Flow

Simply tell Claude:

```
I want to create a new prototype called "my-flow" based on the Send Money flow.
Please copy the /prototypes/sendmoney folder to /prototypes/my-flow
```

Claude will create a new folder with all the files you need.

### Step 2: Add a Link to the Homepage

Ask Claude:

```
Add a card to the homepage (src/app/page.tsx) for my new "my-flow" prototype.
Put it after the Design Briefs card.
```

Claude will add a clickable card that links to your prototype at `/prototypes/my-flow`

### Step 3: Test Your Prototype

Visit **http://localhost:3000** and click your new prototype card. You should see an exact copy of the Send Money flow!

### Step 4: Start Customizing

Now the fun part! Tell Claude what you want to change:

**Example prompts:**
```
"Change the success screen to show a celebration animation"

"Add a new screen for selecting transfer reason"

"Update the home screen to show a graph of spending"

"Change the confirmation screen to include a photo of the recipient"
```

---

## Understanding the Prototype Structure

When you copy the Send Money flow, you'll get:

```
prototypes/my-flow/
├── page.tsx                    # Main entry point (navigation logic)
├── HomeMainView.tsx            # Home screen with accounts
├── TransactionsView.tsx        # Transactions list
├── RecipientSelectionSheet.tsx # Choose recipient
├── CalculatorMainView.tsx      # Amount input
├── PaymentMethodsView.tsx      # Payment selection
├── ConfirmAndSendView.tsx      # Confirmation screen
├── SuccessView.tsx             # Success celebration
└── calculator/
    └── page.tsx                # Calculator sub-route
```

**Key files you'll modify:**
- **`page.tsx`** - Controls which screen shows when (navigation logic)
- **`*View.tsx` files** - Individual screens in your flow
- **`calculator/page.tsx`** - Sub-routes for complex flows

---

## Common Customizations

### Add a New Screen

```
"Add a new screen called VerificationView that shows after the calculator"
```

Claude will:
1. Create the new file
2. Add it to the navigation logic in `page.tsx`
3. Connect it to the flow

### Change Screen Content

```
"Update the HomeMainView to show a spending graph instead of transactions"
```

### Add Navigation

```
"Add a back button to the confirmation screen that goes to payment methods"
```

### Modify Animations

```
"Make the success screen more celebratory with confetti animation"
```

---

## Best Practices

### ✅ DO:
- **Copy first, then customize** - Start with Send Money flow
- **Reuse existing components** - Check [COMPONENTS_GUIDE.md](COMPONENTS_GUIDE.md) first
- **Keep brand consistency** - Follow [BRAND_GUIDELINES.md](BRAND_GUIDELINES.md)
- **Test on mobile** - Use [PHONE_ACCESS.md](PHONE_ACCESS.md) to view on your phone
- **Use specific prompts** - Tell Claude exactly what you want

### ❌ DON'T:
- Start from scratch - always copy Send Money
- Create new components if existing ones work
- Break the Wise design system (colors, fonts, spacing)
- Modify the original `/prototypes/sendmoney` folder

---

## Updating the Homepage

Your prototype needs a link on the homepage so people can find it!

### Method 1: Ask Claude

```
"Add a card for my 'my-flow' prototype to the homepage.
Title: My Awesome Flow
Description: A new way to experience money transfers
Put it after the Send Money Flow card."
```

### Method 2: Manually Edit

1. Open `src/app/page.tsx`
2. Find the "Prototypes Section" (around line 127)
3. Copy one of the existing cards
4. Update the title, description, and route:

```typescript
<motion.div
  variants={featureVariants}
  className="bg-wise-background-elevated rounded-[40px] p-8 border border-wise-border-neutral cursor-pointer"
  onClick={() => router.push("/prototypes/my-flow")}
  // ... rest of the card
>
  <h3 className="text-2xl font-semibold text-wise-content-primary mb-2">
    My Awesome Flow
  </h3>
  <p className="text-wise-content-secondary leading-relaxed">
    A new way to experience money transfers
  </p>
</motion.div>
```

---

## Registering Your Prototype Route

⚠️ **Important**: Your prototype needs to be registered in the navigation service!

Ask Claude:

```
"Add my prototype route '/prototypes/my-flow' to the navigationService.ts file"
```

This ensures the back button and navigation work correctly.

---

## Testing Your Prototype

1. **Desktop browser**: Visit http://localhost:3000
2. **Mobile device**: See [PHONE_ACCESS.md](PHONE_ACCESS.md)
3. **Test navigation**: Click through all screens
4. **Test back button**: Make sure it goes to the homepage
5. **Check animations**: Transitions should be smooth

---

## Troubleshooting

**Problem: Clicking my prototype card does nothing**
- Check that the route in `onClick` matches your folder name
- Make sure the route is registered in `navigationService.ts`

**Problem: Back button goes to wrong page**
- Check `prototypes/layout.tsx` back button logic
- Ensure your route is in the `navigationService.ts` types

**Problem: Screens don't look right**
- Make sure you copied all files from `/prototypes/sendmoney`
- Check that you're using Wise components (not custom HTML)

**Problem: Changes aren't showing**
- Refresh your browser (Cmd+R / Ctrl+R)
- Check the terminal for errors
- Make sure the dev server is running

---

## Next Steps

- **[Components Guide](COMPONENTS_GUIDE.md)** - Learn about available components
- **[Brand Guidelines](BRAND_GUIDELINES.md)** - Keep your design on-brand
- **[AI Integration](AI_INTEGRATION_GUIDE.md)** - Add smart features

---

## Example: Complete Prototype Creation

Here's a full example of creating a new "Request Money" prototype:

```
User: "I want to create a 'Request Money' prototype based on Send Money.
       Copy the sendmoney folder to /prototypes/request.
       Add a card to the homepage with title 'Request Money'
       and description 'Ask friends to send you money'.
       Update the success screen to say 'Request sent successfully!'"

Claude will:
1. ✅ Copy all files to /prototypes/request
2. ✅ Add the route to navigationService.ts
3. ✅ Create a homepage card
4. ✅ Modify SuccessView.tsx with new messaging
5. ✅ Confirm everything works
```

That's it! You now have a working prototype. 🎉

---

**Ready to build?** Ask Claude: "Let's create a new prototype based on Send Money!"
