const Emotion = require("../models/emotion.model");

// [POST] INDEX
module.exports.index = async (req, res) => {
    try {
        const emotions = await Emotion.findAll();
        const totalEmotion = await Emotion.count();
        if (!emotions.length) {
            return res
                .json({
                    code: 204,
                    message: "No Emotions found",
                })
                .status(204);
        }
        return res.status(200).json({
            code: 200,
            message: "Get data success",
            total: totalEmotion.total,
            emotions,
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
        const emotion = await Emotion.findById(id);
        if (emotion.length == 0) {
            return res
                .json({
                    code: 204,
                    message: "Not found Emotion",
                })
                .status(204);
        }
        return res.status(200).json({
            code: 200,
            message: "Get data success",
            emotion: emotion[0],
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
        const existedEmotion = await Emotion.findByData("name", data.name);
        console.log(existedEmotion.length);

        if (existedEmotion.length != 0) {
            return res.json({
                code: 500,
                message: "Emotion already exists",
            });
        }
        const emotion = await Emotion.create(data);
        const createdEmotion = await Emotion.findByData("name", data.name);
        if (createdEmotion.length == 0) {
            return res.json({
                code: 500,
                message: "Failed to create Emotion",
            });
        }
        return res.status(201).json({
            code: 201,
            message: "Create data success",
            emotion: Emotion[0],
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
        const {id} = req.params;
        const data = req.body;
        const existedEmotion = await Emotion.findById(id);
        console.log(existedEmotion);
        if (existedEmotion.length == 0) {
            return res
                .json({
                    code: 204,
                    message: "Not found Emotion",
                })
                .status(204);
        }
        const emotion = await Emotion.updateById(id, data);
        console.log(emotion);
        if (emotion.success)
            {
                return res.json({
                    code: 200,
                    message: "Update Emotion success",
                    emotion: emotion.data
                })
            }
            else {
                return res.json({
                    code: 500,
                    message: "Update Emotion failed",
                })
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
        const existedEmotion = await Emotion.findById(id);
        console.log(existedEmotion);
        if (existedEmotion.length == 0) {
            return res
                .json({
                    code: 204,
                    message: "Not found Emotion",
                })
                .status(204);
        }
        const emotion = await Emotion.deleteById(id);
        if (emotion)
        {
            return res.json({
                code: 200,
                message: "Delete Emotion success",
            })
        }
        else {
            return res.json({
                code: 500,
                message: "Delete Emotion failed",
            })
        }
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: error.message,
        });
    }
};
