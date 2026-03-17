var _ = require('lodash')
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

    let authorList = []

    blogs.forEach((blog) => {
        authorList.push(blog.author)
    })

    
    let byAmount = _.countBy(authorList, String)

    let lastKey = _.findLastKey(byAmount)
    let lastValue = byAmount[lastKey]
    
    return {author: lastKey, blogs: lastValue}
}

const mostLikes = (blogs) => {
    let authorsByLikes = _.reduce(blogs, (result, blog) => {
            result[blog.author] = (result[blog.author] || 0) + blog.likes
            return result
        }, {})

    let authorLikePairs = _.toPairs(authorsByLikes)

    let mostLiked = undefined

    authorLikePairs.forEach((pair) => {
        if (mostLiked === undefined) {
            mostLiked = {author: pair[0], likes: pair[1]}
        } else if (pair[1] > mostLiked.likes) {
            mostLiked = {author: pair[0], likes: pair[1]}
        }
        
    })
    
    return mostLiked
}


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}