const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should()
const expect = chai.expect

baseURL = 'https://reqres.in'

chai.use(chaiHttp)
describe('API testing', function () {

    describe('Get single user', function () {
        it('should get a user by userId', function (done) {
            const userId = 3
            chai.request(baseURL)
                .get('/api/users/' + userId)
                .end( (err, resp) => {
                    if (err) done(err)
                    resp.should.has.status(200)
                    resp.should.has.header('Content-Type', /json/)
                    resp.should.be.json
                    resp.body.data.should.has.property('id', userId)
                    resp.body.data.should.has.property('email', 'emma.wong@reqres.in')
                    resp.body.data.should.has.property('first_name', 'Emma')
                    resp.body.data.should.has.property('last_name', 'Wong')
                    resp.body.data.should.has.property('avatar', 'https://reqres.in/img/faces/3-image.jpg')
                    resp.body.support.should.be.an('object')
                done()
                })
        })

        it('should NOT get a user by userId', function (done) {
            let userId = 23
            chai.request(baseURL)
                .get('/api/users/' + userId)
                .end( (err, resp) => {
                    if (err) done(err)
                    resp.should.has.status(404)
                    resp.body.should.be.empty
                    resp.notFound.should.be.true
                done()
                })
        })
    })

    describe('Get users', function () {
        it('should get list of users based on its page', function (done) {
            const page = 1
            chai.request(baseURL)
                .get('/api/users?page=' + page)
                .end( (err, resp) => {
                    if (err) done(err)
                    resp.should.has.status(200)
                    resp.should.has.header('Content-Type', /json/)
                    resp.body.should.has.property('page', page)
                    resp.body.data.should.be.an('array')
                    resp.body.data[0].should.has.all.keys('id', 'email', 'first_name', 'last_name', 'avatar')
                done()
                })
        })
    })

    describe('Get colors', function () {
        it('should get list of colors by its param', function (done) {
            const param = 'color'
            const page = 2
            chai.request(baseURL)
                .get('/api/' + param + '?page=' + page)
                .end( (err, resp) => {
                    if (err) done(err)
                    resp.should.has.status(200)
                    resp.ok.should.be.true
                    resp.body.should.has.property('page', page).that.is.a('number')
                    resp.body.should.has.property('per_page', 6).that.is.a('number')
                    resp.body.should.has.property('total', 12).that.is.a('number')
                    resp.body.should.has.property('total_pages', 2).that.is.a('number')
                    resp.body.should.has.property('data').that.is.an('array')
                    resp.body.should.has.property('support').that.is.an('object')
                done()
                })
        })
    })

    describe('Get single color', function () {
        it('should get a color by its param', function (done) {
            const param = 'color'
            const id = 6
            chai.request(baseURL)
                .get('/api/' + param + '/' + id)
                .end( (err, resp) => {
                    if (err) done(err)
                    resp.should.has.status(200)
                    resp.ok.should.be.true
                    resp.body.data.should.be.an('object')
                    resp.body.data.should.has.all.keys('id', 'name', 'year', 'color', 'pantone_value')
                done()
                })
        })

        it('should NOT get a color by its param', function (done) {
            const param = 'color'
            const id = 23
            chai.request(baseURL)
                .get('/api/' + param + '/' + id)
                .end( (err, resp) => {
                    if (err) done(err)
                    resp.should.has.status(404)
                    resp.ok.should.be.false
                    resp.notFound.should.be.true
                    resp.body.should.be.empty
                done()
                })
        })
    })

    describe('Create new user', function () {
        it('should create an user', function (done) {
            let today = new Date().toISOString().slice(0, 10)
            const newUser = {
                name: 'kiki',
                job: 'qa'
            }
            chai.request(baseURL)
                .post('/api/users')
                .send(newUser)
                .end( (err, resp) => {
                    if (err) done(err)
                    resp.should.has.status(201)
                    resp.should.be.json
                    resp.should.be.an('object')
                    resp.body.should.has.property('name', newUser.name)
                    resp.body.should.has.property('job', newUser.job)
                    resp.body.should.has.property('id').that.is.a('string')
                    resp.body.should.has.property('createdAt').that.include(today)
                done()
                })
        })
    })

    describe('Update existing user data using PUT', function () {
        it('should update an user data by its userId', function (done) {
            let today = new Date().toISOString().slice(0, 10)
            let userId = 5
            let updatedUser = {
                name: 'sumantri',
                job: 'sdet'
            }
            chai.request(baseURL)
                .put('/api/users/' + userId)
                .send(updatedUser)
                .end( (err, resp) => {
                    if (err) done(err)
                    resp.should.has.status(200)
                    resp.ok.should.be.true
                    resp.should.has.header('Content-Type', /json/)
                    resp.should.be.an('object')
                    resp.body.should.has.property('name', updatedUser.name)
                    resp.body.should.has.property('job', updatedUser.job)
                    resp.body.should.has.property('updatedAt').that.is.include(today)
                done()
                })
        })
    })

    describe('Update existing user data using PATCH', function () {
        it('should update an user data by its userId', function (done) {
            let today = new Date().toISOString().slice(0, 10)
            let userId = 9
            let updatedUser = {
                name: 'kiki sumantri',
                job: 'it sqa'
            }
            chai.request(baseURL)
                .patch('/api/users/' + userId)
                .send(updatedUser)
                .end( (err, resp) => {
                    if (err) done(err)
                    resp.should.has.status(200)
                    resp.ok.should.be.true
                    resp.should.be.json
                    resp.should.be.an('object')
                    resp.body.should.has.property('name', updatedUser.name)
                    resp.body.should.has.property('job', updatedUser.job)
                    resp.body.should.has.property('updatedAt').that.is.include(today)
                done()
                }) 
        })
    })

    describe('Removing existing user data using DELETE', function () {
        it('should delete an user data by its userId', function (done) {
            let userId = 11
            chai.request(baseURL)
                .delete('/api/users/' + userId)
                .end( (err, resp) => {
                    if (err) done(err)
                    resp.should.has.status(204)
                    resp.noContent.should.be.true
                    resp.body.should.be.empty
                done()
                })
        })
    })

    describe('Register a new but defined user', function () {
        it('should succeed registering new user', function (done) {
            let definedUser = {
                email: "rachel.howell@reqres.in",
                password: "somepassword123"
            }
            chai.request(baseURL)
                .post('/api/register')
                .send(definedUser)
                .end( (err, resp) => {
                    if (err) done(err)
                    resp.should.has.status(200)
                    resp.ok.should.be.true
                    resp.should.has.header('Content-Type', /json/)
                    resp.should.be.an('object')
                    resp.body.should.has.property('id').that.is.a('number')
                    resp.body.should.has.property('token').that.is.a('string')
                done()
                })
        })

        it('should NOT succeed registering new user - missing password', function (done) {
            let definedUser = {
                email: "rachel.howell@reqres.in"
            }
            chai.request(baseURL)
                .post('/api/register')
                .send(definedUser)
                .end( (err, resp) => {
                    if (err) done(err)
                    resp.should.has.status(400)
                    resp.badRequest.should.be.true
                    resp.should.be.json
                    resp.body.should.has.property('error', 'Missing password').that.is.a('string')
                    resp.body.should.be.an('object')
                done()
                })
        })

        it('should NOT succeed registering new user - missing email or username', function (done) {
            let definedUser = {
                password: "somepassword123"
            }
            chai.request(baseURL)
                .post('/api/register')
                .send(definedUser)
                .end( (err, resp) => {
                    if (err) done(err)
                    resp.should.has.status(400)
                    resp.badRequest.should.be.true
                    resp.should.be.json
                    resp.body.should.has.property('error', 'Missing email or username').that.is.a('string')
                    resp.body.should.be.an('object')
                done()
                })
        })

        it('should NOT succeed registering undefined user', function (done) {
            let undefinedUser = {
                email: "kiki.sumantri@gmail.com",
                password: "somepassword123"
            }
            chai.request(baseURL)
                .post('/api/register')
                .send(undefinedUser)
                .end( (err, resp) => {
                    if (err) done(err)
                    resp.should.has.status(400)
                    resp.badRequest.should.be.true
                    resp.should.be.json
                    resp.body.should.has.property('error', 'Note: Only defined users succeed registration').that.is.a('string')
                    resp.body.should.be.an('object')
                done()
                })
        })
    })

    describe('Login user', function () {
        it('should login successfully using valid credentials', function (done) {
            let validCreds = {
                "email":"tobias.funke@reqres.in",
                "password":"somepassword666"
            }
            chai.request(baseURL)
                .post('/api/login')
                .send(validCreds)
                .end( (err, resp) => {
                    if (err) done(err)
                    resp.should.has.status(200)
                    resp.ok.should.be.true
                    resp.should.has.header('Content-Type', /json/)
                    resp.should.be.an('object')
                    resp.body.should.has.property('token').that.is.a('string')
                    resp.body.token.should.has.lengthOf(17)
                done()
                })
        })

        it('should NOT login using incomplete credentials - missing password', function (done) {
            let incompleteCreds = {
                "email":"tobias.funke@reqres.in"
            }
            chai.request(baseURL)
                .post('/api/login')
                .send(incompleteCreds)
                .end( (err, resp) => {
                    if (err) done(err)
                    resp.should.has.status(400)
                    resp.badRequest.should.be.true
                    resp.body.should.has.property('error', 'Missing password').that.is.a('string')
                    resp.body.should.be.an('object')
                done()
                })
        })

        it('should NOT login using incomplete credentials - missing email or username', function (done) {
            let incompleteCreds = {
                "password":"somepassword666"
            }
            chai.request(baseURL)
                .post('/api/login')
                .send(incompleteCreds)
                .end( (err, resp) => {
                    if (err) done(err)
                    resp.should.has.status(400)
                    resp.badRequest.should.be.true
                    resp.body.should.has.property('error', 'Missing email or username').that.is.a('string')
                    resp.body.should.be.an('object')
                done()
                })
        })

        it('should NOT login using invalid credentials - user not found', function (done) {
            let invalidCreds = {
                "email":"kiki.sumantri@reqres.in",
                "password":"somepassword666"
            }
            chai.request(baseURL)
                .post('/api/login')
                .send(invalidCreds)
                .end( (err, resp) => {
                    if (err) done(err)
                    resp.should.has.status(400)
                    resp.badRequest.should.be.true
                    resp.body.should.has.property('error', 'user not found').that.is.a('string')
                    resp.body.should.be.an('object')
                done()
                })
        })
    })

    describe('Get user list', function () {
        this.timeout(7000)
        it('should get list of users with some delay times', function (done) {
            let delayTime = 5
            chai.request(baseURL)
                .get('/api/users?delay=' + delayTime)
                .end( (err, resp) => {
                    if (err) done(err)
                    resp.should.has.status(200)
                    resp.ok.should.be.true
                    resp.should.be.json
                    resp.body.data.should.be.an('array')
                    resp.body.data[0].should.has.all.keys('id', 'email', 'first_name', 'last_name', 'avatar')
                    resp.body.data[0].should.has.property('id', 1).that.is.a('number')
                    resp.body.data[1].should.has.property('email', 'janet.weaver@reqres.in').that.is.a('string')
                    resp.body.data[2].should.has.property('first_name', 'Emma').that.is.a('string')
                    resp.body.data[3].should.has.property('last_name', 'Holt').that.is.a('string')
                    resp.body.data[4].should.has.property('avatar', 'https://reqres.in/img/faces/5-image.jpg').that.is.a('string')
                done()
                })
        })
    })
})
