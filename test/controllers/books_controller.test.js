var app, compound
, request = require('supertest')
, sinon   = require('sinon');

function BookStub () {
    return {
        
    };
}

describe('BookController', function() {
    beforeEach(function(done) {
        app = getApp();
        compound = app.compound;
        compound.on('ready', function() {
            done();
        });
    });

    /*
     * GET /books/new
     * Should render books/new.ejs
     */
    it('should render "new" template on GET /books/new', function (done) {
        request(app)
        .get('/books/new')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            app.didRender(/books\/new\.ejs$/i).should.be.true;
            done();
        });
    });

    /*
     * GET /books
     * Should render books/index.ejs
     */
    it('should render "index" template on GET /books', function (done) {
        request(app)
        .get('/books')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            app.didRender(/books\/index\.ejs$/i).should.be.true;
            done();
        });
    });

    /*
     * GET /books/:id/edit
     * Should access Book#find and render books/edit.ejs
     */
    it('should access Book#find and render "edit" template on GET /books/:id/edit', function (done) {
        var Book = app.models.Book;

        // Mock Book#find
        Book.find = sinon.spy(function (id, callback) {
            callback(null, new Book);
        });

        request(app)
        .get('/books/42/edit')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            Book.find.calledWith('42').should.be.true;
            app.didRender(/books\/edit\.ejs$/i).should.be.true;

            done();
        });
    });

    /*
     * GET /books/:id
     * Should render books/index.ejs
     */
    it('should access Book#find and render "show" template on GET /books/:id', function (done) {
        var Book = app.models.Book;

        // Mock Book#find
        Book.find = sinon.spy(function (id, callback) {
            callback(null, new Book);
        });

        request(app)
        .get('/books/42')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            Book.find.calledWith('42').should.be.true;
            app.didRender(/books\/show\.ejs$/i).should.be.true;

            done();
        });
    });

    /*
     * POST /books
     * Should access Book#create when Book is valid
     */
    it('should access Book#create on POST /books with a valid Book', function (done) {
        var Book = app.models.Book
        , book = new BookStub;

        // Mock Book#create
        Book.create = sinon.spy(function (data, callback) {
            callback(null, book);
        });

        request(app)
        .post('/books')
        .send({ "Book": book })
        .end(function (err, res) {
            res.statusCode.should.equal(302);
            Book.create.calledWith(book).should.be.true;

            done();
        });
    });

    /*
     * POST /books
     * Should fail when Book is invalid
     */
    it('should fail on POST /books when Book#create returns an error', function (done) {
        var Book = app.models.Book
        , book = new BookStub;

        // Mock Book#create
        Book.create = sinon.spy(function (data, callback) {
            callback(new Error, book);
        });

        request(app)
        .post('/books')
        .send({ "Book": book })
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            Book.create.calledWith(book).should.be.true;

            app.didFlash('error').should.be.true;

            done();
        });
    });

    /*
     * PUT /books/:id
     * Should redirect back to /books when Book is valid
     */
    it('should redirect on PUT /books/:id with a valid Book', function (done) {
        var Book = app.models.Book
        , book = new BookStub;

        Book.find = sinon.spy(function (id, callback) {
            callback(null, {
                id: 1,
                updateAttributes: function (data, cb) { cb(null) }
            });
        });

        request(app)
        .put('/books/1')
        .send({ "Book": book })
        .end(function (err, res) {
            res.statusCode.should.equal(302);
            res.header['location'].should.include('/books/1');

            app.didFlash('error').should.be.false;

            done();
        });
    });

    /*
     * PUT /books/:id
     * Should not redirect when Book is invalid
     */
    it('should fail / not redirect on PUT /books/:id with an invalid Book', function (done) {
        var Book = app.models.Book
        , book = new BookStub;

        Book.find = sinon.spy(function (id, callback) {
            callback(null, {
                id: 1,
                updateAttributes: function (data, cb) { cb(new Error) }
            });
        });

        request(app)
        .put('/books/1')
        .send({ "Book": book })
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            app.didFlash('error').should.be.true;

            done();
        });
    });

    /*
     * DELETE /books/:id
     * -- TODO: IMPLEMENT --
     */
    it('should delete a Book on DELETE /books/:id');

    /*
     * DELETE /books/:id
     * -- TODO: IMPLEMENT FAILURE --
     */
    it('should not delete a Book on DELETE /books/:id if it fails');
});
