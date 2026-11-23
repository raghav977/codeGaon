-- CodeGaon Phase 2 schema (MySQL 8)
CREATE TABLE schools (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  district VARCHAR(40)
);

CREATE TABLE classes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  school_id INT NOT NULL,
  name VARCHAR(20) NOT NULL,          -- e.g. '10A'
  join_code CHAR(6) NOT NULL UNIQUE,  -- students type this to join
  FOREIGN KEY (school_id) REFERENCES schools(id)
);

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  role ENUM('student', 'teacher') NOT NULL DEFAULT 'student',
  name VARCHAR(60) NOT NULL,
  roll VARCHAR(10),
  class_id INT,
  password_hash VARCHAR(100) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (class_id) REFERENCES classes(id),
  UNIQUE (class_id, roll)
);

-- many-to-many bridge: students <-> topics (yes, the same lesson the app teaches!)
CREATE TABLE topic_progress (
  user_id INT NOT NULL,
  topic_id VARCHAR(40) NOT NULL,      -- matches frontend topic ids, e.g. 'py-indent'
  best_score TINYINT NOT NULL DEFAULT 0,
  attempts INT NOT NULL DEFAULT 0,
  completed_at DATETIME,
  PRIMARY KEY (user_id, topic_id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE xp_log (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  amount INT NOT NULL,
  reason VARCHAR(60),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
