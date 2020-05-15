
function PaymentDao(connection) {
    this._connection = connection;
}

PaymentDao.prototype.save = function (pagamento, callback) {
    this._connection.query('INSERT INTO payments SET ?', pagamento, callback);
}

PaymentDao.prototype.seachById = function (id, callback) {
    this._connection.query("select * from payments where id = ?", [id], callback);
}

PaymentDao.prototype.update = function (pagamento, callback) {
    this._connection.query('UPDATE payments SET status = ? where id = ?', [pagamento.status, pagamento.id], callback);
}

PaymentDao.prototype.list = function (callback) {
    this._connection.query('select * from payments', callback);
}


module.exports = function () {
    return PaymentDao;
};