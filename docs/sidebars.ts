import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Design tokens',
      items: ['colors', 'typography', 'breakpoints'],
    },
    {
      type: 'category',
      label: 'Componentes',
      items: [
        'components/catalog',
        {
          type: 'category',
          label: 'Átomos',
          items: [
            'components/button',
            'components/button-group',
            'components/currency-input',
            'components/dropdown',
            'components/loading',
            'components/menu-button',
            'components/profile-input',
            'components/toast',
            'components/transaction-button',
          ],
        },
        {
          type: 'category',
          label: 'Moléculas',
          items: [
            'components/balance-card',
            'components/dashboard-nav',
            'components/investment-chart',
            'components/modal',
            'components/service-card',
            'components/transaction-item',
            'components/user-profile',
          ],
        },
        {
          type: 'category',
          label: 'Organismos',
          items: [
            'components/auth-modal',
            'components/dashboard-extract',
            'components/dashboard-hero',
            'components/dashboard-mobile-menu',
            'components/dashboard-services',
            'components/footer',
            'components/hero',
            'components/mobile-menu',
            'components/navbar',
            'components/profile-form',
          ],
        },
        {
          type: 'category',
          label: 'Templates',
          items: ['components/not-found-template'],
        },
      ],
    },
  ],
};

export default sidebars;
