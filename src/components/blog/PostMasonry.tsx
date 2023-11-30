import { PopulatedCardBlog } from '../../generated/graphql-request'
import PostCard from './PostCard'

export type ImgUseFor =
    | 'default'
    | 'recent-post'
    | 'featured'
    | 'trending'
    | 'related'

interface PostMasonryProps {
    posts: Omit<PopulatedCardBlog, 'author' | 'description'>[]
    columns: number
    tagsOnTop: boolean
    imgFor?: ImgUseFor
}
const PostMasonry: React.FC<PostMasonryProps> = ({
    posts,
    columns,
    tagsOnTop,
    imgFor,
}) => {
    return (
        <section className={`masonry masonry_${columns}`}>
            {posts.map((post, index) => (
                <PostCard
                    {...{ post, index, tagsOnTop }}
                    index={index}
                    imgFor={imgFor}
                    key={post._id}
                />
            ))}
        </section>
    )
}

export default PostMasonry
