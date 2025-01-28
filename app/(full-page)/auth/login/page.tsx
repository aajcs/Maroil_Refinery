'use client';
import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { Page } from '../../../../types/layout';
import { classNames } from 'primereact/utils';
import { useContext } from 'react';
import { LayoutContext } from '../../../../layout/context/layoutcontext';

const Login: Page = () => {
    const router = useRouter();
    const navigateToDashboard = () => {
        router.push('/');
    };
    const { layoutConfig } = useContext(LayoutContext);
    const filledInput = layoutConfig.inputStyle === 'filled';

    return (
        <div className={classNames('surface-ground h-screen w-screen flex align-items-center justify-content-center', { 'p-input-filled': filledInput })}>
            <div className="surface-card py-7 px-5 sm:px-7 shadow-2 flex flex-column w-11 sm:w-30rem" style={{ borderRadius: '14px' }}>
                <h1 className="font-bold text-2xl mt-0 mb-2">VERONA</h1>
                <p className="text-color-secondary mb-4">
                    Welcome to the <strong>Verona Community</strong>, where the magic happens, sign in to continue.
                </p>

                <span className="p-input-icon-left mb-4">
                    <i className="pi pi-user"></i>
                    <InputText type="text" placeholder="Email" className="w-full" />
                </span>

                <span className="p-input-icon-left mb-4">
                    <i className="pi pi-key"></i>
                    <InputText type="password" placeholder="Password" className="w-full" />
                </span>

                <Button label="Sign In" className="mb-4" onClick={navigateToDashboard}></Button>

                <span className="text-color-secondary text-center mb-4">or sign in with below</span>

                <div className="flex gap-4 align-items-center justify-content-center">
                    <a href="https://www.facebook.com" className="inline-flex flex-shrink-0 w-3rem h-3rem justify-content-center align-items-center surface-ground border-circle">
                        <i className="pi pi-facebook text-2xl text-color"></i>
                    </a>
                    <a href="https://www.twitter.com" className="inline-flex flex-shrink-0 w-3rem h-3rem justify-content-center align-items-center surface-ground border-circle">
                        <i className="pi pi-twitter text-2xl text-color"></i>
                    </a>
                    <a href="https://www.google.com" className="inline-flex flex-shrink-0 w-3rem h-3rem justify-content-center align-items-center surface-ground border-circle">
                        <i className="pi pi-google text-2xl text-color"></i>
                    </a>
                    <a href="https://www.github.com" className="inline-flex flex-shrink-0 w-3rem h-3rem justify-content-center align-items-center surface-ground border-circle">
                        <i className="pi pi-github text-2xl text-color"></i>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;
