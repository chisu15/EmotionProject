const User = require("../models/user.model");
const { userValidate } = require("../helpers/validation");
const bcrypt = require("bcrypt");
const Session = require("../models/session.model");
const { scheduleSessionExpiry } = require("../helpers/scheduleSession");
const { v4: uuidv4 } = require('uuid');

// [POST] INDEX
module.exports.index = async (req, res) => {
	try {
		const user = await User.find();
		const totalUser = await User.count();
		if (totalUser.total == 0) {
			return res
				.json({
					code: 204,
					message: "No user found",
				})
				.status(204);
		}
		return res.status(200).json({
			code: 200,
			message: "Get data success",
			total: totalUser.total,
			user,
		});
	} catch (error) {
		return res.status(500).json({
			code: 500,
			message: error.message,
		});
	}
};

// [POST] DETAIL
module.exports.detail = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await User.findById(id);
		console.log(user);

		if (user.length == 0) {
			return res
				.json({
					code: 204,
					message: "Not found user",
				})
				.status(204);
		}
		
		return res.status(200).json({
			code: 200,
			message: "Get data success",
			user: user,
		});
	} catch (error) {
		return res.status(500).json({
			code: 500,
			message: error.message,
		});
	}
};


// [POST] CREATE
module.exports.create = async (req, res) => {
	try {
		const data = req.body;
		const { error } = userValidate(data);
		if (error) {
			return res.status(422).json({
				code: 422,
				message: error.details[0].message,
			});
		}
		const existedUser = await User.findByData("email", data.email);
		console.log(existedUser.length);
		if (existedUser.length != 0) {
			return res.json({
				code: 500,
				message: "User already exists",
			});
		}
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(data.password, salt);
		data.password = hashedPassword;
		const user = await User.create(data);
		const createdUser = await User.findByData("email", data.email);
		if (createdUser.length == 0) {
			return res.json({
				code: 500,
				message: "Failed to create user",
			});
		}
		return res.status(201).json({
			code: 201,
			message: "Create data success",
			user: user[0],
		});
	} catch (error) {
		return res.status(500).json({
			code: 500,
			message: error.message,
		});
	}
};

// [PATCH] EDIT
module.exports.edit = async (req, res) => {
	try {
		const { id } = req.params;
		const data = req.body;
		const existedUser = await User.findById(id);
		console.log(existedUser);
		if (existedUser.length == 0) {
			return res
				.json({
					code: 204,
					message: "Not found user",
				})
				.status(204);
		}
		if (existedUser.password_hash != data.password) {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(data.password, salt);
			data.password = hashedPassword;
		}
		const user = await User.updateById(id, data);
		console.log(user);
		if (user.success) {
			return res.json({
				code: 200,
				message: "Update user success",
				user: user.data,
			});
		} else {
			return res.json({
				code: 500,
				message: "Update user failed",
			});
		}
	} catch (error) {
		return res.status(500).json({
			code: 500,
			message: error.message,
		});
	}
};

// [DELETE] DELETE
module.exports.delete = async (req, res) => {
	try {
		const { id } = req.params;
		const existedUser = await User.findById(id);
		console.log(existedUser);
		if (existedUser.length == 0) {
			return res
				.json({
					code: 204,
					message: "Not found user",
				})
				.status(204);
		}
		const user = await User.deleteById(id);
		if (user) {
			return res.json({
				code: 200,
				message: "Delete user success",
			});
		} else {
			return res.json({
				code: 500,
				message: "Delete user failed",
			});
		}
	} catch (error) {
		return res.status(500).json({
			code: 500,
			message: error.message,
		});
	}
};

module.exports.login = async (req, res) => {
	try {
		const data = req.body;
		console.log(data);
		const existedUser = await User.findByData("email", data.email);
		console.log(existedUser);
		if (existedUser.length == 0) {
			return res
				.json({
					code: 204,
					message: "Not found user",
				})
				.status(204);
		}
		let checkPassword = false;
		console.log(data.password, "+", existedUser[0].password_hash);

		const validPass = await bcrypt.compare(
			data.password,
			existedUser[0].password_hash
		);
		console.log(validPass);
		if (validPass) {
			checkPassword = true;
		}
		else if(data.password === existedUser[0].password_hash)
		{
			checkPassword = true;
		}
		if (!checkPassword) {
			return res.status(401).json({
				code: 401,
				message: "Invalid password",
			});
		}
		const expireAt = new Date(
			Date.now() + parseInt(process.env.EXPIRE_TIME)
		);
		console.log(existedUser[0]);

		const sessionData = {
			user_id: existedUser[0].id,
			expire_at: expireAt,
			expired: 0,
			session_id: uuidv4()
		};
		console.log(sessionData);
		
		// Lưu session vào DB
		const session = await Session.create(sessionData);
		console.log(session);

		if (session.success) {
			scheduleSessionExpiry(session.id, sessionData.expire_at);
		} else {
			return res.json({
				code: 500,
				message: "Failed to create user",
			});
		}
		const {password, ...loginUser} = existedUser[0];
		return res.status(200).json({
			code: 200,
			message: "Login successful",
			user: loginUser,
			session_id: sessionData.session_id,
			expire_at: sessionData.expire_at,

		});
	} catch (error) {
		return res.status(500).json({
			code: 500,
			message: error.message,
		});
	}
};

module.exports.logout = async (req, res) => {
	try {
		const sessionId = req.body.session_id;
		const session = await Session.findBySessionId(sessionId);

		console.log(session);

		if (session.length == 0) {
			return res
				.json({
					code: 204,
					message: "Session not found",
				})
				.status(204);
		}
		if (session[0].expired) {
			return res.status(400).json({
				success: false,
				message: "Session is already expired",
			});
		}
		await Session.updateById(session[0].id, { ...session[0], expired: 1 });
		return res.status(200).json({
			code: 200,
			message: "Logout successful",
		});
	} catch (error) {
		return res.status(500).json({
			code: 500,
			message: error.message,
		});
	}
};

