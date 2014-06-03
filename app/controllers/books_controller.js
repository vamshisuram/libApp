load('application');

before(loadBook, {
    only: ['show', 'edit', 'update', 'destroy']
    });

action('new', function () {
    this.title = 'New book';
    this.book = new Book;
    render();
});

action(function create() {
    Book.create(req.body.Book, function (err, book) {
        respondTo(function (format) {
            format.json(function () {
                if (err) {
                    send({code: 500, error: book && book.errors || err});
                } else {
                    send({code: 200, data: book.toObject()});
                }
            });
            format.html(function () {
                if (err) {
                    flash('error', 'Book can not be created');
                    render('new', {
                        book: book,
                        title: 'New book'
                    });
                } else {
                    flash('info', 'Book created');
                    redirect(path_to.books);
                }
            });
        });
    });
});

action(function index() {
    this.title = 'Books index';
    Book.all(function (err, books) {
        switch (params.format) {
            case "json":
                send({code: 200, data: books});
                break;
            default:
                render({
                    books: books
                });
        }
    });
});

action(function show() {
    this.title = 'Book show';
    switch(params.format) {
        case "json":
            send({code: 200, data: this.book});
            break;
        default:
            render();
    }
});

action(function edit() {
    this.title = 'Book edit';
    switch(params.format) {
        case "json":
            send(this.book);
            break;
        default:
            render();
    }
});

action(function update() {
    var book = this.book;
    this.title = 'Edit book details';
    this.book.updateAttributes(body.Book, function (err) {
        respondTo(function (format) {
            format.json(function () {
                if (err) {
                    send({code: 500, error: book && book.errors || err});
                } else {
                    send({code: 200, data: book});
                }
            });
            format.html(function () {
                if (!err) {
                    flash('info', 'Book updated');
                    redirect(path_to.book(book));
                } else {
                    flash('error', 'Book can not be updated');
                    render('edit');
                }
            });
        });
    });
});

action(function destroy() {
    this.book.destroy(function (error) {
        respondTo(function (format) {
            format.json(function () {
                if (error) {
                    send({code: 500, error: error});
                } else {
                    send({code: 200});
                }
            });
            format.html(function () {
                if (error) {
                    flash('error', 'Can not destroy book');
                } else {
                    flash('info', 'Book successfully removed');
                }
                send("'" + path_to.books + "'");
            });
        });
    });
});

function loadBook() {
    Book.find(params.id, function (err, book) {
        if (err || !book) {
            if (!err && !book && params.format === 'json') {
                return send({code: 404, error: 'Not found'});
            }
            redirect(path_to.books);
        } else {
            this.book = book;
            next();
        }
    }.bind(this));
}
