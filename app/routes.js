module.exports = function(app) {
    // 建立API

    //取得category model
    var Category = require('./models/category');
    
    //取得product model
    var Product = require('./models/product');

    // Homepage
    app.get('/', function(req, res) {
        res.send("Hello from route");
    });

    //about
    app.get('/about', function(req, res) {
        res.send("Hello from about");
    });

       // 新增目錄
    app.post('/addCategory', function(req, res) {
        var category = new Category();
        category.name = req.body.name;
        
        category.save(function(err, category) {
            res.json({
                category: category
            });
        });
    })

        //用id找出特定目錄
    app.get('/category/id/:id', function(req, res) {
        // 用Category Model去找data
        // 對應的collection為categories
        Category.findOne({
            _id: req.params.id
        }, function(error, category) {
            //錯誤處理
            if (error) {
                // internal server error
                return res.status(500).
                json({
                    error: error.toString()
                });
            }
            //category不存在
            if (!category) {
                // data not found
                return res.status(404)
                    .json({
                        error: 'Not found'
                    });
            }
            //有data就回傳json
            res.json({
                category: category
            });
        });
    });
    
    //取得所有目錄for dropdown
    app.get('/categories/all', function(req, res) {
        //空{}代表傳回categories下所有document
        Category.find({}, function(error, categories) {
            if (error) {
                return res.status(500).
                json({
                    error: error.toString()
                });
            }
            res.json({
                categories: categories
            });
        });
    });
    
    //id對應category，取得某一目錄下所有products
    app.get('/products/:id', function(req, res, next) {
        Product
            .find({
                category: req.params.id
            })
            // 將category path替換成對應的資料
            .populate('category')
            .exec(function(err, products) {
                if (err) return next(err);
                // 取到資料就回傳json
                res.json({
                    products: products
                });
            });
    });

    //取得所有product
    app.get('/productsall/', function(req, res) {
        //空{}代表傳回Category下所有document
        Product.find({})
            .populate('category')
            .exec(function(error, products) {
                if (error) {
                    return res.status(500).
                    json({
                        error: error.toString()
                    });
                }
                res.json({
                    products: products
                });
            });
    });
};
