exports.routes = function (map) {
    map.resources('users');

    map.resources('books');

    map.get('/', "books#index");
};