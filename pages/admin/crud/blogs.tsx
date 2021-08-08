import Admin from '../../../components/auth/Admin'
import BlogRead from '../../../components/crud/BlogRead'

const Blog = () => {
    return (
        <Admin>
            <div className="manageBlog-container">
                <BlogRead />
            </div>
        </Admin>
    )
}

export default Blog
