const imageDownloader = require('image-downloader')


const downloadImage = async (link) => {

    const newName = 'auctimage' + Date.now() + '.jpg'
    const download = await imageDownloader.image({
        url: link,
        dest: __dirname + '/uploads/' + newName     // will be saved to /path/to/dest/photo.jpg
    })

    return download
}


module.exports = downloadImage