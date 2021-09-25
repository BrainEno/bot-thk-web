import Head from 'next/head';
import { singleCategory } from '../../actions/category';
import { BlogCategory } from '../../components/blog';
import { GetServerSidePropsContext } from 'next';
import { IBlog, ICategory } from '../../types';
import { ParsedUrlQuery } from 'querystring';
import mergeStyles, { normalConfig } from '../../hooks/mergeStyles';

interface ICategoryProps {
  category: ICategory;
  blogs: IBlog[];
  query: ParsedUrlQuery;
}
const Category: React.FC<ICategoryProps> = ({ category, blogs, query }) => {
  blogs && mergeStyles(blogs, normalConfig);

  const head = () => (
    <Head>
      <title>
        {category.name} | {process.env.NEXT_PUBLIC_APP_NAME}
      </title>
      <meta name="description" content={`${category.name} articles`} />
      <link
        rel="canonical"
        href={`${process.env.NEXT_PUBLIC_DOMAIN}/categories/${query.slug}`}
      />
      <meta
        property="og:title"
        content={`${category.name}| ${process.env.NEXT_PUBLIC_APP_NAME}`}
      />
      <meta property="og:description" content={`${category.name} articles`} />
      <meta property="og:type" content="webiste" />
      <meta
        property="og:url"
        content={`${process.env.NEXT_PUBLIC_DOMAIN}/categories/${query.slug}`}
      />
      <meta
        property="og:site_name"
        content={`${process.env.NEXT_PUBLIC_APP_NAME}`}
      />

      <meta
        property="og:image"
        content={`${process.env.NEXT_PUBLIC_DOMAIN}/static/images/seoblog.jpg`}
      />
      <meta
        property="og:image:secure_url"
        content={`${process.env.NEXT_PUBLIC_DOMAIN}/static/images/seoblog.jpg`}
      />
      <meta property="og:image:type" content="image/jpg" />
    </Head>
  );

  return (
    <>
      {category && head()}
      <main className="category-blogs">
        <section className="category-blogs-container">
          <h1>{category.name}</h1>
          <BlogCategory posts={blogs} columns={3} tagsOnTop={true} />
        </section>
      </main>
    </>
  );
};

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  const data = await singleCategory(query.slug as string);
  return { props: { category: data.category, blogs: data.blogs, query } };
}

export default Category;
