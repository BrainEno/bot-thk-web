import Head from 'next/head';
import { singleTag } from '../../actions/tag';
import { PostGrid } from '../../components/blog';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { IBlog, ITag } from '../../types';
import { ParsedUrlQuery } from 'querystring';

interface IBlogsWithTagProps {
  tag: ITag;
  blogs: IBlog[];
  query: ParsedUrlQuery;
}

const BlogsWithTag: React.FC<IBlogsWithTagProps> = ({ tag, blogs, query }) => {
  const head = () => (
    <Head>
      <title>
        {tag.name} | {process.env.NEXT_PUBLIC_APP_NAME}
      </title>
      <meta name="description" content={`${tag.name} articles`} />
      <link
        rel="canonical"
        href={`${process.env.NEXT_PUBLIC_DOMAIN}/categories/${query.slug}`}
      />
      <meta
        property="og:title"
        content={`${tag.name}| ${process.env.NEXT_PUBLIC_APP_NAME}`}
      />
      <meta property="og:description" content={`${tag.name} articles`} />
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
      {tag && head()}
      <main className="tagBlogs">
        <section className="tagBlogs-container">
          <h1 className="">{tag.name.toUpperCase()}</h1>
          <div className="tag-blog-cards">
            <PostGrid posts={blogs} />
          </div>
        </section>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  query
}: GetServerSidePropsContext) => {
  const data = await singleTag(query.slug as string);
  return { props: { tag: data.tag, blogs: data.blogs, query } };
};

export default BlogsWithTag;
