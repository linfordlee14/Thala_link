# ThalaLink: AI Document & Presentation Generator

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2F<YOUR_GITHUB_USERNAME>%2F<YOUR_REPO_NAME>)

This web application transforms a detailed project brief into professional documents and presentation slide decks using the Google Gemini AI. It's built with React, TypeScript, Vite, Tailwind CSS, and a secure serverless backend on Vercel.

The project is based on the "ThalaLink" concept, an AI-powered ecosystem for blood and care management for Thalassemia patients, demonstrating a real-world use case for generative AI.

## Live Demo

**(Link to your Vercel deployment will go here)**

## Features

-   **AI-Powered Content Generation**: Utilizes the Google Gemini API (`gemini-2.5-flash`) to generate structured content.
-   **Dual Output Formats**:
    -   Generate a comprehensive **Project Proposal Document**.
    -   Generate a 10-slide **Pitch Deck Presentation**.
-   **Downloadable Assets**: Download the generated content as `.docx` and `.pptx` files directly from the browser.
-   **Secure API Handling**: All communication with the Gemini API is handled through a secure serverless backend, ensuring your API key is never exposed on the client-side.
-   **Modern Frontend**: A clean and responsive UI built with React, TypeScript, Vite, and Tailwind CSS.
-   **Zero Configuration Deployment**: Ready to be deployed on Vercel with minimal setup.

## Technology Stack

-   **Frontend**: React, TypeScript, Vite, Tailwind CSS
-   **Backend**: Vercel Serverless Functions (Node.js Runtime)
-   **AI**: Google Gemini API (`@google/genai`)
-   **Client-Side File Generation**: `docx`, `pptxgenjs` (loaded dynamically)

---

## Requirements

To run or deploy this project, you will need:

1.  **Node.js and npm**: Required for installing dependencies.
2.  **A Google Gemini API Key**: You can get one from the [Google AI Studio](https://aistudio.google.com/app/apikey).
3.  **Vercel CLI** (for local development): `npm install -g vercel`

---

## Setup and Deployment

Follow these instructions to get the project running locally or deploy it to Vercel.

### 1. Local Development

Running the project locally requires the Vercel CLI to correctly emulate the serverless function environment.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>.git
    cd <YOUR_REPO_NAME>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env.development.local` in the root of the project and add your Gemini API key:
    ```
    API_KEY="YOUR_GEMINI_API_KEY_HERE"
    ```

4.  **Run the development server:**
    Use the Vercel CLI to start the local server. This will run both the frontend (Vite) and the serverless function.
    ```bash
    vercel dev
    ```
    The application will be available at `http://localhost:3000`.

### 2. Deployment to Vercel

This project is optimized for a seamless deployment to Vercel.

1.  **Push to GitHub:**
    Create a new repository on GitHub and push the project code.

2.  **Import Project on Vercel:**
    -   Log in to your Vercel account.
    -   Click "Add New..." -> "Project".
    -   Import the GitHub repository you just created. Vercel will automatically detect that it is a Vite project.

3.  **Configure Environment Variable:**
    -   During the import process or in the project's settings (`Settings` -> `Environment Variables`), add your Gemini API key.
    -   **Name**: `API_KEY`
    -   **Value**: `YOUR_GEMINI_API_KEY_HERE`

4.  **Deploy:**
    -   Click the "Deploy" button. Vercel will build and deploy your application.

## How It Works

1.  **Frontend (React)**: The user clicks a "Generate" button. The React application sends a `POST` request to its own backend endpoint (`/api/generate`).
2.  **Backend (Vercel Serverless Function)**: The serverless function at `api/generate.ts` receives the request and securely calls the Google Gemini API.
3.  **Response**: The Gemini API returns structured JSON, which the serverless function forwards to the frontend.
4.  **Rendering and Download**: The frontend receives the JSON, renders the content, and uses client-side libraries to generate downloadable `.docx` or `.pptx` files.

## Project Structure

```
/
├── api/
│   └── generate.ts        # Vercel serverless function
├── src/
│   ├── components/        # React components
│   ├── services/          # Client-side services
│   ├── App.tsx            # Main application component
│   ├── constants.ts       # Project brief text
│   ├── index.css          # Tailwind CSS directives and custom styles
│   ├── main.tsx           # React app entry point
│   └── types.ts           # TypeScript type definitions
├── .gitignore
├── index.html             # Main HTML file for Vite
├── package.json
├── postcss.config.js      # PostCSS config for Tailwind
├── tailwind.config.js     # Tailwind CSS config
├── tsconfig.json          # Main TypeScript config
├── tsconfig.node.json     # TypeScript config for Vite/build tooling
└── vite.config.ts         # Vite configuration
```

## License

This project is open-source and available under the MIT License.