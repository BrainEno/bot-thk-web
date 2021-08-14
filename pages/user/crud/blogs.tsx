import Private from '../../../components/auth/Private'
import BlogList from '../../../components/crud/BlogList'
import { isAuth } from '../../../actions/auth'

const Blog = () => {
    const username = isAuth() && isAuth().username
    return (
        <Private>
            <div className="manageBlog-container">
                <BlogList username={username} />
            </div>
        </Private>
    )
}

export default Blog
