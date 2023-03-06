import { IBlog } from '../../types'

import PostCard from './PostCard'

interface IBlogCategoryProps {
    posts: IBlog[]
    columns: number
    tagsOnTop: boolean
}
const BlogCategory: React.FC<IBlogCategoryProps> = ({
    posts,
    columns,
    tagsOnTop,
}) => {
    return (
        <section
            className="masonry"
            style={{
                gridTemplateColumns: `repeat(${columns},minmax(300px,1fr))`,
            }}
        >
            {posts.map((post, index) => (
                <PostCard {...{ post, index, tagsOnTop }} key={post._id} />
            ))}
        </section>
    )
}

export default BlogCategory
