const blog = require("../models/blog")

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {

    if (blogs.length === 0) {
        return 0
    } else if (blogs.length === 1) {
        return blogs[0].likes
    }

    let summedLikes = 0
    blogs.forEach((blog) => summedLikes += blog.likes)
    return summedLikes
}

const favoriteBlog = (blogs) => {
    let favorite = undefined
    blogs.forEach((blog) => { 
        if (favorite === undefined) {
            favorite = blog
        }
        if (blog.likes > favorite.likes) {        
            favorite = blog
        }
    })
    return favorite
}

const mostBlogs = (blogs) => {
    
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
}