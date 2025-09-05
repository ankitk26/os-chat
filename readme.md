# OS Chat

OS Chat is an open-source AI chatbot application built with TanStack Start, Convex, and the Vercel AI SDK.  
It supports multiple AI providers, real-time messaging, and chat organization.

## Features

### AI Model Support
- Google Gemini (2.0 Flash, 2.5 Flash, 2.5 Pro)
- OpenAI (GPT-4o, GPT-4o Mini, GPT-5, o3)
- Anthropic (Claude 3.5 Sonnet, 3.7 Sonnet, Sonnet 4)
- OpenRouter (100+ models via a single API)
- BYOK (Bring your own API keys)

### Chat Management
- Real-time streaming responses
- Organize chats with folders
- Pin or branch conversations
- Share chats with others
- Edit or regenerate messages

### UI
- Light and dark themes
- Code syntax highlighting (Shiki)
- Math rendering (KaTeX)
- Markdown support

### Authentication
- GitHub OAuth (via Better Auth)

## Tech Stack

**Frontend**
- TanStack Start (full-stack React framework)
- TanStack Query (server state management)
- ShadCN (UI components)
- Zustand (client state management)

**Backend**
- Convex (real-time database and backend)
- Better Auth (authentication library)
- Vercel AI SDK (AI model integration)
- Zod (schema validation)

**AI Providers**
- OpenAI (GPT models)
- Anthropic (Claude models)
- Google (Gemini models)
- OpenRouter (unified AI API)
- BYOK support for all major providers

**Development**
- Ultracite (code formatting and linting)
- Biome (fast linter and formatter)

## Installation

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm
- Git

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/ankitk26/os-chat.git
   cd os-chat
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up Convex:
   ```bash
   npx convex dev
   ```
   Follow the prompts to create a new Convex project and get your deployment URL.

4. Create a `.env.local` file in the root directory:
   ```env
   # Convex (Required)
   VITE_CONVEX_URL="https://your_project_url.convex.cloud"
   
   # BetterAuth (Required for authentication)
   BETTER_AUTH_SECRET="your_better_auth_secret"
   BETTER_AUTH_URL="http://localhost:3000"
   
   # GitHub OAuth (Required for authentication)
   GITHUB_CLIENT_ID="your_github_client_id"
   GITHUB_CLIENT_SECRET="your_github_client_secret"
   
   # Optional: Server-side API keys for default access
   OPENROUTER_API_KEY="your_openrouter_api_key"
   OPENAI_API_KEY="your_openai_api_key"
   ANTHROPIC_API_KEY="your_anthropic_api_key"
   GOOGLE_GENERATIVE_AI_API_KEY="your_google_api_key"
   XAI_API_KEY="your_xai_api_key"
   ```

5. Run the development server:
   ```bash
   pnpm dev
   ```

6. Open your browser and navigate to `http://localhost:3000`

## Tech Stack

### Frontend
- TanStack Start - Full-stack React framework
- TanStack Query - Server state management
- ShadCN - UI components
- Zustand - Client state management

### Backend
- Convex - Real-time database and backend
- Better Auth - Authentication system
- Vercel AI SDK - AI model integration
- Zod - Schema validation

### AI Providers
- OpenAI - GPT models
- Anthropic - Claude models
- Google - Gemini models
- OpenRouter - Unified AI API
- BYOK Support - All major providers

### Development
- Ultracite - Code formatting and linting
- Biome - Fast linter and formatter

## Usage

1. Sign in with your GitHub account
2. Configure API keys in settings (optional - you can use OpenRouter for all models)
3. Start chatting with any available AI model
4. Organize chats by creating folders and pinning important conversations

## License

This project is open-source and licensed under the [MIT License](LICENSE).

## Support

- Issues: [GitHub Issues](https://github.com/ankitk26/os-chat/issues)
- Discussions: [GitHub Discussions](https://github.com/ankitk26/os-chat/discussions)
- Documentation: Check the code comments and type definitions