import Private from '../../../components/auth/Private'
import BlogUpdate from '../../../components/crud/BlogUpdate'

const Blog = () => {
    return (
        <Private>
            <div className="blogUpdate-container">
                <BlogUpdate />
            </div>
        </Private>
    )
}

export default Blog
