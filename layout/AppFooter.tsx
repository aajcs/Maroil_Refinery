import React, { useContext } from 'react';
import { Button } from 'primereact/button';
import { LayoutContext } from './context/layoutcontext';

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);

    return (
        <div className="layout-footer mt-auto">
            <div className="footer-start">
                <img src={'/layout/images/logo-' + (layoutConfig.colorScheme === 'light' ? 'dark' : 'light') + '.png'} alt="logo" />
                <span className="app-name">Verona</span>
            </div>
            <div className="footer-right">
                <span>© Your Organization</span>
            </div>
        </div>
    );
};

export default AppFooter;
