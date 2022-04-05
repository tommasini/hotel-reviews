var whitelist = ['http://localhost:3000/'];

export default function (req, callback) {
    callback(null, { origin: whitelist.indexOf(req.header('Origin')) !== -1 });
}