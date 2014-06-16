var app, compound
, request = require('supertest')
, sinon   = require('sinon');

function UserStub () {
    return {
        email: '',
        password: '',
        role: '',
        createdAt: ''
    };
}

describe('UserController', function() {
    beforeEach(function(done) {
        app = getApp();
        compound = app.compound;
        compound.on('ready', function() {
            done();
        });
    });

    /*
     * GET /users/new
     * Should render users/new.ejs
     */
    it('should render "new" template on GET /users/new', function (done) {
        request(app)
        .get('/users/new')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            app.didRender(/users\/new\.ejs$/i).should.be.true;
            done();
        });
    });

    /*
     * GET /users
     * Should render users/index.ejs
     */
    it('should render "index" template on GET /users', function (done) {
        request(app)
        .get('/users')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            app.didRender(/users\/index\.ejs$/i).should.be.true;
            done();
        });
    });

    /*
     * GET /users/:id/edit
     * Should access User#find and render users/edit.ejs
     */
    it('should access User#find and render "edit" template on GET /users/:id/edit', function (done) {
        var User = app.models.User;

        // Mock User#find
        User.find = sinon.spy(function (id, callback) {
            callback(null, new User);
        });

        request(app)
        .get('/users/42/edit')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            User.find.calledWith('42').should.be.true;
            app.didRender(/users\/edit\.ejs$/i).should.be.true;

            done();
        });
    });

    /*
     * GET /users/:id
     * Should render users/index.ejs
     */
    it('should access User#find and render "show" template on GET /users/:id', function (done) {
        var User = app.models.User;

        // Mock User#find
        User.find = sinon.spy(function (id, callback) {
            callback(null, new User);
        });

        request(app)
        .get('/users/42')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            User.find.calledWith('42').should.be.true;
            app.didRender(/users\/show\.ejs$/i).should.be.true;

            done();
        });
    });

    /*
     * POST /users
     * Should access User#create when User is valid
     */
    it('should access User#create on POST /users with a valid User', function (done) {
        var User = app.models.User
        , user = new UserStub;

        // Mock User#create
        User.create = sinon.spy(function (data, callback) {
            callback(null, user);
        });

        request(app)
        .post('/users')
        .send({ "User": user })
        .end(function (err, res) {
            res.statusCode.should.equal(302);
            User.create.calledWith(user).should.be.true;

            done();
        });
    });

    /*
     * POST /users
     * Should fail when User is invalid
     */
    it('should fail on POST /users when User#create returns an error', function (done) {
        var User = app.models.User
        , user = new UserStub;

        // Mock User#create
        User.create = sinon.spy(function (data, callback) {
            callback(new Error, user);
        });

        request(app)
        .post('/users')
        .send({ "User": user })
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            User.create.calledWith(user).should.be.true;

            app.didFlash('error').should.be.true;

            done();
        });
    });

    /*
     * PUT /users/:id
     * Should redirect back to /users when User is valid
     */
    it('should redirect on PUT /users/:id with a valid User', function (done) {
        var User = app.models.User
        , user = new UserStub;

        User.find = sinon.spy(function (id, callback) {
            callback(null, {
                id: 1,
                updateAttributes: function (data, cb) { cb(null) }
            });
        });

        request(app)
        .put('/users/1')
        .send({ "User": user })
        .end(function (err, res) {
            res.statusCode.should.equal(302);
            res.header['location'].should.include('/users/1');

            app.didFlash('error').should.be.false;

            done();
        });
    });

    /*
     * PUT /users/:id
     * Should not redirect when User is invalid
     */
    it('should fail / not redirect on PUT /users/:id with an invalid User', function (done) {
        var User = app.models.User
        , user = new UserStub;

        User.find = sinon.spy(function (id, callback) {
            callback(null, {
                id: 1,
                updateAttributes: function (data, cb) { cb(new Error) }
            });
        });

        request(app)
        .put('/users/1')
        .send({ "User": user })
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            app.didFlash('error').should.be.true;

            done();
        });
    });

    /*
     * DELETE /users/:id
     * -- TODO: IMPLEMENT --
     */
    it('should delete a User on DELETE /users/:id');

    /*
     * DELETE /users/:id
     * -- TODO: IMPLEMENT FAILURE --
     */
    it('should not delete a User on DELETE /users/:id if it fails');
});
