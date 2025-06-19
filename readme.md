# os-chat

A versatile AI chatbot application built with TanStack Start and Vercel AI SDK

## Installation and Setup

Follow these steps to get the project up and running locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ankitk26/os-chat.git
    cd os-chat
    ```
2.  **Install dependencies:**
    ```bash
    pnpm install
    ```
3.  **Set up Environment Variables:**
    Create a `.env` file in the root of your project and add any necessary API keys for default server-side access (e.g., for OpenRouter).
    ```
    # Example for OpenRouter (if you plan to use a server-side default)
    OPENROUTER_API_KEY="your_openrouter_api_key_here"
    ```
4.  **Run the development server:**
    ```bash
    pnpm dev
    ```

## Usage

Once the development server is running, you can access the application in your browser, typically at `http://localhost:3000`. You can then begin interacting with the AI models.

## License

This project is open-source and licensed under the [MIT License](LICENSE).
