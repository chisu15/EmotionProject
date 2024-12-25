CREATE TABLE Users (
    id INT PRIMARY KEY IDENTITY(1,1),
    username NVARCHAR(50) NOT NULL,
    password_hash NVARCHAR(255) NOT NULL,
    email NVARCHAR(100),
    created_at DATETIME DEFAULT GETDATE(),
);
CREATE TABLE Emotions (
    id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(50) NOT NULL,
    description NVARCHAR(255)
);

CREATE TABLE Diaries (
    id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL, -- Tham chiếu đến người dùng
    emotion_id INT NOT NULL, -- Tham chiếu đến cảm xúc
    content NVARCHAR(MAX) NOT NULL, -- Nội dung nhật ký
    created_at DATETIME DEFAULT GETDATE(), -- Thời gian tạo
    updated_at DATETIME, -- Thời gian chỉnh sửa
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (emotion_id) REFERENCES Emotions(id)
);
CREATE TABLE Reminders (
    id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL, -- Tham chiếu đến người dùng
    reminder_time TIME NOT NULL, -- Giờ nhắc nhở hàng ngày
    is_active BIT DEFAULT 1, -- Trạng thái nhắc nhở (bật/tắt)
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);
CREATE TABLE Suggestions (
    id INT PRIMARY KEY IDENTITY(1,1),
    emotion_id INT NOT NULL, -- Liên kết với cảm xúc để đưa ra gợi ý phù hợp
    suggestion_text NVARCHAR(MAX) NOT NULL, -- Nội dung gợi ý
    FOREIGN KEY (emotion_id) REFERENCES Emotions(id)
);
CREATE TABLE Session (
    id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
	expire_at time(7),
	expired BIT DEFAULT 1,
    session_id NVARCHAR(255)
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);
