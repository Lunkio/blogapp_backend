const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    let totalAmount = blogs.reduce((a,b) => a + b.likes, 0)
    return totalAmount
}

const favoriteBlog = (blogs) => {
    let mostLiked = blogs[0]
    for (let i = 0; i < blogs.length; i++) {
        if (blogs[i].likes > mostLiked.likes) {
            mostLiked = blogs[i]
        }
    }
    return mostLiked
}

const mostBlogs = (blogs) => {
    let newObj = { author: null, blogs: null }

    const sortedAuthors = blogs.map(blog => blog.author).sort((a, b) => (a > b ? 1 : -1))

    let currentAuthor = sortedAuthors[0]
    let mostBlogs = sortedAuthors[0]
    let pri = 1
    let total = 0

    for (let i = 1; i < sortedAuthors.length; i++) {
        if (sortedAuthors[i] == currentAuthor) {
            pri++
        } else if (sortedAuthors[i] != currentAuthor) {
            if (total < pri) {
                total = pri
                mostBlogs = currentAuthor
            }
            currentAuthor = sortedAuthors[i]
            pri = 1
        }
    }
    if (total < pri) {
        total = pri
        mostBlogs = currentAuthor
    }

    newObj.author = mostBlogs
    newObj.blogs = total

    return newObj
}

const mostLikes = (blogs) => {
    let newObj = { author: null, likes: null }

    function compare(a, b) {
        if (a.author < b.author) {
            return -1
        }
        if (a.author > b.author) {
            return 1
        }
        return 0
    }

    const authorSort = blogs.sort(compare)
    let currentAuthor = authorSort[0].author
    let amountLikes = authorSort[0].likes
    let authorArray = []
    authorArray.push(currentAuthor)
    let likesArray = []

    for (let i = 1; i < authorSort.length; i++) {
        if (authorSort[i].author == currentAuthor) {
            amountLikes += authorSort[i].likes
        } else if (authorSort[i].author != currentAuthor) {
            likesArray.push(amountLikes)
            amountLikes = authorSort[i].likes
            currentAuthor = authorSort[i].author
            authorArray.push(currentAuthor)
        }
    }
    likesArray.push(amountLikes)

    let biggestLikeIndex = likesArray.indexOf(Math.max(...likesArray))
    let largestLikes = Math.max(...likesArray)
    let author = authorArray[biggestLikeIndex]

    newObj.author = author
    newObj.likes = largestLikes

    return newObj
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}