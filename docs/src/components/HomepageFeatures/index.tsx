import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Tokens de design',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Cores, tipografia e regras de layout documentados de forma única, para
        manter a interface alinhada ao produto.
      </>
    ),
  },
  {
    title: 'Componentes reutilizáveis',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Padrões de UI construídos com React e SCSS modules, com exemplos e
        orientações de uso.
      </>
    ),
  },
  {
    title: 'Atomic Design',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Estrutura em átomos, moléculas e organismos para localizar e evoluir
        cada peça com clareza.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4', styles.col)}>
      <div className={clsx('featureCard', styles.card)}>
        <div className="text--center">
          <Svg className={styles.featureSvg} role="img" aria-hidden />
        </div>
        <div className={clsx('padding-horiz--md', styles.textBlock)}>
          <Heading as="h3" className={styles.featureTitle}>
            {title}
          </Heading>
          <p className={styles.featureDesc}>{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features} aria-label="Principais tópicos">
      <div className="container">
        <div className="row">
          {FeatureList.map((props) => (
            <Feature key={props.title} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
