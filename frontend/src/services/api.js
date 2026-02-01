import axios from 'axios';
import { API_ENDPOINTS } from '../utils/constants';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

// Create axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Mock data for demo mode
const mockResponses = {
    success: {
        language: 'English (US)',
        transcript: 'My printer is making a loud grinding noise and won\'t feed paper through the tray',
        issue_category: 'technical_issue',
        confidence: 0.89,
        routing_to: 'Technical Support',
        fallback: false,
    },
    lowConfidence: {
        language: 'Hindi',
        transcript: 'Mera internet bahut slow hai',
        issue_category: 'service_request',
        confidence: 0.42,
        routing_to: 'General Support',
        fallback: true,
    },
    error: {
        language: 'Unknown',
        transcript: 'Audio processing failed',
        issue_category: 'general_support',
        confidence: 0.0,
        routing_to: 'General Support',
        fallback: true,
    },
};

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Health check endpoint
 */
export const checkHealth = async () => {
    try {
        if (DEMO_MODE) {
            await delay(500);
            return { status: 'ok', mode: 'demo' };
        }
        const response = await apiClient.get(API_ENDPOINTS.HEALTH);
        return response.data;
    } catch (error) {
        console.error('Health check failed:', error);
        throw new Error('Backend is not available');
    }
};

/**
 * Process issue - main IVR endpoint
 * @param {string} audioUrl - URL of the uploaded audio file
 * @returns {Promise<Object>} - Processing result
 */
export const processIssue = async (audioUrl) => {
    try {
        if (DEMO_MODE) {
            // Simulate realistic processing time
            await delay(2500);

            // Randomly return success or low confidence for demo variety
            const scenarios = [mockResponses.success, mockResponses.success, mockResponses.lowConfidence];
            const randomResponse = scenarios[Math.floor(Math.random() * scenarios.length)];

            return randomResponse;
        }

        const response = await apiClient.post(API_ENDPOINTS.PROCESS_ISSUE, {
            audio_url: audioUrl,
        });

        return response.data;
    } catch (error) {
        console.error('Process issue failed:', error);

        // Return fallback response instead of throwing
        return mockResponses.error;
    }
};

/**
 * Get recent calls (optional analytics)
 */
export const getRecentCalls = async () => {
    try {
        if (DEMO_MODE) {
            await delay(800);
            return [];
        }
        const response = await apiClient.get(API_ENDPOINTS.RECENT_CALLS);
        return response.data;
    } catch (error) {
        console.error('Get recent calls failed:', error);
        return [];
    }
};

export default {
    checkHealth,
    processIssue,
    getRecentCalls,
};
