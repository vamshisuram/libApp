exports.routes = function (map) {
    map.resources('books');

    map.get('/', "books#index");
};
