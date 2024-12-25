const db = require("../configs/db");
const mssql = require("mssql");

module.exports.findAll = async () => {
    try {
        const record = await db.pool.request().query(`SELECT * FROM Emotions`);
        return record.recordset;
    } catch (error) {
        console.error("error", error.message);
        return {
            success: false,
            message: error.message,
        };
    }
};

module.exports.findById = async (id) => {
    try {
        const record = await db.pool.request()
            .input('id', mssql.Int, id)
            .query(`
                SELECT id, name, description FROM Emotions WHERE id = @id
            `);
        
        return record.recordset;
    } catch (error) {
        console.error("error", error.message);
        return {
            success: false,
            message: error.message,
        };
    }
};


module.exports.findByData = async (key, value) => {
    try {
        const query = `
            SELECT id, name, description FROM Emotions
            WHERE ${key} = @value
        `;

        const record = await db.pool.request()
            .input('value', mssql.NVarChar, value)
            .query(query);

        return record.recordset;
    } catch (error) {
        console.error("error", error.message);
        return {
            success: false,
            message: error.message,
        };
    }
};


module.exports.create = async (data) => {
    try {
        const record = await db.pool.request()
            .input('name', mssql.NVarChar, data.name)
            .input('description', mssql.NVarChar, data.description)
            .query(`
                INSERT INTO Emotions (name, description)
                VALUES (@name, @description);
                SELECT SCOPE_IDENTITY() AS id;
            `);

        return {
            success: true,
            id: record.recordset[0].id,
        };
    } catch (error) {
        console.error("error", error.message);
        return {
            success: false,
            message: error.message,
        };
    }
};

module.exports.updateById = async (id, data) => {
    try {
        const record = await db.pool.request()
            .input('id', mssql.Int, id)
            .input('name', mssql.NVarChar, data.name)
            .input('description', mssql.NVarChar, data.description)
            .query(`
                UPDATE Emotions
                SET name = @name, description = @description
                WHERE id = @id;
                SELECT id, name, description FROM Emotions WHERE id = @id
            `);
        return {
            success: true,
            message: 'Record updated successfully',
            data: record.recordset[0],
        };
    } catch (error) {
        console.error("error", error.message);
        return {
            success: false,
            message: error.message,
        };
    }
};

module.exports.deleteById = async (id) => {
    try {
        const record = await db.pool.request()
            .input('id', mssql.Int, id)
            .query(`
                DELETE FROM Emotions WHERE id = @id;
            `);
        
        return {
            success: true,
            message: 'Record deleted successfully'
        };
    } catch (error) {
        console.error("error", error.message);
        return {
            success: false,
            message: error.message,
        };
    }
};

module.exports.count = async () => {
    try {
        const record = await db.pool.request().query(`
            SELECT COUNT(*) AS total FROM Emotions;
        `);
        
        return {
            success: true,
            total: record.recordset[0].total
        };
    } catch (error) {
        console.error("error", error.message);
        return {
            success: false,
            message: error.message,
        };
    }
};
