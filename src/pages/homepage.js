console.time('allhomepage');

console.time('import');

import useSite from 'hooks/use-site';
import { WebsiteJsonLd } from 'lib/json-ld';

import Layout from 'components/Layout';
import Header from 'components/Header';
import Section from 'components/Section';
import Container from 'components/Container';

import styles from 'styles/pages/Home.module.scss';

import { getApolloClient } from 'lib/apollo-client';
import { gql } from '@apollo/client';

console.timeEnd('import');

export default function Homepage({ page }) {
  console.time('homepage');

  const { metadata = {} } = useSite();
  const { title, description } = metadata;

  console.timeEnd('homepage');

  return (
    <Layout>
      <WebsiteJsonLd siteTitle={title} />
      <Header>
        <h1
          dangerouslySetInnerHTML={{
            __html: title,
          }}
        />

        <p
          className={styles.description}
          dangerouslySetInnerHTML={{
            __html: description,
          }}
        />
      </Header>

      <Section>
        <Container>
          <p>{page.test.text}</p>
          {page.test.repeater.map((row) => (
            <div key={row.url}>
              <img src={row.image.sourceUrl} alt="" />
              <p>{row.url}</p>
            </div>
          ))}
        </Container>
      </Section>
    </Layout>
  );
}

export async function getStaticProps() {
  console.time('getStaticProps');

  const apolloClient = getApolloClient();

  const QUERY_PAGE_ACF_BY_URI = gql`
    query PageByUri {
      page(id: "/homepage", idType: URI) {
        test {
          text
          repeater {
            image {
              sourceUrl
            }
            url
          }
        }
      }
    }
  `;

  let pageData;

  try {
    console.time('datafetch');

    pageData = await apolloClient.query({
      query: QUERY_PAGE_ACF_BY_URI,
    });
    console.timeEnd('datafetch');
  } catch (e) {
    console.log(`[pages][getPageByUri] Failed to query page data: ${e.message}`);
    throw e;
  }

  const page = pageData?.data.page;

  console.timeEnd('getStaticProps');

  return {
    props: {
      page,
    },
    revalidate: 10,
  };
}
console.timeEnd('allhomepage');
