# wise-chain

`wise-chain` library hosts utility functions and Langchain Models for calling [MLP's LLM Gateway](https://transferwise.atlassian.net/wiki/spaces/PLAT/pages/2980548150/MLP+LLM+Gateway). This gives users a secure way to query Wise approved LLMs for creating LLM based applications.

- [Installation](#installation)
- [Getting Started](#getting-started)
  - [LangChain LLMs](#langchain-llms-deprecated)
  - [LangChain ChatModels](#langchain-chatmodels-recommended)
  - [LangChain Embeddings](#langchain-embeddings)
  - [Using Langchain Models from Sagemaker, Airflow etc.](#using-langchain-models-from-sagemaker-airflow-etc)
  - [Querying `llm-gateway` Directly](#querying-llm-gateway-directly)
  - [Using AWS Textract](#using-aws-textract)
  - [GPT 4 Vision](docs/gpt_4_vision.md)
  - [Prompt Caching](notebooks/prompt_caching.ipynb)

## Installation

To install `wise-chain` simply use pip (or poetry) with arti as your pypi index

```
pip install wise-chain --index-url https://arti.tw.ee/artifactory/api/pypi/pypi-virtual/simple
```

### Rate Limits
Rate limits are imposed by vendors. Current known values can be found [here](https://transferwise.atlassian.net/wiki/spaces/GenAIP/pages/3890743117/Vendor+Rate+Limits)

At time of writing, all use cases use from the same quota's. This mean that using wise-chain or LLM gateway with high token or request
throughput could cause issues in production due to throttling exceptions.

If you are experimenting locally **DO NOT RUN PROMPTS WITH CONCURRENCY** (i.e. multithreaded / async) without reaching out to `#generative-ai-platform-public` first.
This will allow us to monitor your usage to ensure we do not affect production use cases.

Token usage by vendor and use case can be monitored in [grafana](https://grafana.production.o11y-wise.com/d/decqex1on4yrkf/llm-gateway?orgId=1&from=now-1h&to=now&timezone=browser&var-cluster=$__all&var-deployment_group=$__all&var-pod=$__all&var-downstream=$__all&var-team=$__all&var-use_case=$__all&var-model_id=$__all)


### Available Models

LLM-Gateway has a number of most popular models available, e.g. `gpt-4o`, `claude-3-5-sonnet` etc.

The full list of available models can be found in the [AVAILABLE_MODELS.md](docs/AVAILABLE_MODELS.md) file.

These can also be fetched programatically using
```python
from wise_chain.load_model import list_available_models
print(list_available_models())
```

We also now provide OCR through AWS Textract, though with the known limitation
that we currently support only local files. There are issues with providing
Textract over S3 objects directly related to IAM permissions for the gateway and
security concerns therein.

## Getting Started

To query the `llm-gateway` directly from your laptop you need to ensure the following:

1. You have requested `LLM Gateway Service` in Sailpoint and your request has been approved.
2. You are connected to the VPN.


### LangChain LLMs [Deprecated]
[LLM](https://python.langchain.com/api_reference/core/language_models/langchain_core.language_models.llms.LLM.html)'s are a basic structure that allow you to pass a prompt to an LLM and receive a response. This model is recommended for single shot LLM calls and not suitable for
multi turn applications such as chats or agents.

```python
from wise_chain import load_model

llm = load_model("gpt-4", team='money-team', use_case='hedging')
llm.invoke('When was TransferWise founded?')
```

Docs for LLM's can be found here: [LangchainLLMs](docs/langchain_LLMs.md)

### LangChain ChatModels [Recommended]
[ChatModels](https://python.langchain.com/api_reference/langchain/chat_models.html) provide a more complex API than the simple prompts and allows you to provide multi turn conversation information using
langchain SystemMessage HumanMessage and AIMessgage. These models are required for multi turn/agent langchain and langraph applications instead of `LLM`'s

```python
from wise_chain import load_chat_model, ChatModelProvider
from langchain_core.messages import SystemMessage, HumanMessage

model = load_chat_model(
    ChatModelProvider.ANTHROPIC,
    "us.anthropic.claude-3-5-haiku-20241022-v1:0",
    team="generative-ai-platform",
    use_case="wise-chain-demo"
)

model.invoke([SystemMessage("You are a helpful assistant"),
              HumanMessage("What is the capital of france?")])
```

A full example can be seen here: [QuickstartGuide](notebooks/chat_models_quickstart.ipynb)

### LangChain Embeddings
Langchain Embeddings allow you to retrieve a vector representation for a string to perform semantic similarity search across a vector space.

```python
from wise_chain import load_model

embeddings = load_model('amazon.titan-embed-g1-text-02', team='your-team', use_case='sentiment-analysis')
embeddings.embed_query('I love working as Wise')
```

Docs for Embeddings can be found here: [LangchainEmbeddings](docs/langchain_embeddings.md)

### Using Langchain Models from Sagemaker, Airflow etc.

To use our LangChain wrappers from Sagemaker, Airflow etc. you simply need to set the
`ml_prod` flag to `True` when loading the model.

```python
from wise_chain import load_model

llm = load_model("gpt-4", team='money-team', use_case='hedging', ml_prod=True)
llm.invoke('When was TransferWise founded?')
```

### Querying `llm-gateway` Directly
wise_chain is the main way to authenticate with LLM gateway. You can use it to fetch authenticated headers to be used in a rest calls to LLM gateway.

For information on how to do this see: [LLMGatewayAuth](docs/llm_gateway_auth.md)

### Using AWS Textract

Textract provides English language and ASCII character OCR for JPEGs and PNGs up
to 5MB. The following snippet demonstrates its usage,

```python
from wise_chain.ocr.textract import Textract


textract_client = Textract()
response = textract_client.detect_document_text_from_file('/path/to/image.jpg')
```

The response is a `dict` which is documented in the [AWS Textract API Docs](https://docs.aws.amazon.com/textract/latest/dg/API_DetectDocumentText.html).

### GPT-4 Vision
[Docs](docs/gpt_4_vision.md)