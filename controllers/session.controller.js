const Session = require('../models/session.model.js');

// [POST] INDEX
module.exports.index = async (req, res) => {
    try {
        const sessions = await Session.find();
        const totalSession = await Session.count();
        if (!sessions.length) {
            return res
                .json({
                    code: 204,
                    message: "No sessions found",
                })
                .status(204);
        }
        return res.status(200).json({
            code: 200,
            message: "Get data success",
            totalSessionActive: totalSession.total,
            sessions,
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
        const session = await Session.findById(id);
        if (session.length == 0) {
            return res
                .json({
                    code: 204,
                    message: "Not found session",
                })
                .status(204);
        }
        return res.status(200).json({
            code: 200,
            message: "Get data success",
            session: session[0],
        });
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
        const existedSession = await Session.findById(id);
        console.log(existedSession);
        if (existedSession.length == 0) {
            return res
                .json({
                    code: 204,
                    message: "Not found session",
                })
                .status(204);
        }
        const session = await Session.deleteById(id);
        if (session)
        {
            return res.json({
                code: 200,
                message: "Delete session success",
            })
        }
        else {
            return res.json({
                code: 500,
                message: "Delete session failed",
            })
        }
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: error.message,
        });
    }
};
