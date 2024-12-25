const db = require("../configs/db");
const mssql = require("mssql");

module.exports.find = async () => {
	try {
		const record = await db.pool
			.request()
			.query(`SELECT id, username, email, name FROM [Users]`);
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
		const record = await db.pool.request().input("id", mssql.Int, id)
			.query(`
                SELECT 
                    id, username, email, name
                FROM [Users]
                WHERE id = @id
            `);

		return record.recordset[0];
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
		console.log("\\\\\\\\", key, "-", value);

		const record = await db.pool
			.request()
			.input("value", mssql.NVarChar, value).query(`
            SELECT * FROM [Users]
            WHERE ${key} = @value
        `);
		console.log(record);

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
		const result = await db.pool
			.request()
            .input("username", mssql.NVarChar, data.username)
			.input("name", mssql.NVarChar, data.name)
			.input("email", mssql.NVarChar, data.email)
			.input("password_hash", mssql.NVarChar, data.password)
            .query(`
                INSERT INTO [Users] (username, name, email, password_hash)
                VALUES (@username, @name, @email, @password_hash);
                SELECT SCOPE_IDENTITY() AS id;
            `);
		return { success: true, id: result.recordset[0].id };
	} catch (error) {
		console.error("Error creating user:", error.message);
		return { success: false, message: error.message };
	}
};

module.exports.updateById = async (id, data) => {
	try {
		const record = await db.pool
			.request()
			.input("id", mssql.Int, id)
            .input("username", mssql.NVarChar, data.username)
			.input("name", mssql.NVarChar, data.name)
			.input("email", mssql.NVarChar, data.email)
			.input("password_hash", mssql.NVarChar, data.password)
            .query(`
                UPDATE [Users]
                SET 
                    username = @username,
                    name = @name, 
                    email = @email,
                    password_hash = @password_hash
                WHERE id = @id;
                SELECT id, username, name, email, password_hash
                FROM [Users] 
                WHERE id = @id;
            `);
		if (record.recordset.length === 0) {
			return { success: false, message: "User not found" };
		}
		return {
			success: true,
			message: "User updated successfully",
			data: record.recordset[0],
		};
	} catch (error) {
		console.error("Error updating user:", error.message);
		return {
			success: false,
			message: error.message,
		};
	}
};

module.exports.count = async () => {
	try {
		const record = await db.pool.request().query(`
            SELECT COUNT(*) AS total FROM [Users];
        `);

		return {
			success: true,
			total: record.recordset[0].total,
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
		const record = await db.pool.request().input("id", mssql.Int, id)
			.query(`
                DELETE FROM [Users] WHERE id = @id;
            `);

		return {
			success: true,
			message: "Record deleted successfully",
		};
	} catch (error) {
		console.error("error", error.message);
		return {
			success: false,
			message: error.message,
		};
	}
};
