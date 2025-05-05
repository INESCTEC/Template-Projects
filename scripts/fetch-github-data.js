#!/usr/bin/env node

/**
 * GitHub Data Fetcher
 * This script fetches repository data from GitHub based on configuration
 * and generates a projects.json file for the application.
 */

// Import required modules
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import config from '../src/config.js';

// Load environment variables
dotenv.config();

// Constants
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_PATH = path.join(__dirname, '../public/projects.json');

// GitHub API URLs
const GITHUB_API_SEARCH_URL = "https://api.github.com/search/repositories";
const GITHUB_API_REPO_TOPICS_URL = "https://api.github.com/repos/{owner}/{repo}/topics";

// Get GitHub token from environment variables
const GITHUB_TOKEN = process.env[config.githubTokenEnvName];

// Validate GitHub token
if (!GITHUB_TOKEN) {
  console.error(`Error: GitHub token not found in environment variable ${config.githubTokenEnvName}`);
  console.error('Please set the token and try again.');
  process.exit(1);
}

/**
 * Get topics for a specific repository
 * @param {string} owner - Repository owner (organization)
 * @param {string} repo_name - Repository name
 * @returns {Promise<string[]>} - List of topics
 */
async function getRepoTopics(owner, repo_name) {
  const url = GITHUB_API_REPO_TOPICS_URL.replace('{owner}', owner).replace('{repo}', repo_name);
  const headers = {
    'Accept': 'application/vnd.github.mercy-preview+json',
    'Authorization': `token ${GITHUB_TOKEN}`
  };

  try {
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.names || [];
  } catch (error) {
    console.error(`Error fetching topics for ${repo_name}: ${error.message}`);
    return [];
  }
}

/**
 * Get top repositories for a specific topic in an organization
 * @param {string} org - Organization name
 * @param {string} topic - Topic to search for
 * @param {number} limit - Maximum number of repos to return
 * @returns {Promise<Object>} - Repository data
 */
async function getTopRepositories(org, topic, limit = 3) {
  let all_repos = [];
  let page = 1;
  
  try {
    while (true) {
      const params = new URLSearchParams({
        'q': `org:${org} topic:${topic}`,
        'per_page': '100',
        'page': page.toString()
      });
      
      const headers = {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${GITHUB_TOKEN}`
      };
      
      const response = await fetch(`${GITHUB_API_SEARCH_URL}?${params}`, { headers });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      const public_repos = data.items.filter(repo => !repo.private);
      all_repos.push(...public_repos);
      
      if (data.items.length < 100) {
        break;
      }
      
      page++;
    }
    
    // Sort by stars and limit results
    const top_repos = all_repos
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, limit);
    
    const total_stars = top_repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const total_repositories = top_repos.length;
    
    let all_topics = new Set();
    const formatted_repos = [];
    
    // Get topics for each repository
    for (const repo of top_repos) {
      const repo_name = repo.name;
      const topics = await getRepoTopics(org, repo_name);
      topics.forEach(topic => all_topics.add(topic));
      
      formatted_repos.push({
        "name": repo_name,
        "url": repo.html_url,
        "description": repo.description,
        "stars": repo.stargazers_count,
        "forks": repo.forks_count,
        "is_fork": repo.fork,
        "topics": topics,
        "language": repo.language,
        "updated_at": repo.updated_at
      });
    }
    
    return {
      "top_repositories": formatted_repos,
      "total_stars": total_stars,
      "total_repositories": total_repositories,
      "project_tags": Array.from(all_topics)
    };
  } catch (error) {
    console.error(`Error fetching repositories for topic ${topic}: ${error.message}`);
    return {
      "top_repositories": [],
      "total_stars": 0,
      "total_repositories": 0,
      "project_tags": []
    };
  }
}

/**
 * Main function to process projects and fetch GitHub data
 */
async function main() {
  console.log(`Starting GitHub data fetch for organization: ${config.organization}`);
  console.log(`Processing ${config.projects.length} projects...`);
  
  try {
    // Create a deep copy of the projects to avoid modifying the original
    const projects_data = JSON.parse(JSON.stringify(config.projects));
    
    // Process each project
    for (let i = 0; i < projects_data.length; i++) {
      const project = projects_data[i];
      console.log(`[${i+1}/${projects_data.length}] Fetching data for project: ${project.project_name} (topic: ${project.project_topic})`);
      
      const repo_data = await getTopRepositories(config.organization, project.project_topic);
      
      // Update project with repository data
      project.top_repositories = repo_data.top_repositories;
      project.total_stars = repo_data.total_stars;
      project.total_repositories = repo_data.total_repositories;
      project.project_tags = repo_data.project_tags;
      
      // Add timestamp
      project.last_updated = new Date().toISOString();
    }
    
    // Write data to output file
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(projects_data, null, 2));
    console.log(`Successfully wrote data to ${OUTPUT_PATH}`);
    
  } catch (error) {
    console.error(`Error processing projects: ${error.message}`);
    process.exit(1);
  }
}

// Run the main function
main().catch(error => {
  console.error(`Unhandled error: ${error.message}`);
  process.exit(1);
});