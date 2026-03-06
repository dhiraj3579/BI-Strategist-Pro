# BI Strategist Pro

**BI Strategist Pro** is a high-end platform designed for BI Developers and Data Scientists to architect comprehensive dashboard roadmaps and visualize data instantly. Leveraging the power of Google's Gemini 3 models, it transforms raw data into actionable insights and detailed technical implementation plans.

![BI Strategist Pro Banner](https://via.placeholder.com/1200x400?text=BI+Strategist+Pro)

## 🚀 Key Features

- **Live Viz (Instant Dashboards):**
  - Upload your Excel or CSV data files.
  - Automatically generate interactive dashboards with KPIs and charts.
  - Visualizes trends and distributions using Recharts.
  - Powered by AI to select the most relevant metrics based on your data structure.

- **Tech Plan (Architectural Roadmaps):**
  - Generates detailed, PDF-style technical roadmaps for BI solutions.
  - Includes Data Architecture (Schema, ETL), BI Tool Implementation Strategy (Power BI/Tableau), and Advanced Analytics (Python/R) recommendations.
  - Provides specific DAX/Calculated Field code snippets and ML strategies.

- **AI-Powered Insights:**
  - Utilizes Google's **Gemini 3 Flash** and **Gemini 3 Pro** models for high-speed and high-quality generation.
  - Context-aware suggestions based on your specific industry and company type.

## 🛠️ Tech Stack

- **Frontend:** [React](https://reactjs.org/) (v18+), [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Visualization:** [Recharts](https://recharts.org/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Data Parsing:** [SheetJS (xlsx)](https://docs.sheetjs.com/)
- **AI Integration:** [Google GenAI SDK](https://www.npmjs.com/package/@google/genai)

## 🏁 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/bi-strategist-pro.git
   cd bi-strategist-pro
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   # .env
   VITE_GEMINI_API_KEY=your_google_gemini_api_key_here
   ```
   *(Note: If using a backend proxy, configure `API_KEY` in your server environment instead)*

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:5173` (or the port shown in your terminal).

### Running on Other Devices (Local Network)

To access the app from your phone or another computer on the same Wi-Fi network:

1.  Find your computer's local IP address:
    *   **Windows:** Run `ipconfig` in command prompt (look for IPv4 Address).
    *   **Mac/Linux:** Run `ifconfig` or `ip a` (look for `inet` 192.168.x.x).
2.  On your mobile device, open the browser and visit:
    `http://<YOUR_IP_ADDRESS>:3000`
    (e.g., `http://192.168.1.5:3000`)

*Note: Ensure your firewall allows traffic on port 3000.*

## 📖 Usage Guide

1. **Select Mode:** Choose between "Live Viz" for an immediate dashboard or "Tech Plan" for a documentation roadmap.
2. **Context:** Enter your Company Type (e.g., "E-commerce Retailer") to tailor the AI's persona.
3. **Data Source:**
   - **Upload:** Drag and drop an Excel (.xlsx) or CSV file.
   - **Manual:** Or manually describe your data fields (e.g., "Date, Sales, Region, Product").
4. **Configuration:** Select your preferred BI Tool (Power BI / Tableau) and Scripting Language (Python / R).
5. **Generate:** Click "Build Roadmap" or "Strategizing..." to let the AI work its magic.

## 🚀 Deployment (24/7 Access)

To make your website accessible to everyone **even when your computer is off**, you need to deploy it to a cloud hosting provider.

### Option 1: Vercel (Recommended)
1.  Push your code to a GitHub repository.
2.  Go to [Vercel.com](https://vercel.com) and sign up.
3.  Click **"Add New Project"** and import your GitHub repository.
4.  Vercel will detect it's a Vite project.
5.  **Important:** Add your Environment Variables (`VITE_GEMINI_API_KEY`) in the Vercel dashboard under "Settings" > "Environment Variables".
6.  Click **Deploy**. Your site will be live at `https://your-project.vercel.app`.

### Option 2: Netlify
1.  Push your code to GitHub.
2.  Go to [Netlify.com](https://netlify.com) and sign up.
3.  Click **"Add new site"** > **"Import an existing project"**.
4.  Connect GitHub and select your repository.
5.  Add your environment variables in "Site settings" > "Build & deploy" > "Environment".
6.  Click **Deploy site**.

### Option 3: Render
1.  Push your code to GitHub.
2.  Go to [Render.com](https://render.com) and sign up.
3.  Click **"New"** > **"Static Site"**.
4.  Connect your GitHub repository.
5.  **Build Command:** `npm run build`
6.  **Publish Directory:** `dist`
7.  **Environment Variables:** Add `VITE_GEMINI_API_KEY` under "Advanced" > "Environment Variables".
8.  Click **Create Static Site**.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.



