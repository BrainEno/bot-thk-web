import Head from 'next/head'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { BlogCategory, TagRow } from '../../components/blog'
import React, { useCallback, useEffect, useState } from 'react'
import { CustomerServiceOutlined } from '@ant-design/icons'
import SlideImage from '../../components/SlideImage'
import dayjs from 'dayjs'
import { singleBlog, listRelated } from '../../actions/blog'
import { mergeStyles } from '../../helpers/mergeStyles'
const DisqusThread = dynamic(() => import('../../components/DisqusThread'), {
    ssr: false,
})
import { singleCategory } from '../../actions/category'
import useSWR from 'swr'
import { IBlog } from '../../types'
import {
    GetStaticPaths,
    GetStaticPathsResult,
    GetStaticProps,
    GetStaticPropsContext,
} from 'next'

interface SingleBlogProps {
    initialBlog: IBlog
    id: string
    relatedBlogs: IBlog[]
}

const SingleBlog: React.FC<SingleBlogProps> = ({
    initialBlog,
    id,
    relatedBlogs,
}) => {
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
    const [selectedVoice, setSelectedVoice] = useState('')
    const { data: blog } = useSWR(
        `${process.env.NEXT_PUBLIC_API}/blog/${id}`,
        (url, id) => fetch(url, { id } as any).then((r) => r.json()),
        {
            initialData: initialBlog,
        }
    )

    const showComents = () => {
        return (
            <DisqusThread
                id={blog._id}
                title={blog.title}
                path={`blog/${blog._id}`}
            />
        )
    }

    const getVoices = (): Promise<SpeechSynthesisVoice[]> => {
        return new Promise((resolve) => {
            if (typeof window !== 'undefined') {
                const synth = window.speechSynthesis
                const allVoices: SpeechSynthesisVoice[] = synth.getVoices()
                resolve(allVoices)
            }
        })
    }

    const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedVoice(e.target.value)
    }

    const handleRead: React.FormEventHandler = (
        e: React.FormEvent<HTMLSelectElement>
    ) => {
        e.preventDefault()

        if (typeof window !== 'undefined') {
            let speakText: SpeechSynthesisUtterance | undefined
            let readContent = blog.body.replace(/<[^>]+>/g, '')
            const synth = window.speechSynthesis

            if (synth.speaking) {
                if (!synth.paused) {
                    synth.pause()
                    console.log('已暂停朗读', synth.paused)
                } else {
                    synth.resume()
                    console.log('已继续朗读', synth.paused)
                }
                return
            }

            if (readContent !== '' && typeof speakText === 'undefined') {
                const speakText = new SpeechSynthesisUtterance(readContent)

                speakText.onend = (_) => {
                    console.log('文章结束了')
                    synth.cancel()
                }

                if (synth.onvoiceschanged !== undefined) {
                    synth.cancel()
                }

                speakText.onerror = (e) => {
                    console.log('有什么地方出错了', e)
                }

                voices!.forEach((voice) => {
                    if (voice.name === selectedVoice) {
                        speakText.voice = voice
                        speakText.lang = voice.lang
                    }
                })

                speakText.volume = 1
                speakText.rate = 1
                speakText.pitch = 1

                synth.cancel()
                synth.speak(speakText)
            }
        }
    }

    const initVoice = useCallback(async () => {
        try {
            const allVoices = await getVoices()
            setVoices(allVoices)
        } catch (error) {
            console.log(error)
        }
    }, [])

    useEffect(() => {
        initVoice()
    }, [initVoice])

    const head = () => (
        <Head>
            <title>
                {blog.title} | {process.env.NEXT_PUBLIC_APP_NAME}
            </title>
            <meta name="description" content={blog.description} />
            <link
                rel="canonical"
                href={`${process.env.NEXT_PUBLIC_DOMAIN}/blogs/${blog._id}`}
            />
            <meta
                property="og:title"
                content={`${blog.title}| ${process.env.NEXT_PUBLIC_APP_NAME}`}
            />
            <meta property="og:description" content={blog.description} />
            <meta property="og:type" content="webiste" />
            <meta
                property="og:url"
                content={`${process.env.NEXT_PUBLIC_DOMAIN}/blogs/${blog._id}`}
            />
            <meta
                property="og:site_name"
                content={`${process.env.NEXT_PUBLIC_APP_NAME}`}
            />
            <meta
                property="og:image"
                content={`${process.env.NEXT_PUBLIC_API}/blog/image/${blog._id}`}
            />
            <meta
                property="og:image:secure_url"
                content={`${process.env.NEXT_PUBLIC_API}/blog/image/${blog._id}`}
            />
            <meta property="og:image:type" content="image/jpg" />
            <meta name="theme-color" content="#eff3f8" />
        </Head>
    )

    const relatedConfig = {
        0: {
            height: '275px',
        },
        2: {
            height: '275px',
        },
    }

    mergeStyles(relatedBlogs, relatedConfig)

    const showRelatedBlog = () => {
        return (
            <BlogCategory posts={relatedBlogs} columns={3} tagsOnTop={true} />
        )
    }

    return (
        <>
            {blog && head()}
            <SlideImage imgSrc={`/blog/image/${blog._id}`} alt={blog.title} />
            <main className="blog-article">
                <article className="article-header-container">
                    <section className="article-header">
                        <>
                            <h1>{blog.title}</h1>
                        </>
                        <p>
                            <span className="author-text">
                                By : {'  '}
                                <Link href={`/profile/${blog.author.username}`}>
                                    {blog.author.name}
                                </Link>
                            </span>
                            <span className="description-text">
                                {' '}
                                |{' '}
                                {dayjs(blog.createdAt, 'zh', true).format(
                                    'MMMM,DD,YYYY'
                                )}
                            </span>
                        </p>
                        <TagRow tags={blog.tags} />
                    </section>
                </article>
                {voices.length > 0 && (
                    <div className="speaker-container">
                        <form onSubmit={handleRead}>
                            <select
                                value={selectedVoice}
                                onChange={handleVoiceChange}
                            >
                                {voices.length > 0 &&
                                    voices.map((voice) => (
                                        <option
                                            value={voice.name}
                                            key={voice.name}
                                        >
                                            {voice.name}
                                        </option>
                                    ))}
                            </select>
                            <button type="submit">
                                <CustomerServiceOutlined />
                            </button>
                        </form>
                    </div>
                )}
                <article className="article-content">
                    <section
                        dangerouslySetInnerHTML={{ __html: blog.body }}
                    ></section>
                </article>
                <div className="contaienr" style={{ padding: '35px' }}>
                    {showComents()}
                </div>
                <div className="container">
                    <h4 className="text-center">相关推荐</h4>
                    <div className="related-blogs">{showRelatedBlog()}</div>
                </div>
            </main>
        </>
    )
}

function initRecent(): Promise<IBlog[]> {
    return new Promise((resolve, reject) => {
        singleCategory('recent-post').then((data) => {
            if (data.error) {
                // console.log(data.error);
                reject(data.error)
            } else {
                // return { recentPost: data.blogs };
                resolve(data.blogs)
            }
        })
    })
}

function initTrending(): Promise<IBlog[]> {
    return new Promise((resolve, reject) => {
        singleCategory('trending').then((data) => {
            if (data.error) {
                // console.log(data.error);
                reject(data.error)
            } else {
                // return { recentPost: data.blogs };
                resolve(data.blogs)
            }
        })
    })
}

function initFeatured(): Promise<IBlog[]> {
    return new Promise((resolve, reject) => {
        singleCategory('featured').then((data) => {
            if (data.error) {
                // console.log(data.error);
                reject(data.error)
            } else {
                // return { recentPost: data.blogs };
                resolve(data.blogs)
            }
        })
    })
}

export const getStaticPaths: GetStaticPaths =
    async (): Promise<GetStaticPathsResult> => {
        const recentPosts = await initRecent()
        const trendingPosts = await initTrending()
        const featuredPosts = await initFeatured()
        const posts = [...recentPosts, ...trendingPosts, ...featuredPosts]
        const paths = posts.map((post) => ({
            params: {
                id: post._id,
            },
        }))

        return {
            paths,
            fallback: true,
        }
    }

export const getStaticProps: GetStaticProps = async ({
    params,
}: GetStaticPropsContext) => {
    const initialBlog = await singleBlog(params!.id as any)
    const blog = {
        _id: initialBlog._id,
        tags: initialBlog.tags,
        categories: initialBlog.categories,
    }
    const relatedBlogs = await listRelated({ blog })

    return {
        props: { initialBlog, relatedBlogs, id: params!.id! },
        revalidate: 1,
    }
}

export default SingleBlog
