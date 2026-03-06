
import { GoogleGenAI, Type } from "@google/genai";
import { ProjectConfig, DashboardData } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async generateDashboard(config: ProjectConfig): Promise<DashboardData> {
    const prompt = `
      Persona: You are an expert Data Scientist and BI Developer specializing in ${config.biTool} and Predictive Analytics.
      Context: I am building a Business Intelligence Dashboard for ${config.companyType}. 
      Dataset Details: ${config.dataFields}
      
      Task: Create a structured JSON configuration for a live dashboard based on the provided dataset structure.
      
      CRITICAL INSTRUCTION: You must use the EXACT column names listed in the "Columns" section of the Dataset Details for 'valueField', 'xAxisKey', and 'yAxisKey'. Do not change casing, spelling, or add spaces. If a column is named "Order_Date", do not use "Order Date".

      Requirements:
      1. KPIs: Identify 4-5 critical KPIs. Specify the field to aggregate and the aggregation method (sum, avg, count).
      2. Charts: Suggest 4 charts to visualize trends or distributions. Specify the chart type (bar, line, area, pie), x-axis field, y-axis field, and aggregation method (sum, avg, count). Use 'count' aggregation for volume metrics (e.g., number of orders, tasks, tickets).
      3. BI Instructions: Provide specific steps and code (DAX/Calculated Field) to recreate one complex metric in ${config.biTool}.
      
      Output Format: JSON only. Do not include markdown code blocks. The structure must match the following schema:
      {
        "title": "Dashboard Title",
        "summary": "Brief executive summary of what this dashboard shows.",
        "kpis": [
          { "label": "Total Sales", "valueField": "Sales", "aggregation": "sum", "format": "currency", "trend": "up" }
        ],
        "charts": [
          { "id": "chart1", "title": "Sales by Region", "type": "bar", "xAxisKey": "Region", "yAxisKey": "Sales", "aggregation": "sum", "description": "Breakdown of sales performance across regions." },
          { "id": "chart2", "title": "Order Volume by Category", "type": "pie", "xAxisKey": "Category", "yAxisKey": "Order ID", "aggregation": "count", "description": "Distribution of orders." }
        ],
        "biInstructions": {
          "tool": "${config.biTool}",
          "steps": ["Step 1...", "Step 2..."],
          "codeSnippet": { "label": "YoY Growth", "code": "...", "language": "${config.biTool === 'Power BI' ? 'DAX' : 'Calculated Field'}" }
        }
      }
    `;

    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Request timed out after 30 seconds")), 30000)
      );

      const apiCall = this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          temperature: 0.4,
          topP: 0.8,
          responseMimeType: "application/json"
        },
      });

      const response = await Promise.race([apiCall, timeoutPromise]) as any;

      const text = response.text || "{}";
      // Clean up potential markdown code blocks if the model ignores instructions
      const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(jsonString) as DashboardData;
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error("The strategist encountered an error generating the dashboard configuration. Please try again.");
    }
  }

  async generateRoadmap(config: ProjectConfig): Promise<string> {
    const prompt = `
      Persona: You are a Chief Data Officer and Technical Architect.
      Context: I need a technical implementation roadmap for a BI solution for ${config.companyType}.
      Dataset: ${config.dataFields}
      Tools: ${config.biTool} and ${config.language}.
      
      Task: Create a detailed Markdown roadmap.
      Structure:
      1. Executive Summary
      2. Data Architecture (Schema, ETL)
      3. ${config.biTool} Implementation Strategy (Data Model, key DAX/Calculations)
      4. Advanced Analytics with ${config.language} (Predictive models to build)
      5. Action Plan (Phase 1, 2, 3)
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      return response.text || "Failed to generate roadmap.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error("Failed to generate roadmap.");
    }
  }
}

export const geminiService = new GeminiService();
