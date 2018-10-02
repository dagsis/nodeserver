'use strict'

let sql = require('mssql');
var settings = require('../setting');

var config = settings.dbConfig;

exports.publication = {
    publicationId: null,
    userId: null,
    text: null,
    file: null,
    created_at: null
};


module.exports.getPublications = async function(userId, desde, hasta, done) {

    var sqls = `SELECT  *  FROM        
                    (SELECT  Publications.userId, Publications.text, Publications.file_at, Publications.created_at, Users.name, Users.surname, Users.nick, Users.email, Users.image,ROW_NUMBER() OVER (ORDER BY Publications.created_at DESC) ROWNUMBER
                    FROM   Users RIGHT OUTER JOIN
                            Follows ON Users.userId = Follows.followed LEFT OUTER JOIN
                            Publications ON Follows.followed = Publications.userId
                    WHERE   (Publications.userId =  ` + userId + `) OR (Follows.userId =  ` + userId + `)
                    GROUP BY Publications.userId, Publications.text, Publications.file_at, Publications.created_at, Users.name, Users.surname, Users.nick, Users.email, Users.image
                    ) AS TablaConRow
                    where ROWNUMBER BETWEEN ${desde} and ${hasta} `



    new sql.ConnectionPool(config).connect().then(pool => {
        return pool.request().query(sqls)
    }).then(recordset => {

        sql.close();
        return done(null, recordset);

    }).catch(err => {
        return done(err, null);
        sql.close();
    });


}

module.exports.save = async function(userId, publication, done) {

    var sqls = 'INSERT INTO Publications (userId,text,file_at,created_at) VALUES (@userId,@text,@file,@create_at)';

    new sql.ConnectionPool(config).connect().then(pool => {
        return pool.request()
            .input('userId', sql.Int, publication.userId)
            .input('text', sql.VarChar, publication.text)
            .input('file', sql.VarChar, publication.file)
            .input('create_at', sql.VarChar, publication.created_at)
            .query(sqls)
    }).then(recordset => {

        return done(null, recordset.rowsAffected);
        sql.close();

    }).catch(err => {
        return done(err, null);
        sql.close();
    });

}

module.exports.publicationByIdUpdateImg = function(publicationId, fileName, fileNameOld, done) {
    sql.connect(config).then(() => {

        var request = new sql.Request();

        request.input('id', sql.Int, publicationId);
        request.input('image', sql.VarChar, fileName);
        request.query('UPDATE Publications SET image=@image where publicationId=@id',
            function(err) {

                if (err) {
                    return done(err, null);
                }

                request.input('id', sql.Int, publicationId);
                request.query('select * from publications WHERE publicationId=@id',
                    function(err, recordset) {

                        if (err) {
                            return done(err, null);
                        }

                        if (recordset.rowsAffected == 0) {
                            return done(null, null);
                        }

                        sql.close();


                        if (fileNameOld) {
                            var filePath = './assets/images/publication/' + fileNameOld;
                            fs.unlink(filePath, (err) => {
                                return done(null, recordset);
                            });
                        } else {
                            return done(null, recordset)
                        }
                    });
            });
    }).catch((err) => {
        return done(err, null);
    });
}