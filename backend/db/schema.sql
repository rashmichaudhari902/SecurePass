-- ============================================================
--  SecurePass — MySQL Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS securepass;
USE securepass;

-- 1. users
CREATE TABLE IF NOT EXISTS users (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    username      VARCHAR(64)  NOT NULL UNIQUE,
    master_hash   CHAR(64)     NOT NULL,
    created_at    DATETIME     DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username)
);

-- 2. rules
CREATE TABLE IF NOT EXISTS rules (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    user_id        INT          NOT NULL,
    rule_name      VARCHAR(64)  NOT NULL,
    min_length     INT          NOT NULL DEFAULT 12,
    max_length     INT          NOT NULL DEFAULT 32,
    use_uppercase  TINYINT(1)   NOT NULL DEFAULT 1,
    use_lowercase  TINYINT(1)   NOT NULL DEFAULT 1,
    use_digits     TINYINT(1)   NOT NULL DEFAULT 1,
    use_symbols    TINYINT(1)   NOT NULL DEFAULT 1,
    exclude_chars  VARCHAR(64)  DEFAULT '',
    created_at     DATETIME     DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_rules_user (user_id)
);

-- 3. passwords
CREATE TABLE IF NOT EXISTS passwords (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    user_id      INT          NOT NULL,
    site         VARCHAR(128) NOT NULL,
    password     VARCHAR(256) NOT NULL,
    rule_id      INT,
    created_at   DATETIME     DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME     DEFAULT CURRENT_TIMESTAMP
                              ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (rule_id) REFERENCES rules(id)  ON DELETE SET NULL,
    UNIQUE KEY uq_user_site (user_id, site),
    INDEX idx_pwd_user (user_id)
);

-- 4. password_history
CREATE TABLE IF NOT EXISTS password_history (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    user_id      INT          NOT NULL,
    site         VARCHAR(128) NOT NULL,
    password     VARCHAR(256) NOT NULL,
    generated_at DATETIME     DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_hist_user_site (user_id, site),
    INDEX idx_hist_time      (generated_at)
);

-- TRIGGER — auto log on insert
DELIMITER $$
CREATE TRIGGER trg_pwd_insert
AFTER INSERT ON passwords
FOR EACH ROW
BEGIN
    INSERT INTO password_history (user_id, site, password, generated_at)
    VALUES (NEW.user_id, NEW.site, NEW.password, NOW());
END$$

-- TRIGGER — auto log on update
CREATE TRIGGER trg_pwd_update
AFTER UPDATE ON passwords
FOR EACH ROW
BEGIN
    IF NEW.password <> OLD.password THEN
        INSERT INTO password_history (user_id, site, password, generated_at)
        VALUES (NEW.user_id, NEW.site, NEW.password, NOW());
    END IF;
END$$
DELIMITER ;
-- CREATE DATABASE IF NOT EXISTS securepass;
-- USE securepass;