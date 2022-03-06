
// export default {
//     errorHandle(res,headers) {
//         res.writeHead(400, headers);
//         const jsonStr = JSON.stringify({
//             'status': 'false',
//             'message': '欄位未填寫正確，或無此todo id',
//         });
//         res.write(jsonStr);
//         res.end();
//     }
// }
function errorHandle(res,headers) {
    res.writeHead(400, headers);
    const jsonStr = JSON.stringify({
        'status': 'false',
        'message': '欄位未填寫正確，或無此todo id',
    });
    res.write(jsonStr);
    res.end();
}
module.exports=errorHandle;
