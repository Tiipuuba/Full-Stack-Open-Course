const Blog = require('../models/blog')
const User = require('../models/user')

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

const initialUsers = [
    {
        "username": "Limppu",
        "name": "Pekka Limppula",
        "passwordHash": "$2b$10$VkLBBjVYlT6Y1AscCx8yF.kb/m7FrKAWhp43gt.vQcH4Bw.qRLWUG"
    },
        {
        "username": "Pirkkis",
        "name": "Pekka Petelius",
        "passwordHash": "$2b$10$PvcP57LgipJ/eUlEhlGtq.ZjeiludqTf7SExZMYLOk0a0Tu07kyuy"
    },
        {
        "username": "PiK",
        "name": "Pirkko Koivuniemi",
        "passwordHash": "$2b$10$hDFS8x8ADo/WQHag8qp/mOkOkMDZu1nOVJGHmuwjuS4XQiceaCuEO"
    }
]

const blogsInDB = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDB = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    initialBlogs, blogsInDB, initialUsers, usersInDB
}