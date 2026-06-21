import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import type * as Plugin from "@docusaurus/types/src/plugin";
import type * as OpenApiPlugin from "docusaurus-plugin-openapi-docs";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'E.C.O.',
  tagline: 'Real-time monitoring and optimization of home utility usage through smart furniture integrations',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid', "docusaurus-theme-openapi-docs"],

  // Set the production url of your site here
  url: 'https://energyconsumptionoptimizer.github.io/',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: 'documentation',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'ECO', // Usually your GitHub org/user name.
  projectName: 'documentation', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: "/",
          // REMOVED: docItemComponent: "@theme/ApiItem"
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
    [
      "redocusaurus",
      {
        specs: [
          {
            spec: "./docs/api/openapi/User_openapi.json",
            route: "/api/user",
          },
          {
            spec: "./docs/api/openapi/Hookup_openapi.json",
            route: "/api/hookup",
          },
          {
            spec: "./docs/api/openapi/Map_openapi.json",
            route: "/api/map",
          },
          {
            spec: "./docs/api/openapi/Monitoring_openapi.json",
            route: "/api/monitoring",
          },
          {
            spec: "./docs/api/openapi/Forecast_openapi.json",
            route: "/api/forecast",
          },
          {
            spec: "./docs/api/openapi/Threshold_openapi.json",
            route: "/api/threshold",
          },
          {
            spec: "./docs/api/openapi/Notification_openapi.json",
            route: "/api/alert",
          }
        ],
        theme: {
          primaryColor: "#1890ff",
        },
      },
    ]
  ],
  plugins: [
    [
      'docusaurus-plugin-openapi-docs',
      {
        id: "api", // plugin id
        docsPluginId: "classic", // configured for preset-classic
        config: {
          petstore: {
            specPath: "examples/petstore.yaml",
            outputDir: "docs/petstore",
            sidebarOptions: {
              groupPathsBy: "tag",
            },
          } satisfies OpenApiPlugin.Options,
        }
      },
    ]
  ],
  themeConfig: {
    navbar: {
      title: 'E.C.O.',
      logo: {
        alt: 'E.C.O.',
        src: 'img/logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Report',
        },
        {
          href: 'https://github.com/EnergyConsumptionOptimizer/',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'SAP Report',
              to: '/report/intro',
            },
          ],
        }
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Energy Consumption Optimizer, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
