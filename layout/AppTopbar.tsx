import { InputText } from 'primereact/inputtext';
import { forwardRef, useContext, useImperativeHandle, useRef, useEffect, useState } from 'react';
import { LayoutContext } from './context/layoutcontext';
import type { AppTopbarRef } from '@/types';
import { Button } from 'primereact/button';
import { Ripple } from 'primereact/ripple';
import Link from 'next/link';
import { StyleClass } from 'primereact/styleclass';
import { usePathname, useRouter } from 'next/navigation';
import { classNames } from 'primereact/utils';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { onMenuToggle, layoutConfig, tabs, closeTab } = useContext(LayoutContext);

    const [searchActive, setSearchActive] = useState<boolean | null>(null);

    const pathname = usePathname();
    const router = useRouter();
    const menubuttonRef = useRef(null);

    const searchRef = useRef(null);

    const onMenuButtonClick = () => {
        onMenuToggle();
    };

    const activateSearch = () => {
        setSearchActive(true);
        setTimeout(() => {
            const element = document.querySelector('.searchInput');
            (element as HTMLElement)?.focus();
        }, 100);
    };
    const deactivateSearch = () => {
        setSearchActive(false);
    };

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current
    }));
    const logo = () => {
        const path = '/layout/images/logo-';
        let logo;
        if (layoutConfig.layoutTheme === 'primaryColor' && layoutConfig.theme !== 'yellow') {
            logo = 'light.png';
        } else {
            logo = layoutConfig.colorScheme === 'light' ? 'dark.png' : 'light.png';
        }
        return path + logo;
    };
    useEffect(() => {
        logo();
    }, []);

    const onCloseTab = (index: number) => {
        if (tabs.length > 1) {
            if (index === tabs?.length - 1) router.push(tabs?.[tabs.length - 2].to);
            else router.push(tabs?.[index + 1].to);
        } else {
            router.push('/');
        }
        closeTab(index);
    };

    return (
        <div className="layout-topbar">
            <Link href={'/'} className="app-logo">
                <img alt="app logo" src={logo()} />
                <span className="app-name">Verona</span>
            </Link>

            <button ref={menubuttonRef} className="topbar-menubutton p-link" type="button" onClick={onMenuButtonClick}>
                <span></span>
            </button>

            <ul className="topbar-menu">
                {tabs.map((item, i) => {
                    return (
                        <li key={i}>
                            <Link href={item.to} className={classNames({ 'active-route': item.to === pathname })}>
                                <span>{item.label}</span>
                            </Link>
                            <i className="pi pi-times" onClick={() => onCloseTab(i)}></i>
                        </li>
                    );
                })}
                {!tabs || (tabs.length === 0 && <li className="topbar-menu-empty">Zarcol</li>)}
            </ul>

            <div
                className={classNames('topbar-search', {
                    'topbar-search-active': searchActive
                })}
            >
                <button className="topbar-searchbutton p-link" onClick={activateSearch}>
                    <i className="pi pi-search"></i>
                </button>

                <div className="search-input-wrapper">
                    <span className="p-input-icon-right">
                        <InputText className="searchInput" type="text" placeholder="Search" onBlur={deactivateSearch} />
                        <i className="pi pi-search"></i>
                    </span>
                </div>
            </div>

            <div className="topbar-profile">
                <StyleClass nodeRef={searchRef} selector="@next" enterClassName="hidden" enterActiveClassName="scalein" leaveToClassName="hidden" leaveActiveClassName="fadeout" hideOnOutsideClick>
                    <button ref={searchRef} className="topbar-profile-button p-link" type="button">
                        <img alt="avatar" src="/layout/images/avatar.png" />
                        <span className="profile-details">
                            <span className="profile-name">Gene Russell</span>
                            <span className="profile-job">Developer</span>
                        </span>
                        <i className="pi pi-angle-down"></i>
                    </button>
                </StyleClass>
                <ul className="list-none p-3 m-0 border-round shadow-2 hidden absolute surface-overlay origin-top w-full sm:w-12rem mt-2 right-0 top-auto">
                    <li>
                        <a className="p-ripple flex p-2 border-round align-items-center hover:surface-hover transition-colors transition-duration-150 cursor-pointer">
                            <i className="pi pi-user mr-3"></i>
                            <span>Profile</span>
                            <Ripple />
                        </a>
                        <a className="p-ripple flex p-2 border-round align-items-center hover:surface-hover transition-colors transition-duration-150 cursor-pointer">
                            <i className="pi pi-inbox mr-3"></i>
                            <span>Inbox</span>
                            <Ripple />
                        </a>
                        <a className="p-ripple flex p-2 border-round align-items-center hover:surface-hover transition-colors transition-duration-150 cursor-pointer">
                            <i className="pi pi-cog mr-3"></i>
                            <span>Settings</span>
                            <Ripple />
                        </a>
                        <a className="p-ripple flex p-2 border-round align-items-center hover:surface-hover transition-colors transition-duration-150 cursor-pointer">
                            <i className="pi pi-power-off mr-3"></i>
                            <span>Sign Out</span>
                            <Ripple />
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
