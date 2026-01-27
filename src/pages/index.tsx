import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import Heading from '@theme/Heading';

import styles from './index.module.css';
import useBaseUrl from "@docusaurus/useBaseUrl";

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          Energy Consumption Optimizer
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/report/intro">
            See the documentation
          </Link>
        </div>

        <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center', gap: '40px' }}>
          <div style={{ textAlign: 'center' }}>
            <h3>Onboarding</h3>
            <iframe src="https://drive.google.com/file/d/1XdJVLxV8vUFq3_9CgL3FuuBSVYq2qpah/preview" width="560" height="315"
                    allow="autoplay; fullscreen"></iframe>
          </div>

          <div style={{ textAlign: 'center' }}>
            <h3>Demo</h3>
            <iframe src="https://drive.google.com/file/d/1pH1Q7gesTCMjnp-xQNruKuKvh5zTLuSJ/preview" width="560" height="315"
                    allow="autoplay; fullscreen"></iframe>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />

    </Layout>
  );
}
