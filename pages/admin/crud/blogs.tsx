import Admin from '../../../components/auth/Admin'
import BlogList from '../../../components/crud/BlogList'

const Blog = () => {
    return (
        <Admin>
            <div className="manageBlog-container">
                <BlogList />
            </div>
        </Admin>
    )
}

export default Blog
