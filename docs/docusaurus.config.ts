import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Bytebank Design System',
  tagline: 'Cores, tipografia e componentes do app de gestão financeira',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://pos-projetos-thiago.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  // Use '/tc-02/' quando for fazer deploy no GitHub Pages
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'pos-projetos-thiago', // Usually your GitHub org/user name.
  projectName: 'tc-02', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/pos-projetos-thiago/tc-02/tree/dev/docs/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Bytebank',
      logo: {
        alt: 'Bytebank',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentação',
        },
        {
          href: 'https://github.com/pos-projetos-thiago/tc-02',
          label: 'Código no GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Guia',
          items: [
            {
              label: 'Introdução',
              to: '/docs/intro',
            },
            {
              label: 'Cores e tokens',
              to: '/docs/colors',
            },
            {
              label: 'Tipografia',
              to: '/docs/typography',
            },
            {
              label: 'Breakpoints',
              to: '/docs/breakpoints',
            },
            {
              label: 'Catálogo de componentes',
              to: '/docs/components/catalog',
            },
            {
              label: 'Button',
              to: '/docs/components/button',
            },
          ],
        },
        {
          title: 'Repositório',
          items: [
            {
              label: 'tc-02 no GitHub',
              href: 'https://github.com/pos-projetos-thiago/tc-02',
            },
            {
              label: 'README do projeto',
              href: 'https://github.com/pos-projetos-thiago/tc-02/blob/dev/README.md',
            },
          ],
        },
      ],
      copyright: `Bytebank - documentação do design system · ${new Date().getFullYear()}`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
