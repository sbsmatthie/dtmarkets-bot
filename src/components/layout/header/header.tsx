import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { standalone_routes } from '@/components/shared';
import Button from '@/components/shared_ui/button';
import useActiveAccount from '@/hooks/api/account/useActiveAccount';
import useIsGrowthbookIsLoaded from '@/hooks/growthbook/useIsGrowthbookLoaded';
import { useApiBase } from '@/hooks/useApiBase';
import { useStore } from '@/hooks/useStore';
import { StandaloneCircleUserRegularIcon } from '@deriv/quill-icons/Standalone';
import {
    LabelPairedChartLineCaptionRegularIcon,
    LabelPairedObjectsColumnCaptionRegularIcon,
    LabelPairedPuzzlePieceTwoCaptionBoldIcon,
    LabelPairedSignalXlRegularIcon,
    LabelPairedGaugeMaxLgRegularIcon,
    LabelPairedCopyMdRegularIcon,
    LabelPairedChartTradingviewLgRegularIcon,
    LabelPairedTelegramCaptionIcon,
    LabelPairedWhatsappCaptionIcon,
    LabelPairedWalletCircleMinusLgRegularIcon,
    LabelPairedWalletCirclePlusCaptionRegularIcon,
    LabelPairedFileInvoiceDollarLgRegularIcon,
} from '@deriv/quill-icons/LabelPaired';

import {
    StandaloneWalletCirclePlusRegularIcon,
    StandaloneWalletCircleMinusRegularIcon,
} from '@deriv/quill-icons/Standalone';

import {
    LegacyCloseCircle2pxBlackIcon,
    LegacySettings1pxIcon,
} from '@deriv/quill-icons/Legacy';

import { requestOidcAuthentication } from '@deriv-com/auth-client';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Header, useDevice, Wrapper } from '@deriv-com/ui';
import { Tooltip } from '@deriv-com/ui';
import { isDotComSite } from '../../../utils';
import { AppLogo } from '../app-logo';
import AccountsInfoLoader from './account-info-loader';
import AccountSwitcher from './account-switcher';
import MenuItems from './menu-items';
import MobileMenu from './mobile-menu';
import PlatformSwitcher from './platform-switcher';
import './header.scss';

// SBS imports
import { ArrowDownCircle, ArrowUpCircle, Mail, Menu } from 'lucide-react';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const AppHeader = observer(() => {
    const { isGBLoaded, isGBAvailable } = useIsGrowthbookIsLoaded();
    const { isDesktop } = useDevice();
    const { isAuthorizing, activeLoginid } = useApiBase();
    const { client } = useStore() ?? {};

    const { data: activeAccount } = useActiveAccount({ allBalanceData: client?.all_accounts_balance });
    const { accounts, getCurrency } = client ?? {};
    const has_wallet = Object.keys(accounts ?? {}).some(id => accounts?.[id].account_category === 'wallet');

    const currency = getCurrency?.();
    const { localize } = useTranslations();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Drawer state

    const renderAccountSection = () => {
        if (isAuthorizing) {
            return <AccountsInfoLoader isLoggedIn isMobile={!isDesktop} speed={3} />;
        } else if (activeLoginid) {
            return (
                <>
                    {isDesktop &&
                        (() => {
                            const redirect_url = new URL(standalone_routes.personal_details);
                            const urlParams = new URLSearchParams(window.location.search);
                            const account_param = urlParams.get('account');
                            const is_virtual = client?.is_virtual || account_param === 'demo';

                            if (is_virtual) {
                                redirect_url.searchParams.set('account', 'demo');
                            } else if (currency) {
                                redirect_url.searchParams.set('account', currency);
                            }
                            return (
                                <Tooltip
                                    as='a'
                                    href={redirect_url.toString()}
                                    tooltipContent={localize('Manage account settings')}
                                    tooltipPosition='bottom'
                                    className='app-header__account-settings'
                                >
                                    <StandaloneCircleUserRegularIcon className='app-header__profile_icon' />
                                </Tooltip>
                            );
                        })()}
                    <AccountSwitcher activeAccount={activeAccount} />
                    {isDesktop &&
                        (has_wallet ? (
                            <Button
                                className='manage-funds-button'
                                has_effect
                                text={localize('Manage funds')}
                                onClick={() => {
                                    let redirect_url = new URL(standalone_routes.wallets_transfer);

                                    if (isGBAvailable && isGBLoaded) {
                                        redirect_url = new URL(standalone_routes.recent_transactions);
                                    }

                                    if (currency) {
                                        redirect_url.searchParams.set('account', currency);
                                    }
                                    window.location.assign(redirect_url.toString());
                                }}
                                primary
                            />
                        ) : (
                            <Button
                                primary
                                onClick={() => {
                                    const redirect_url = new URL(standalone_routes.cashier_deposit);
                                    if (currency) {
                                        redirect_url.searchParams.set('account', currency);
                                    }
                                    window.location.assign(redirect_url.toString());
                                }}
                                className='deposit-button'
                            >
                                {localize('Deposit')}
                            </Button>
                        ))}
                </>
            );
        } else {
            return (
                <div className='auth-actions'>
                    <Button
                        tertiary
                        onClick={async () => {
                            const app_id = window.localStorage.getItem('APP_ID');
                            window.location.href =
                                'https://oauth.deriv.com/oauth2/authorize?app_id=' + app_id + '&l=EN&brand=deriv';
                        }}
                    >
                        <Localize i18n_default_text='Log in' />
                    </Button>
                    <Button
                        primary
                        onClick={() => {
                            window.open(standalone_routes.signup);
                        }}
                    >
                        <Localize i18n_default_text='Sign up' />
                    </Button>
                </div>
            );
        }
    };

    return (
        <>
            <Header
                className={clsx('app-header', {
                    'app-header--desktop': isDesktop,
                    'app-header--mobile': !isDesktop,
                })}
            >
                <Wrapper variant='left'>
                    {isDesktop ? (
                        <div
                            className='custom-logo-wrapper'
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                marginRight: '24px',
                            }}
                        >
                            <span className='logo-text'>
                                <span className='logo-d'>dt</span>
                                <span className='logo-markets'>markets</span>
                            </span>
                        </div>
                    ) : (
                        <>
                            <button
                                className='menu-button'
                                onClick={() => setIsDrawerOpen(prev => !prev)}
                            >
                                {isDrawerOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>

                            <div className={`mobile-menu ${isDrawerOpen ? 'open' : ''}`}>
                                <div
                                    className='custom-logo-wrapper'
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        marginRight: '24px',
                                    }}
                                >
                                    <LegacyCloseCircle2pxBlackIcon onClick={() => setIsDrawerOpen(prev => !prev)}
                                        height='30px'
                                        width='30px'
                                        fill='orange'
                                    />
                                    <span className='logo-text'>
                                        <span className='logo-d'>dt</span>
                                        <span className='logo-markets'>markets</span>
                                    </span>
                                </div>

                                <a
                                  href="https://app.deriv.com/reports/positions"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="menu-link-button"
                                >
                                  <LabelPairedFileInvoiceDollarLgRegularIcon
                                    height="30px"
                                    width="30px"
                                    fill="orange"
                                  />
                                  <span>Reports</span>
                                </a>
                                <a
                                  href="https://app.deriv.com/settings"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="menu-link-button"
                                >
                                  <LegacySettings1pxIcon
                                    height="30px"
                                    width="30px"
                                    fill="orange"
                                  />
                                  <span>Settings</span>
                                </a>
                                <a
                                  href="#"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="menu-link-button"
                                >
                                  <LabelPairedWalletCirclePlusCaptionRegularIcon
                                    height="30px"
                                    width="30px"
                                    fill="orange"
                                  />
                                  <span>Deposit</span>
                                </a>
                                <a
                                  href="#"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="menu-link-button"
                                >
                                  <LabelPairedWalletCircleMinusLgRegularIcon
                                    height="30px"
                                    width="30px"
                                    fill="orange"
                                  />
                                  <span>Withdraw</span>
                                </a>
                                <a
                                  href="https://t.me/dtmarketsgroup"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="menu-link-button"
                                >
                                  <LabelPairedTelegramCaptionIcon
                                    height="30px"
                                    width="30px"
                                    fill="orange"
                                  />
                                  <span>Telegram</span>
                                </a>
                                <a
                                  href="https://whatsapp.com/channel/0029Vb5iDH1EFeXnLlfgzt01"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="menu-link-button"
                                >
                                  <LabelPairedWhatsappCaptionIcon
                                    height="30px"
                                    width="30px"
                                    fill="orange"
                                  />
                                  <span>WhatsAPP</span>
                                </a>
                            </div>
                        </>
                    )}
                </Wrapper>

                <Wrapper variant='right'>{renderAccountSection()}</Wrapper>
            </Header>
        </>
    );

});

export default AppHeader;
