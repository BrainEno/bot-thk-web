import Head from 'next/head';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { BlogCategory, TagRow } from '../../components/blog';
import React from 'react';
import SlideImage from '../../components/SlideImage';
import dayjs from 'dayjs';
import { singleBlog, listRelated } from '../../actions/blog';
import { singleCategory } from '../../actions/category';
import { IBlog } from '../../types';
import {
  GetStaticPaths,
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsContext
} from 'next';
import mergeStyles, { relatedConfig } from '../../hooks/mergeStyles';
import useSWR, { SWRResponse } from 'swr';
const DisqusThread = dynamic(() => import('../../components/DisqusThread'), {
  ssr: false
});
const ReadBlog = dynamic(() => import('../../components/blog/ReadBlog'), {
  ssr: false
});

interface SingleBlogProps {
  initialBlog: IBlog;
  id: string;
  relatedBlogs: IBlog[];
}

const getURL = (id: string) => `${process.env.NEXT_PUBLIC_API}/blog/${id}`;

const SingleBlog: React.FC<SingleBlogProps> = ({
  initialBlog,
  id,
  relatedBlogs
}) => {
  const { data: blog, error }: SWRResponse<IBlog, any> = useSWR(
    process.env.NEXT_PUBLIC_API && id ? getURL(id) : null,
    (url) => fetch(url).then((r) => r.json()),
    { fallbackData: initialBlog }
  );

  if (error) console.log('ERROR:', error);
  // console.log(`/blog/image/${initialBlog!._id}`);

  const showComents = () => {
    return (
      <DisqusThread
        id={blog!._id}
        title={blog!.title}
        path={`blog/${blog!._id}`}
      />
    );
  };

  const head = () => (
    <>
      {
        <Head>
          <title>
            {initialBlog!.title} | {process.env.NEXT_PUBLIC_APP_NAME}
          </title>
          <meta name="description" content={initialBlog!.description} />
          <link
            rel="canonical"
            href={`${process.env.NEXT_PUBLIC_DOMAIN}/blogs/${initialBlog!._id}`}
          />
          <meta
            property="og:title"
            content={`${initialBlog!.title}| ${
              process.env.NEXT_PUBLIC_APP_NAME
            }`}
          />
          <meta property="og:description" content={initialBlog!.description} />
          <meta property="og:type" content="webiste" />
          <meta
            property="og:url"
            content={`${process.env.NEXT_PUBLIC_DOMAIN}/blogs/${
              initialBlog!._id
            }`}
          />
          <meta
            property="og:site_name"
            content={`${process.env.NEXT_PUBLIC_APP_NAME}`}
          />
          <meta
            property="og:image"
            content={`${process.env.NEXT_PUBLIC_API}/blog/image/${
              initialBlog!._id
            }`}
          />
          <meta
            property="og:image:secure_url"
            content={`${process.env.NEXT_PUBLIC_API}/blog/image/${
              initialBlog!._id
            }`}
          />
          <meta property="og:image:type" content="image/jpg" />
          <meta name="theme-color" content="#eff3f8" />
        </Head>
      }
    </>
  );

  relatedBlogs && mergeStyles(relatedBlogs, relatedConfig);

  const showRelatedBlog = () => {
    return <BlogCategory posts={relatedBlogs} columns={3} tagsOnTop={true} />;
  };

  return (
    <>
      {initialBlog && head()}
      {blog ? (
        <SlideImage imgSrc={`/blog/image/${blog!._id}`} alt={blog!.title} />
      ) : (
        initialBlog && (
          <SlideImage
            imgSrc={`/blog/image/${initialBlog!._id}`}
            alt={initialBlog!.title}
          />
        )
      )}
      <main className="blog-article">
        <article className="article-header-container">
          <section className="article-header">
            <>
              <h1>{blog ? blog!.title : initialBlog.title}</h1>
            </>
            <p>
              <span className="author-text">
                By : {'  '}
                {blog ? (
                  <Link href={`/profile/${blog!.author.username}`}>
                    {blog!.author.name}
                  </Link>
                ) : (
                  <Link href={`/profile/${initialBlog!.author.username}`}>
                    {initialBlog!.author.name}
                  </Link>
                )}
              </span>
              <span className="description-text">
                {' '}
                |{' '}
                {blog
                  ? dayjs(blog!.createdAt, 'zh', true).format('MMMM,DD,YYYY')
                  : dayjs(initialBlog!.createdAt, 'zh', true).format(
                      'MMMM,DD,YYYY'
                    )}
              </span>
            </p>
            <TagRow tags={blog ? blog!.tags : initialBlog.tags} />
          </section>
        </article>
        {blog ? <ReadBlog blog={blog} /> : <ReadBlog blog={initialBlog} />}
        <article className="article-content">
          {blog ? (
            <section
              dangerouslySetInnerHTML={{
                __html: blog!.body
              }}
            ></section>
          ) : (
            <section
              dangerouslySetInnerHTML={{
                __html: initialBlog!.body
              }}
            ></section>
          )}
        </article>
        <div className="contaienr" style={{ padding: '35px' }}>
          {blog! && showComents()}
        </div>
        <div className="container">
          <h4 className="text-center">相关推荐</h4>
          <div className="related-blogs">
            {relatedBlogs && showRelatedBlog()}
          </div>
        </div>
      </main>
    </>
  );
};

const getBlogsByCat = (category: string): Promise<IBlog[]> => {
  return new Promise((resolve, reject) => {
    singleCategory(category).then((data) => {
      if (data.error) {
        reject(data.error);
      } else {
        resolve(data.blogs);
      }
    });
  });
};

export const getStaticPaths: GetStaticPaths =
  async (): Promise<GetStaticPathsResult> => {
    const recentPosts = await getBlogsByCat('recent-post');
    const trendingPosts = await getBlogsByCat('trending');
    const featuredPosts = await getBlogsByCat('featured');
    const postsTemp = [...recentPosts, ...trendingPosts, ...featuredPosts];

    const posts = postsTemp.filter(
      (post, index, self) =>
        index ===
        self.findIndex((t) => t._id === post._id && t.title === post.title)
    );

    const paths = posts.map((post) => ({
      params: {
        id: post._id
      }
    }));

    return {
      paths,
      // fallback: true
      fallback: false
    };
  };

export const getStaticProps: GetStaticProps = async ({
  params
}: GetStaticPropsContext) => {
  const initialBlog = await singleBlog(params!.id as any);
  const blog = {
    _id: initialBlog._id,
    tags: initialBlog.tags,
    categories: initialBlog.categories
  };
  const relatedBlogs = await listRelated({ blog });

  return {
    props: { initialBlog, relatedBlogs, id: params!.id! },
    revalidate: 1
  };
};

export default SingleBlog;
