import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import PageTransition from '../components/shared/PageTransition';
import Card from '../components/shared/Card';
import { MANUAL_CATEGORIES, ROUTES } from '../utils/constants';

export default function ManualSelectionPage() {
    const navigate = useNavigate();

    const handleSelect = (category) => {
        // Mock successful routing
        alert(`Routing to ${category.label} department...`);
        navigate(ROUTES.HOME);
    };

    return (
        <AppLayout title="Select Category">
            <PageTransition>
                <div className="text-center mb-8">
                    <h2 className="text-xl font-bold text-neutral-900">
                        Which department do you need?
                    </h2>
                    <p className="text-neutral-500 text-sm mt-1">
                        Choose the option that best describes your issue
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {MANUAL_CATEGORIES.map((cat, index) => (
                        <Card
                            key={cat.id}
                            delay={index}
                            onClick={() => handleSelect(cat)}
                            className="p-4 flex flex-col items-center justify-center text-center h-40 hover:scale-105 active:scale-95 transition-transform"
                        >
                            <span className="text-4xl mb-3" role="img" aria-label={cat.label}>
                                {cat.icon}
                            </span>
                            <h3 className="font-bold text-neutral-800 text-sm mb-1">{cat.label}</h3>
                            <p className="text-xs text-neutral-400">{cat.subtitle}</p>
                        </Card>
                    ))}
                </div>
            </PageTransition>
        </AppLayout>
    );
}
