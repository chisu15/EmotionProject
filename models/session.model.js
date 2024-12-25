const db = require("../configs/db");
const mssql = require("mssql");

// Lấy tất cả session
module.exports.find = async () => {
    try {
        const record = await db.pool.request().query(`SELECT * FROM Session`);
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
        const record = await db.pool
            .request()
            .input("id", mssql.Int, id)
            .query(`SELECT * FROM [Session] WHERE id = @id`);

        return record.recordset;
    } catch (error) {
        console.error("Error fetching session by ID:", error.message);
        return { success: false, message: error.message };
    }
};
module.exports.findBySessionId = async (session_id) => {
    try {
        console.log(session_id);
        
        const record = await db.pool
            .request()
            .input("session_id", mssql.NVarChar, session_id)
            .query(`SELECT * FROM [Session] WHERE session_id = @session_id`);

        return record.recordset;
    } catch (error) {
        console.error("Error fetching session by ID:", error.message);
        return { success: false, message: error.message };
    }
};

module.exports.create = async (data) => {
    try {
        const record = await db.pool
            .request()
            .input("user_id", mssql.Int, data.user_id)
            .input("expire_at", mssql.Time, data.expire_at)
            .input("expired", mssql.Bit, data.expired)
            .input("session_id", mssql.NVarChar, data.session_id)
            .query(`
                INSERT INTO [Session] (user_id, expire_at, expired, session_id)
                VALUES (@user_id, @expire_at, @expired, @session_id);
                SELECT SCOPE_IDENTITY() AS id;
            `);

        return { success: true, id: record.recordset[0].id };
    } catch (error) {
        console.error("Error creating session:", error.message);
        return { success: false, message: error.message };
    }
};

module.exports.updateById = async (id, data) => {
    try {
        const record = await db.pool
            .request()
            .input("id", mssql.Int, id)
            .input("user_id", mssql.Int, data.user_id)
            .input("expire_at", mssql.Time, data.expire_at)
            .input("expired", mssql.Bit, data.expired).query(`
                UPDATE [Session]
                SET user_id = @user_id, expire_at = @expire_at, expired = @expired
                WHERE id = @id;
                SELECT * FROM Session WHERE id = @id;
            `);

        return {
            success: true,
            message: "Record updated successfully",
            data: record.recordset[0],
        };
    } catch (error) {
        console.error("Error updating session:", error.message);
        return { success: false, message: error.message };
    }
};

module.exports.setExpire = async (id, data) => {
    try {
        const record = await db.pool
            .request()
            .input("id", mssql.Int, id)
            .input("expired", mssql.Bit, data.expired).query(`
                UPDATE [Session]
                SET expired = @expired
                WHERE id = @id;
                SELECT * FROM Session WHERE id = @id;
            `);

        return {
            success: true,
            message: "Record updated successfully",
            data: record.recordset[0],
        };
    } catch (error) {
        console.error("Error updating session:", error.message);
        return { success: false, message: error.message };
    }
};

// Xóa session theo ID
module.exports.deleteById = async (id) => {
    try {
        const record = await db.pool
            .request()
            .input("id", mssql.Int, id)
            .query(`DELETE FROM [Session] WHERE id = @id`);

        return {
            success: true,
            message: "Record deleted successfully",
        };
    } catch (error) {
        console.error("Error deleting session:", error.message);
        return { success: false, message: error.message };
    }
};

module.exports.count = async () => {
    try {
        const record = await db.pool
            .request()
            .query(
                `SELECT COUNT(*) AS total FROM [Session] WHERE expired = 0`
            );
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
