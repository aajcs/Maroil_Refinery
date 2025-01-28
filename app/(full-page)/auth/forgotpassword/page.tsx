'use client';
import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { Page } from '../../../../types/layout';
import { classNames } from 'primereact/utils';
import { useContext } from 'react';
import { LayoutContext } from '../../../../layout/context/layoutcontext';

const ForgotPassword: Page = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const router = useRouter();
    const navigateToDashboard = () => {
        router.push('/');
    };
    const filledInput = layoutConfig.inputStyle === 'filled';

    return (
        <div className={classNames('surface-ground h-screen w-screen flex align-items-center justify-content-center', { 'p-input-filled': filledInput })}>
            <div className="surface-card py-7 px-5 sm:px-7 shadow-2 flex flex-column w-11 sm:w-30rem" style={{ borderRadius: '14px' }}>
                <h1 className="font-bold text-2xl mt-0 mb-2">Forgot Password?</h1>
                <p className="text-color-secondary mb-4">We need your email address for you can access your account, then we’ll send a recovery mail.</p>

                <span className="p-input-icon-left mb-4">
                    <i className="pi pi-user"></i>
                    <InputText type="text" placeholder="Email" className="w-full" />
                </span>

                <Button label="Send Recovery Mail" onClick={navigateToDashboard}></Button>
            </div>
        </div>
    );
};

export default ForgotPassword;
