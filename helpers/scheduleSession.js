const schedule = require('node-schedule');
const Session = require('../models/session.model');

const scheduleSessionExpiry = (sessionId, expiresAt) => {
    const job = schedule.scheduleJob(new Date(expiresAt), async () => {
        try {
            const session = await Session.findById(sessionId);
            console.log(session);
            
            // Kiểm tra xem session đã hết hạn chưa
            if (session.expired) {
                console.log(`Session ${sessionId} is already expired.`);
                job.cancel(); // Hủy job nếu session đã hết hạn
                return;
            }
            // Cập nhật session thành đã hết hạn
            await Session.setExpire(sessionId, {expired: 1});
            console.log(`Session ${sessionId} expired`);

        } catch (error) {
            console.error(`Error expiring session ${sessionId}:`, error);
        }
    });

    console.log(`Scheduled expiration for session ${sessionId} at ${expiresAt}`);
    return job;
};

module.exports = {
    scheduleSessionExpiry
};
