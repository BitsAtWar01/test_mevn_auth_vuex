const mongoAtlasCredentials = {
    username: 'abc123',
    password: '123abc'
}

const dbname = 'mevn_auth';

if(process.env.NODE_ENV === 'production') {
    module.exports = {
    mongoURI: "mongodb+srv://" + mongoAtlasCredentials.username + ":" + mongoAtlasCredentials.password + "@test-mevn-auth.d8bhq.mongodb.net/" + dbname + ">?retryWrites=true&w=majority",
    secret: "yoursecret"
};    
} else {
    module.exports = {
    mongoURI: "mongodb://localhost:27017/" + dbname,
    secret: "yoursecret"
};
}