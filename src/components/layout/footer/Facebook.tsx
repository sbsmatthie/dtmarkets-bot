import { LabelPairedFacebookMdIcon } from '@deriv/quill-icons/LabelPaired';
import { useTranslations } from '@deriv-com/translations';
import { Tooltip } from '@deriv-com/ui';

const Facebook = () => {
    const { localize } = useTranslations();

    return (
        <Tooltip
            as='a'
            className='app-footer__icon'
            href='https://wa.me/263782876599'
            target='_blank'
            tooltipContent={localize('Facebook')}
        >
            <LabelPairedFacebookMdIcon iconSize='xs' />
        </Tooltip>
    );
};

export default Facebook;
