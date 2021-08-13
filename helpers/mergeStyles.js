export const mergeStyles = function (posts, config) {
    posts.forEach((post, index) => {
        post.style = config[index]
        post.author = post.author
        post.description = post.description
    })
}
