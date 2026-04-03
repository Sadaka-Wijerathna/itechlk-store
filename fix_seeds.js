const fs = require('fs');

const fixImages = (content) => {
  return content
    .replace('https://images.ctfassets.net/y2ske730sjqp/1aONibCke6niZhgPxuiilC/2c401b05a07288746ddf3bd3943fbc76/BrandAssets_Logos_01-Wordmark.jpg', 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg')
    .replace('https://p16-seeyou-sg.ibyteimg.com/tos-alisg-i-2zwwjm3azk-sg/b6ff445756bb46e4bba0f5a41d5ee1a8~tplv-2zwwjm3azk-image.webp', 'https://upload.wikimedia.org/wikipedia/en/thumb/2/23/CapCut_logo.svg/1024px-CapCut_logo.svg.png')
    .replace('https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Windows_logo_-_2021.svg/1200px-Windows_logo_-_2021.svg.png', 'https://upload.wikimedia.org/wikipedia/commons/8/87/Windows_logo_-_2021.svg')
    .replace('https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/2048px-Spotify_logo_without_text.svg.png', 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg')
    .replace('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Youtube_logo.png/1200px-Youtube_logo.png', 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg')
    .replace('https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Adobe_Photoshop_CC_icon.svg/1200px-Adobe_Photoshop_CC_icon.svg.png', 'https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Photoshop_CC_icon.svg')
    .replace('https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1200px-Microsoft_logo.svg.png', 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg')
    .replace('https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1024px-ChatGPT_logo.svg.png', 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg')
};

function processFile(filename) {
    if (fs.existsSync(filename)) {
        const content = fs.readFileSync(filename, 'utf8');
        fs.writeFileSync(filename, fixImages(content));
        console.log('Fixed ' + filename);
    }
}

processFile('prisma/seed.ts');
processFile('prisma/seed.js');
