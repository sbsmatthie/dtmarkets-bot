import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';
import { LabelPairedFileArrowDownCaptionRegularIcon } from '@deriv/quill-icons/LabelPaired';
import { LabelPairedMoonCaptionRegularIcon } from '@deriv/quill-icons/LabelPaired';
import { LabelPairedExclamationCaptionRegularIcon } from '@deriv/quill-icons/LabelPaired';
import { Localize } from '@deriv-com/translations';
// Import the XML files directly
import x1 from './bot-files/1 $Orginal DollarPrinterBot  2025 Version $ (1).xml'; // Correct the import statement
import x2 from './bot-files/deriv_geetrading_self_analysis_bot-1.xml';
import x3 from './bot-files/Geepro Ai Bot2📈.xml';
import x4 from './bot-files/Geepro Under7 Self Analysis Bot(1).xml'; // Correct the import statement
import x5 from './bot-files/📈GeePro Digits Bot📈.xml';
import x6 from './bot-files/📈GeePro Rise_Fall Bot📈.xml';
import './freebots.scss';

const FreeBots = observer(() => {
    const { load_modal, dashboard, blockly_store } = useStore();
    const { handleFileChange } = load_modal;
    const [loadingBotId, setLoadingBotId] = useState<number | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);

    // Map filenames to their XML content
    const botXmlMap: Record<string, string> = {
        '1 $Orginal DollarPrinterBot  2025 Version $ (1).xml': x1,
        'deriv_geetrading_self_analysis_bot-1.xml': x2,
        'Geepro Ai Bot2📈.xml': x3,
        'Geepro Under7 Self Analysis Bot(1).xml': x4,
        '📈GeePro Digits Bot📈.xml': x5,
        '📈GeePro Rise_Fall Bot📈.xml': x6,
    };

    const bots = [
        {
            name: '1 $Orginal DollarPrinterBot  2025 Version $ (1)',
            description: '1 $Orginal DollarPrinterBot  2025 Version $ (1)',
            file: '1 $Orginal DollarPrinterBot  2025 Version $ (1).xml',
            icon: '🤖',
        },
        {
            name: 'deriv_geetrading_self_analysis_bot-1',
            description: 'deriv_geetrading_self_analysis_bot-1',
            file: 'deriv_geetrading_self_analysis_bot-1.xml',
            icon: '🤖',
        },
        {
            name: 'Geepro Ai Bot2📈',
            description: 'Geepro Ai Bot2📈',
            file: 'Geepro Ai Bot2📈.xml',
            icon: '🤖',
        },
        {
            name: 'Geepro Under7 Self Analysis Bot(1)',
            description: 'Geepro Under7 Self Analysis Bot(1)',
            file: 'Geepro Under7 Self Analysis Bot(1).xml',
            icon: '🤖',
        },
        {
            name: '📈GeePro Digits Bot📈',
            description: '📈GeePro Digits Bot📈',
            file: '📈GeePro Digits Bot📈.xml',
            icon: '🤖',
        },
        {
            name: '📈GeePro Rise_Fall Bot📈',
            description: '📈GeePro Rise_Fall Bot📈',
            file: '📈GeePro Rise_Fall Bot📈.xml',
            icon: '🤖',
        },
    ];

    const handleBotSelect = (filename: string, botIndex: number) => {
        // Reset any previous errors
        setLoadError(null);
        // Set loading state for this specific bot
        setLoadingBotId(botIndex);

        // Set the dashboard tab to Bot Builder (tab index 1)
        dashboard.setActiveTab(1);

        // Get the XML content for this bot
        const xmlContent = botXmlMap[filename];

        if (!xmlContent) {
            console.error(`XML content not found for ${filename}`);
            setLoadError(`Could not load bot: XML file "${filename}" not found`);
            setLoadingBotId(null);
            return;
        }

        // Wait for Blockly to be fully loaded
        const loadBot = () => {
            // Set a timeout to prevent infinite loops
            let attempts = 0;
            const maxAttempts = 50; // 5 seconds max waiting time

            const tryLoadBot = () => {
                if (!window.Blockly?.derivWorkspace) {
                    attempts++;
                    if (attempts > maxAttempts) {
                        setLoadError('Blockly workspace not available after multiple attempts');
                        setLoadingBotId(null);
                        return;
                    }
                    setTimeout(tryLoadBot, 100);
                    return;
                }

                try {
                    // Validate XML before attempting to load
                    if (!xmlContent.includes('<xml') || !xmlContent.includes('</xml>')) {
                        throw new Error('Invalid XML format');
                    }

                    // Clear existing workspace
                    window.Blockly.derivWorkspace.asyncClear();

                    // Parse the XML and load it into the workspace
                    const xml = window.Blockly.utils.xml.textToDom(xmlContent);
                    window.Blockly.Xml.domToWorkspace(xml, window.Blockly.derivWorkspace);

                    // Save the current workspace for recovery
                    window.Blockly.derivWorkspace.strategy_to_load = xmlContent;

                    // Update UI if needed
                    window.Blockly.derivWorkspace.cleanUp();

                    // Successfully loaded
                    console.log(`Successfully loaded bot: ${filename}`);

                    // Clear loading state
                    setLoadingBotId(null);
                } catch (error) {
                    console.error('Error loading bot:', error);
                    setLoadError(`Failed to load bot: ${error instanceof Error ? error.message : 'Unknown error'}`);
                    setLoadingBotId(null);
                }
            };

            tryLoadBot();
        };

        loadBot();
    };

    useEffect(() => {
        const cards = document.querySelectorAll('.free-bots__card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                (card as HTMLElement).style.opacity = '1';
                (card as HTMLElement).style.transform = 'translateY(0)';
            }, 100 * index);
        });
    }, []);

    return (
        <div className='free-bots'>
            <div className='free-bots__header'>
                <LabelPairedMoonCaptionRegularIcon height='32px' width='32px' fill='var(--button-primary-default)' />
                <h1>Free Trading Bots</h1>
                <p>Select from our collection of high-performance trading bots</p>
            </div>
            {loadError && (
                <div className='free-bots__error-message'>
                    <LabelPairedExclamationCaptionRegularIcon height='20px' width='20px' fill='var(--status-danger)' />
                    <span>{loadError}</span>
                </div>
            )}
            <div className='free-bots__scroll-container'>
                <div className='bot-list-container'>
                    <div className='free-bots__grid'>
                        {bots.map((bot, index) => (
                            <div
                                key={index}
                                className='free-bots__card'
                                style={{
                                    opacity: 0,
                                    transform: 'translateY(20px)',
                                    transition: 'all 0.4s ease-out',
                                }}
                            >
                                <div className='free-bots__card-icon'>{bot.icon}</div>
                                <div className='free-bots__card-content'>
                                    <h3>{bot.name}</h3>
                                    <p>{bot.description}</p>
                                    <button
                                        className={`free-bots__download-btn ${loadingBotId === index ? 'loading' : ''}`}
                                        onClick={() => handleBotSelect(bot.file, index)}
                                        disabled={loadingBotId !== null}
                                    >
                                        {loadingBotId === index ? (
                                            <span>Loading...</span>
                                        ) : (
                                            <>
                                                <LabelPairedFileArrowDownCaptionRegularIcon
                                                    height='16px'
                                                    width='16px'
                                                />
                                                <span>Load Bot</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default FreeBots;
