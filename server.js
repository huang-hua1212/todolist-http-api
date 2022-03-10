const http = require('http');
const { v4: uuidv4 } = require('uuid');
const errHandle = require('./errorHandle');
var todoList = [];
const requestListener = (req, res) => {
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json'
    }
    const { url, method } = req;
    let body = '';
    req.on('data', chunk => {
        body += chunk;
    });
    if (url === '/todolist' && method === 'GET') {
        console.log('in get');
        res.writeHead(200, headers);
        const jsonStr = JSON.stringify({
            'status': 'success',
            'data': todoList,
        });
        res.write(jsonStr);
        res.end();
    }else if (url === '/todolist' && method === 'POST') {
        res.writeHead(200, headers);
        req.on('end', () => {
            try {
                const title = JSON.parse(body).title;
                if (title === undefined) {
                    errHandle(res, headers);

                } else {
                    const todo = {
                        'title': title,
                        'id': uuidv4(),
                    };
                    todoList.push(todo);
                    const jsonStr = JSON.stringify({
                        'status': 'success',
                        'data': todoList,
                    });
                    res.write(jsonStr);
                    res.end();
                }
            } catch (err) {
                console.log('json fail');
                errHandle(res, headers);
            }

        });
    } else if (url === '/todolist/all' && method === 'DELETE') {
        res.writeHead(200, headers);
        // 將todos陣列全部的數據清除
        //方法一
        // todos.length=0;
        // console.log('after delete:',todos);
        // 方法二
        todoList = [];
        const jsonStr = JSON.stringify({
            'status': 'success',
            'data': todoList,
            'delete': 'yes',
        });
        res.write(jsonStr);
        res.end();
    } else if (url.startsWith('/todolist/') &&method === 'DELETE') {
        res.writeHead(200, headers);
        const urlArr = url.split('/');
        const delId = urlArr.pop();//urlArr[urlArr.length-1];
        const delIndex = todoList.findIndex(ele => ele.id === delId);
        if (delIndex !== -1) {
            // 將單筆todo數據清除
            const jsonStr = JSON.stringify({
                'status': 'success',
                'delete': 'yes',
                'id': delId,
                'data': todoList,
            });
            res.write(jsonStr);
            res.end();
        } else {
            errHandle(res, headers);
        }
    } else if (url.startsWith('/todolist/') && method === 'PATCH') {
        res.writeHead(200, headers);
        req.on('end', () => {
            try {
                const title = JSON.parse(body).title;
                if (title === 'undefined') {
                    errHandle(res, headers);
                } else {
                    const urlArr = url.split('/');
                    const putId = urlArr.pop();
                    const putIndex = todoList.findIndex(ele => ele.id === putId);
                    if (title === undefined || putIndex === -1) {
                        errHandle(res, headers);
                    } else {
                        todoList[putIndex].title = title;
                        const jsonStr = JSON.stringify({
                            'status': 'success',
                            'after modify': todoList[putIndex],
                            'data': todoList,
                        });
                        res.write(jsonStr);
                        res.end();
                    }
                };
            } catch (err) {
                errHandle(res, headers);
            }

        });
    } else if (method === "OPTIONS") {
        res.writeHead(200, headers);
        const jsonStr = JSON.stringify({
            'status': 'success',
            'data': ['OPtions success'],
        });
        res.write(jsonStr);
        res.end();
    }else{
        res.writeHead(404, headers);
        const jsonStr = JSON.stringify({
            'status': 'false',
            'message': '無此網路路由',
        });
        res.write(jsonStr);
        res.end();
    }
}

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3005);