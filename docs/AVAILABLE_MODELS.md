# Available models

The following is a list of models that are available to use with the `llm-gateway` service as of 8th March 2024. This list might not be up to date and will be updated as new models are added.

To get the latest list of models, you can use the `get_vendor_model_id_mapping()` method from the `wise_chain.load_model` module.

```python
from wise_chain.load_model import get_vendor_model_id_mapping
from wise_chain.auth.authorizer import get_authorized_session

session = get_authorized_session('user')
vendor_mapping = get_vendor_model_id_mapping(session)
print(vendor_mapping)
```

### Bedrock

- amazon.titan-tg1-large
- amazon.titan-text-express-v1
- amazon.titan-embed-text-v1
- amazon.titan-embed-g1-text-02

### Credal

#### Anthropic

- Credal as a vendor
  - claude-3-haiku-20240307
  - claude-3-5-haiku-latest
  - claude-3-opus-20240229
  - claude-3-5-sonnet-20240620
  - claude-3-5-sonnet-latest
  - claude-3-7-sonnet-20250219
  - claude-3-7-sonnet-latest
  - claude-4-sonnet-20250514
  - claude-4-opus-20250514
  - claude-opus-4-1-20250805
  - claude-sonnet-4-5-20250929

- Bedrock as a vendor
  - claude-3-5-haiku / us.anthropic.claude-3-5-haiku-20241022-v1:0
  - claude-4-5-haiku / us.anthropic.claude-haiku-4-5-20251001-v1:0
  - claude-3-5-sonnet-v2 / us.anthropic.claude-3-5-sonnet-20241022-v2:0
  - claude-3-7-sonnet / us.anthropic.claude-3-7-sonnet-20250219-v1:0
  - claude-4-sonnet / us.anthropic.claude-sonnet-4-20250514-v1:0
  - claude-4-5-sonnet / us.anthropic.claude-sonnet-4-5-20250929-v1:0
  - claude-3-opus / us.anthropic.claude-3-opus-20240229-v1:0
  - claude-4-opus / us.anthropic.claude-opus-4-20250514-v1:0
  - claude-4-1-opus / us.anthropic.claude-opus-4-1-20250805-v1:0

#### OpenAI
- gpt-5
- gpt-5.1
- gpt-5-mini
- gpt-5-nano
- gpt-3.5-turbo
- gpt-4
- gpt-4-0125-preview
- gpt-4-turbo-preview
- gpt-4-turbo
- gpt-4o
- gpt-4o-mini
- gpt-4.1-mini
- gpt-4.1-nano
- o4-mini
- o3
- o1-mini
- gpt-4o-search-preview
- o1
- o3-mini
- gpt-4o-mini-search-preview
- gpt-4-1106-preview
- gpt-3.5-turbo-1106
- gpt-3.5-turbo-16k
- text-embedding-ada-002
- text-embedding-3-small
- text-embedding-3-large

#### VertexAI
- gemini-2.5-flash
- gemini-2.5-pro
- gemini-2.0-flash-lite-001
- gemini-2.0-flash-001

### A21

- ai21.jamba-1-5-large-v1:0
- ai21.jamba-1-5-mini-v1:0
