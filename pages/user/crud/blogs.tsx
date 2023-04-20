import BlogList from '../../../components/crud/BlogList'
import { useAuthStore } from '../../../hooks/store/useAuthStore'

const Blog = () => {
    const { user } = useAuthStore()
    return (
        <div className="manageBlog-container">
            <BlogList username={user?.username} />
        </div>
    )
}

export default Blog
