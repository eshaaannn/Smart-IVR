// Issue categories with icons and metadata
export const ISSUE_CATEGORIES = {
    billing: {
        id: 'billing',
        label: 'Billing',
        subtitle: 'Payments & Invoices',
        icon: '💳',
        color: 'text-primary-500',
    },
    technical_issue: {
        id: 'technical_issue',
        label: 'Technical',
        subtitle: 'Troubleshooting',
        icon: '🔧',
        color: 'text-primary-500',
    },
    password_reset: {
        id: 'password_reset',
        label: 'Account',
        subtitle: 'Profile & Access',
        icon: '👤',
        color: 'text-primary-500',
    },
    account_access: {
        id: 'account_access',
        label: 'Account',
        subtitle: 'Profile & Access',
        icon: '👤',
        color: 'text-primary-500',
    },
    service_request: {
        id: 'service_request',
        label: 'Connectivity',
        subtitle: 'Network Issues',
        icon: '📶',
        color: 'text-primary-500',
    },
    general_support: {
        id: 'general_support',
        label: 'General Support',
        subtitle: 'Other Issues',
        icon: '💬',
        color: 'text-neutral-500',
    },
};

// Manual selection categories (for fallback screen)
export const MANUAL_CATEGORIES = [
    {
        id: 'billing',
        label: 'Billing',
        subtitle: 'Payments & Invoices',
        icon: '💳',
    },
    {
        id: 'technical_issue',
        label: 'Technical',
        subtitle: 'Troubleshooting',
        icon: '🔧',
    },
    {
        id: 'account_access',
        label: 'Account',
        subtitle: 'Profile & Access',
        icon: '👤',
    },
    {
        id: 'service_request',
        label: 'Connectivity',
        subtitle: 'Network Issues',
        icon: '📶',
    },
    {
        id: 'hardware',
        label: 'Hardware',
        subtitle: 'Device setup',
        icon: '📱',
    },
    {
        id: 'security',
        label: 'Security',
        subtitle: 'Privacy & Safety',
        icon: '🛡️',
    },
];

// Processing steps configuration
export const PROCESSING_STEPS = [
    {
        id: 'language',
        label: 'Language identified',
        icon: '✓',
    },
    {
        id: 'transcript',
        label: 'Speech converted to text',
        icon: '✓',
    },
    {
        id: 'classification',
        label: 'Issue understood',
        icon: '🔍',
    },
    {
        id: 'routing',
        label: 'Retrieving solution',
        icon: '📋',
    },
];

// Route paths
export const ROUTES = {
    HOME: '/',
    PROCESSING: '/processing',
    RESULTS: '/results',
    MANUAL_SELECTION: '/select-issue',
};

// Animation durations
export const ANIMATION = {
    PAGE_TRANSITION: 0.3,
    STEP_DELAY: 0.1,
    PULSE_DURATION: 2,
};

// API endpoints
export const API_ENDPOINTS = {
    HEALTH: '/health',
    PROCESS_ISSUE: '/process-issue',
    RECENT_CALLS: '/recent-calls',
};
