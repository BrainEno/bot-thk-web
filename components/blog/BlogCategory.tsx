import { IBlog } from '../../types'
import BlogPost from './BlogPost'

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
                <BlogPost {...{ post, index, tagsOnTop, key: index }} />
            ))}
        </section>
    )
}

export default BlogCategory
