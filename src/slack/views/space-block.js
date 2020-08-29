const generateBlock = () => {
    return [
        {
            "type": "context",
            "elements": [
                {
                    "type": "image",
                    "image_url": "https://api.slack.com/img/blocks/bkb_template_images/placeholder.png",
                    "alt_text": "placeholder"
                }
            ]
        }
    ];
};

module.exports = generateBlock;
