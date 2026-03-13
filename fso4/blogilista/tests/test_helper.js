const Blog = require('../models/blog')

const initialBlogs = [
    {
        "title": "Pulla resepti",
        "author": "Pirjo Pullava",
        "url": "www.fake.com",
        "likes": 23
    },
    {
        "title": "Vauvan hoito for dummies",
        "author": "Eero Etevä",
        "url": "www.kalevauva.com",
        "likes": 1
    },
    {
        "title": "How to start a blog",
        "author": "Mr.Obvious",
        "url": "www.givemoney.com",
        "likes": 1000072
    }

]

const blogsInDB = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs, blogsInDB
}