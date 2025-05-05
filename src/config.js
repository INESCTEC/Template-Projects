// GitHub Projects Showcase Configuration
export default {
  // Organization & Theme
  organization: "INESCTEC", // GitHub organization name
  title: "Open Source Software", // Page title
  logo: "/logo.png", // Path to your logo (place in public folder)
  
  // Theme colors (Tailwind CSS classes or hex values)
  colors: {
    primary: "#00305C", // Primary color - dark blue
    secondary: "#0093C7", // Secondary color - light blue
    accent: "#009DE0", // Accent color - medium blue
    text: "#333333", // Main text color
    background: "#ffffff", // Background color
  },

  // Categories to show (these will appear as tabs)
  categories: [
    { id: "all", label: "All" },
    { id: "energy", label: "Energy" },
    { id: "ai", label: "Artificial Intelligence" },
    { id: "iot", label: "Internet of Things" },
    { id: "robotics", label: "Robotics" }
  ],

  // GitHub token environment variable name
  githubTokenEnvName: "GH_TOKEN",
  
  // Data refresh settings
  dataRefreshInterval: 86400, // Time in seconds (default: 24 hours)

  // Projects input data - this is what users would customize
  projects: [
    {
      "project_name": "Energy Management System",
      "project_topic": "energy-management",
      "project_area": "Energy",
      "project_description": "Advanced energy management systems for smart grids and renewable energy integration.",
      "project_url": "https://example.com/energy-management",
      "project_website": "https://energy.inesctec.pt"
    },
    {
      "project_name": "Machine Learning Research",
      "project_topic": "machine-learning",
      "project_area": "Artificial Intelligence",
      "project_description": "Cutting-edge machine learning research and applications for industrial use cases.",
      "project_url": "https://example.com/ml-research",
      "project_website": "https://ai.inesctec.pt"
    },
    {
      "project_name": "IoT Sensors Network",
      "project_topic": "iot-sensors",
      "project_area": "Internet of Things",
      "project_description": "Advanced sensor networks for IoT applications and smart environments.",
      "project_url": "https://example.com/iot-sensors"
    },
    {
      "project_name": "Autonomous Robotics",
      "project_topic": "robotics",
      "project_area": "Robotics",
      "project_description": "Research on autonomous robotic systems for industry and healthcare.",
      "project_url": "https://example.com/robotics",
      "project_website": "https://robotics.inesctec.pt"
    }
  ]
}