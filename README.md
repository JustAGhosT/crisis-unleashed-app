# Crisis Unleashed

A strategic card game built with React and FastAPI.

## Prerequisites

- Node.js >= 16.0.0
- pnpm >= 8.0.0
- Python 3.8+
- MongoDB (running locally or accessible via connection string)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/crisis-unleashed-app.git
   cd crisis-unleashed-app
   ```

2. **Install pnpm** (if you haven't already)
   ```bash
   npm install -g pnpm
   ```

3. **Install frontend dependencies**
   ```bash
   pnpm install
   ```

4. **Set up Python backend**
   ```bash
   # Navigate to backend directory
   cd backend
   
   # Create and activate virtual environment (Windows)
   python -m venv .venv
   .\.venv\Scripts\Activate
   
   # Install Python dependencies
   pip install -r requirements.txt
   
   # Return to root directory
   cd ..
   ```

5. **Set up environment variables**
   - Copy `.env.example` to `.env` in both frontend and backend directories
   - Update the values as needed

6. **Start the development servers**
   ```bash
   # In the root directory
   pnpm start
   ```
   This will start both the frontend and backend servers in development mode.

## Available Scripts

- `pnpm start` - Start both frontend and backend in development mode
- `pnpm build` - Build the frontend for production
- `pnpm test` - Run frontend tests
- `pnpm lint` - Run ESLint on all JavaScript/TypeScript files
- `pnpm format` - Format all files with Prettier

## Project Structure

- `/frontend` - React application
- `/backend` - FastAPI server
- `/tests` - End-to-end and integration tests

## Development

### Frontend Development

```bash
cd frontend
pnpm start  # Starts the React development server
```

### Backend Development

```bash
cd backend
pnpm start  # Starts the FastAPI development server
```

## Deployment

1. Build the frontend:
   ```bash
   pnpm build
   ```

2. Deploy the backend to your preferred hosting service.

## License

MIT
