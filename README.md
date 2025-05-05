## 🛠️ Quick Start

### 1. Use this template

Click the "Use this template" button to create a new repository based on this template.

### 2. Clone your repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure your GitHub API Token

This template requires a GitHub API token to fetch repository data:

1. Create a [Personal Access Token](https://github.com/settings/tokens) with the following permissions:
   - `repo` (Full control of private repositories)
   - `read:org` (Read organization information)

2. Add the token to your repository secrets:
   - Go to your repository on GitHub
   - Navigate to Settings > Secrets and variables > Actions
   - Click "New repository secret"
   - Name: `GH_TOKEN`
   - Value: Your personal access token
   - Click "Add secret"

3. For local development, create a `.env` file in the root directory:
   ```
   GH_TOKEN=your_github_token_here
   ```

### 5. Configure your organization and projects

Edit the `src/config.js` file to customize your showcase:

```javascript
// src/config.js
export default {
  // Organization & Theme
  organization: "YourOrgName", // GitHub organization name
  title: "Projects Showcase", // Page title
  logo: "/logo.png", // Path to your logo (place in public folder)
  
  // Theme colors
  colors: {
    primary: "#00305C", // Primary color - dark blue
    secondary: "#0093C7", // Secondary color - light blue
    accent: "#009DE0", // Accent color - medium blue
    text: "#333333", // Main text color
    background: "#ffffff", // Background color
  },

  // Categories to show
  categories: [
    { id: "all", label: "All" },
    { id: "ai", label: "Artificial Intelligence" },
    { id: "iot", label: "Internet of Things" },
    // Add more categories as needed
  ],

  // Projects input data
  projects: [
    {
      "project_name": "Project Name",
      "project_topic": "github-topic", // GitHub topic to search for
      "project_area": "Category", // Should match one of the category labels
      "project_description": "Project description text",
      "project_url": "https://example.com/project",
      "project_website": "https://project.example.com" // Optional
    },
    // Add more projects as needed
  ]
}
```

### 6. Add your logo and assets

- Place your organization logo in the `public` folder as `logo.png` 
- If you have project logos, add them to the `src/assets` folder

### 7. Fetch data from GitHub

```bash
npm run fetch-data
```

This command will:
- Use your GitHub token to fetch data about your repositories
- Group repositories by the topics defined in your config
- Save the data to `public/projects.json`

### 8. Run the development server

```bash
npm run dev
```

### 9. Build for production

```bash
npm run build
```

## 🚢 Deployment

### GitHub Pages

1. In your repository settings, navigate to "Pages"
2. Set up GitHub Pages to deploy from your GitHub Actions workflow

3. Add the following workflow file to `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Fetch GitHub data
        run: npm run fetch-data
        env:
          GH_TOKEN: ${{ secrets.GH_TOKEN }}
          
      - name: Build
        run: npm run build
        
      - name: Deploy to GitHub Pages
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: dist
```

### Automatic Data Updates

To keep your project data up-to-date, add a GitHub Action workflow to fetch data regularly:

```yaml
name: Update Project Data

on:
  schedule:
    - cron: '0 0 * * *'  # Run daily at midnight
  workflow_dispatch:     # Allow manual triggers

jobs:
  update-data:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Fetch GitHub data
        run: npm run fetch-data
        env:
          GH_TOKEN: ${{ secrets.GH_TOKEN }}
          
      - name: Commit and push if changed
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add public/projects.json
          git diff --quiet && git diff --staged --quiet || git commit -m "Update projects data"
          git push
```

## 📋 Customization

### Styling

The application uses Tailwind CSS for styling. You can customize the look and feel by:

1. Editing colors in `src/config.js`
2. Modifying the Tailwind theme in `tailwind.config.js`
3. Adding custom CSS in `src/index.css`

### Components

All components are in the `src/components` directory and can be customized:

- `Header.jsx` - Search, filters, and sorting
- `ProjectCard.jsx` - How each project is displayed
- `Footer.jsx` - Page footer
- `ScrollNavbar.jsx` - Navigation bar

## 📝 License

MIT
