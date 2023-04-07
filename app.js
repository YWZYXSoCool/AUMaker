const express = require('express');
const app = express();

//定义方法
app.get('/SaveJson', function (req, res) {
    let fs = require('fs');
    console.log(req.query.context);
    fs.writeFile(
        './public/config/index.json', 
        JSON.stringify(req.query.context),
        function(err){
            if(err){
            console.log(err);
            }
            console.log('success');
        }
      );
});

app.use(express.static('public'));
app.listen(8090, () => {
    console.log('已在端口8090开启');
});