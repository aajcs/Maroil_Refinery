'use client';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import React from 'react';
import type { Page } from '@/types';

const AccessDenied: Page = () => {
    const router = useRouter();
    const navigateToDashboard = () => {
        router.push('/');
    };

    return (
        <>
            <div className="surface-ground h-screen w-screen flex align-items-center justify-content-center">
                <div className="surface-card py-7 px-5 sm:px-7 shadow-2 flex flex-column w-11 sm:w-30rem" style={{ borderRadius: '14px' }}>
                    <h1 className="font-bold text-2xl mt-0 mb-2">ACCESS DENIED</h1>
                    <p className="text-color-secondary mb-4">You are not authorized to access this resource..</p>
                    <img src="/layout/images/pages/auth/access-denied.svg" alt="access-denied" className="mb-4 align-self-center" />
                    <Button label="Go to Dashboard" onClick={navigateToDashboard}></Button>
                </div>
            </div>
        </>
    );
};

export default AccessDenied;
