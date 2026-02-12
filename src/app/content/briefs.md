# Design Briefs

----

## Part 1: Build something fun

Our goal is to start talking to Claude. Don't worry about getting it wrong, just see what Claude can do with a bit of prompting.

### 1.1 Create a simple calculator app

Drop this one line prompt into claude and see if it can 'one-shot' a working calculator for you.

> Make a simple calculator in one fully self-contained HTML file (HTML/CSS/JS only, no external assets). Embed all code inline and support basic ops: + − × ÷, clear, =.

### 1.2 Add some spice

Try asking Claude to make your calculator more interesting. Try things like:
- Make buttons briefly shake when pressed
- Make a tiny ‘ow!’ speech bubble appear for ~250ms on press
- Whole calculator does a short jelly wobble animation sometimes
- Display flashes a random emoji (💥 🤯 🍌 🎉 👀) before updating
- Buttons make silly sounds (boop/blip/sproing) using tiny base64 audio
- Random complaints on each press (“why math?”, “not again…”, “ugh, fine”)
- 1 in 20 button presses: “YOU HAVE AWAKENED THE ANCIENT MATH”
- Brief inverted-colour flash of the whole calculator
- A tiny running character animation crosses the display every few clicks

----

## Part 2: Build something real

Let's create something based on Wise's actual design challenges. The idea here is to use the building blocks and your imagination to rapidly build an experience you never would be able to otherwise.

We'll be using the [send money prototype](/prototypes/sendmoney) as our basis for this. You can choose to extend it in whichever way you'd like, along three briefs.

### 2.1 Choose a brief

First let's make a plan. Choose a brief and use Claude's 'plan mode' to plan your idea.

Celebrate Success
> Redesign the success screen so it genuinely feels like “Yes, that worked!”. Explore how AI can help craft better moments of delight or communication whilst balancing reassurance that everything worked.

Reduce Uncertainty
> Create smart, well-timed nudges that step in when people get stuck. Whether they’re sending money for the first time, double-checking details, or moving a big amount. Help them feel calm, confident, and supported.

Design Tools
> Create mini tools that let designers fine-tune interface details, like spacing, motion, transitions, polish. Use lightweight sliders or inline controls that make iteration quick and engineering handoff joyful. Build them directly into the product or through a small Figma plugin.

### 2.2 Build your prototype!

Once you're happy, switch claude to 'auto accept' and get vibe coding.

You'll notice that Claude can make a plan and tick off steps as it goes. If you'd like to test at each stage, let Claude know - otherwise it will keep going until all steps are complete.

Here are some interaction ideas you could try

- **Voice as an input:** Let users speak intent or confirm actions hands-free.
- **Dynamic content generation:** Use AI to shape microcopy, hints, and reassurance in real time.
- **Motion & sound cues:** Introduce subtle feedback that adds clarity or delight.
- **Power-user mode:** Start with a simplified view, and unlock an advanced path for experts.
- **Predictive assistance:** Anticipate intent and offer timely shortcuts or confirmations.
- **Gamification:** Think Google's no internet dinosaur game. Where can you add unexpected delight?


### 2.3 Demo and win a hat

We'll get a few brave people up at the end to show us what they built. We'll have hats to give away to the three winners.

---

# Other things to try

This is just the start...

### Test on your phone
Access the prototype on your phone. Ask Claude how and it should give you an IP address (for example http://192.168.1.14:3000) that you can visit on a different device to see your prototype.

### Build an AI chat in your prototype
Build chat inside your app using Wise's LLM server. **Important:** You need VPN access and Sailpoint approval first. Ask Claude:
> create a Python LLM server using the instructions in WISECHAIN.md

### Use Figma MCP
Set up the Figma MCP server by
1. running **claude mcp add --transport http figma https://mcp.figma.com/mcp** in your terminal (or asking Claude to do it).
2. type **/mcp** and select Figma, authenticate and you're done.
3. Choose a frame in Figma, copy as link to frame, drop in claude and ask it to recreate for you.