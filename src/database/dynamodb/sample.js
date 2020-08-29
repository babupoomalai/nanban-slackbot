const dynamoose = require('dynamoose');
dynamoose.AWS.config.update({
    region: 'us-east-2'
});
const createAndGetUser = async () => {
const User = dynamoose.model('User', {id: String, slackProfile:Object});
const u1 = new User({id: 'U0124BW37D1', slackProfile:{
    title: '',
    phone: '',
    skype: '',
    real_name: 'Jayaprakash Harikrishnan',
    real_name_normalized: 'Jayaprakash Harikrishnan',
    display_name: 'Jayaprakash Harikrishnan',
    display_name_normalized: 'Jayaprakash Harikrishnan',
    fields: null,
    status_text: '',
    status_emoji: '',
    status_expiration: 0,
    avatar_hash: '20d38c3f39b4',
    image_original: 'https://avatars.slack-edge.com/2020-04-20/1070818237061_20d38c3f39b4089e5d2f_original.png',
    is_custom_image: true,
    email: 'jayaprakash@forkideas.com',
    image_24: 'https://avatars.slack-edge.com/2020-04-20/1070818237061_20d38c3f39b4089e5d2f_24.png',
    image_32: 'https://avatars.slack-edge.com/2020-04-20/1070818237061_20d38c3f39b4089e5d2f_32.png',
    image_48: 'https://avatars.slack-edge.com/2020-04-20/1070818237061_20d38c3f39b4089e5d2f_48.png',
    image_72: 'https://avatars.slack-edge.com/2020-04-20/1070818237061_20d38c3f39b4089e5d2f_72.png',
    image_192: 'https://avatars.slack-edge.com/2020-04-20/1070818237061_20d38c3f39b4089e5d2f_192.png',
    image_512: 'https://avatars.slack-edge.com/2020-04-20/1070818237061_20d38c3f39b4089e5d2f_512.png',
    image_1024: 'https://avatars.slack-edge.com/2020-04-20/1070818237061_20d38c3f39b4089e5d2f_1024.png',
    status_text_canonical: ''
}});
await u1.save();
const u11 = await User.get('U0124BW37D1');
return u11;
}
const bootStrap = async () => {
    try{
        const u1 = await createAndGetUser();
        console.log('User', u1);
    }catch (e) {
        console.error(e);
    }
}
bootStrap();