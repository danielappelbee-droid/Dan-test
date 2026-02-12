# 🤖 AI Integration Guide

Add intelligent features to your prototypes using Wise's secure LLM Gateway.

---

## ⚠️ CRITICAL: Use ONLY Wise's LLM Gateway

**DO NOT create API keys with external providers (OpenAI, Anthropic, etc.)**

Wise has a secure internal LLM Gateway that:
- ✅ Provides authenticated access to GPT-4, Claude, and other models
- ✅ Works through Wise's security infrastructure
- ✅ Includes rate limiting and monitoring
- ✅ Complies with Wise security standards
- ✅ Requires NO external API keys

**All instructions are in WISECHAIN.md** - this guide is a simplified walkthrough.

---

## Prerequisites

Before you start, you MUST have:

- [ ] **Sailpoint access** - Request "LLM Gateway Service" in Sailpoint (wait for approval)
- [ ] **VPN connection** - Connected to Wise VPN
- [ ] **Python installed** - Python 3.8+ with pip

**Without these, AI integration will not work.**

---

## Quick Start: Add AI Chat to Your Prototype

### Step 1: Ask Claude to Set Up the Server

Simply tell Claude:

```
"Create a Python LLM server using the instructions in WISECHAIN.md.
Use the Claude 3.5 Sonnet model.
Create an API endpoint that I can call from my Next.js prototype."
```

Claude will:
1. Read WISECHAIN.md
2. Install the `wise-chain` library
3. Create a Python server with LLM access
4. Set up API endpoints for your frontend

### Step 2: Verify VPN and Access

Make sure you're connected to Wise VPN:
```bash
# Check VPN status
# (You should see Wise network details)
```

### Step 3: Test the Integration

Ask Claude to:
```
"Create a simple chat interface in my prototype that calls the LLM server"
```

---

## What You Can Build

### Chat Interfaces
Ask the AI questions, get responses
```
"Add a chat bubble at the bottom of the screen where I can ask questions about my transfer"
```

### Smart Suggestions
AI-generated recommendations
```
"When selecting a recipient, show AI-suggested reasons for the transfer"
```

### Dynamic Content
AI-written microcopy and messages
```
"Generate a personalized success message based on the transfer amount and recipient"
```

### Voice Input
Speak to your prototype
```
"Add a microphone button that lets me dictate the transfer amount"
```

---

## Technical Details (for Claude)

When Claude sets up AI integration, it will use:

**Python Server:**
```python
from wise_chain import load_chat_model, ChatModelProvider
from langchain_core.messages import SystemMessage, HumanMessage

# Load Wise-approved model
model = load_chat_model(
    ChatModelProvider.ANTHROPIC,
    "us.anthropic.claude-3-5-sonnet-20241022-v2:0",
    team="your-team",
    use_case="prototype-demo"
)

# Make requests
response = model.invoke([
    SystemMessage("You are a helpful Wise assistant"),
    HumanMessage("What's the best way to send money to France?")
])
```

**Frontend Integration:**
```typescript
// In your Next.js prototype
const response = await fetch('http://localhost:8000/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: userMessage
  })
});

const data = await response.json();
console.log(data.response);
```

---

## Available Models

From WISECHAIN.md, you have access to:
- **GPT-4o** - Fast, general-purpose
- **Claude 3.5 Sonnet** - Great for writing and reasoning
- **Claude 3.5 Haiku** - Fast, cost-effective
- And more...

**To see all available models:**
```python
from wise_chain.load_model import list_available_models
print(list_available_models())
```

---

## Rate Limits ⚠️

**IMPORTANT:** Don't overload the system!

- ❌ **DO NOT** run prompts with concurrency (multithreaded/async)
- ❌ **DO NOT** make rapid-fire requests
- ✅ **DO** reach out to `#generative-ai-platform-public` if you need high throughput

Rate limits are shared across all Wise use cases. Exceeding them affects production systems!

---

## Common Use Cases

### 1. Chat Assistant

**What:** A floating chat bubble for asking questions

**Prompt:**
```
"Add a chat interface that slides up from the bottom.
Use the LLM to answer questions about Wise transfers.
Style it with Wise brand guidelines."
```

### 2. Smart Form Filling

**What:** AI suggests field values based on context

**Prompt:**
```
"When I select a recipient, use AI to suggest a transfer reason
based on my past transfers to them."
```

### 3. Personalized Messages

**What:** Dynamic microcopy based on user actions

**Prompt:**
```
"Generate a personalized success message using AI
that includes the recipient name, amount, and estimated arrival."
```

### 4. Voice Commands

**What:** Speak instead of type

**Prompt:**
```
"Add a microphone button to the amount input.
Use browser speech recognition to capture the amount,
then use AI to parse it into a number."
```

---

## Troubleshooting

### "Failed to connect to LLM Gateway"
- ✅ Check you're on Wise VPN
- ✅ Verify Sailpoint access is approved
- ✅ Confirm `wise-chain` is installed

### "Authentication failed"
- ✅ VPN must be active
- ✅ Sailpoint approval can take time - check your request status
- ✅ Try refreshing your VPN connection

### "Rate limit exceeded"
- ⏸️ Slow down your requests
- ✅ Contact `#generative-ai-platform-public` for guidance
- ✅ Avoid loops or rapid repeated calls

### "Model not found"
- ✅ Check available models: `list_available_models()`
- ✅ Use exact model names from WISECHAIN.md
- ✅ Verify model name syntax (e.g., `us.anthropic.claude-3-5-sonnet-20241022-v2:0`)

---

## Security Reminders

### ✅ DO:
- Use WISECHAIN.md instructions ONLY
- Keep all requests through Wise VPN
- Use approved models from the list
- Follow rate limit guidelines

### ❌ NEVER:
- Create external API keys (OpenAI, Anthropic, etc.)
- Share credentials or access tokens
- Bypass the LLM Gateway
- Use personal API keys
- Store API keys in code

---

## Example: Complete AI Chat Integration

Here's a full example conversation with Claude:

```
User: "I want to add AI chat to my prototype.
       Users should be able to click a button and ask questions about their transfer.
       Use the WISECHAIN.md instructions to set up the backend."

Claude will:
1. ✅ Install wise-chain library
2. ✅ Create Python server with FastAPI
3. ✅ Set up Claude 3.5 Sonnet model
4. ✅ Create /chat endpoint
5. ✅ Add chat button to your prototype
6. ✅ Create chat interface with Wise styling
7. ✅ Connect frontend to backend
8. ✅ Test the integration
9. ✅ Provide usage instructions
```

---

## Advanced Features

### Prompt Caching
For repeated requests, use prompt caching to save tokens:
- See `notebooks/prompt_caching.ipynb` in WISECHAIN.md

### GPT-4 Vision
Analyze images and screenshots:
- See `docs/gpt_4_vision.md` in WISECHAIN.md

### Embeddings
For semantic search and similarity:
```python
from wise_chain import load_model

embeddings = load_model(
    'amazon.titan-embed-g1-text-02',
    team='your-team',
    use_case='semantic-search'
)
```

---

## Next Steps

1. **Get Sailpoint access** - This can take a few days, request early!
2. **Connect to VPN** - Required for all AI features
3. **Ask Claude** - "Set up AI integration using WISECHAIN.md"
4. **Start simple** - Begin with a basic chat interface
5. **Get creative** - Voice, suggestions, personalization!

---

## Resources

- **Full technical documentation:** [WISECHAIN.md](WISECHAIN.md)
- **Wise AI Slack:** `#generative-ai-platform-public`
- **Rate limits and monitoring:** [Grafana Dashboard](https://grafana.production.o11y-wise.com/d/decqex1on4yrkf/llm-gateway)
- **Model list:** Run `list_available_models()` or check `docs/available_models.md`

---

## Important Reminders

🔐 **Security:** Only use Wise's LLM Gateway - never external providers
🔌 **VPN Required:** All AI features need active Wise VPN connection
⏱️ **Rate Limits:** Respect shared quotas - contact team if you need more
📝 **Sailpoint:** Get "LLM Gateway Service" access approved first

---

**Ready to add AI?** Ask Claude: "Set up LLM integration using WISECHAIN.md" 🤖
