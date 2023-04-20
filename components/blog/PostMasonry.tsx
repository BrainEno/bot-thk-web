import { IBlog } from '../../types'

import PostCard from './PostCard'

export type ImgUseFor =
    | 'default'
    | 'recent-post'
    | 'featured'
    | 'trending'
    | 'related'

interface IPostMasonryProps {
    posts: IBlog[]
    columns: number
    tagsOnTop: boolean
    imgFor?: ImgUseFor
}
const PostMasonry: React.FC<IPostMasonryProps> = ({
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
