-- Run this script in PhpMyAdmin on your Hostinger account

CREATE TABLE IF NOT EXISTS `admin` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `jobs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `company` VARCHAR(255) NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `salary` VARCHAR(100) NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `posted_time` VARCHAR(50) NOT NULL,
  `description` TEXT NOT NULL,
  `requirements` JSON NOT NULL,
  `benefits` JSON NOT NULL,
  `featured` BOOLEAN DEFAULT FALSE,
  `status` ENUM('active', 'inactive', 'filled') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `applications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `job_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `experience` VARCHAR(50) NOT NULL,
  `status` ENUM('pending', 'reviewed', 'rejected', 'hired') DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `enquiries` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `message` TEXT NOT NULL,
  `type` ENUM('HIRING', 'JOB_SEEKER', 'GENERAL') DEFAULT 'GENERAL',
  `status` ENUM('new', 'contacted', 'resolved') DEFAULT 'new',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance (`database-design`)
CREATE INDEX idx_jobs_location ON jobs(location);
CREATE INDEX idx_jobs_type ON jobs(type);
CREATE INDEX idx_jobs_status ON jobs(status);

-- Insert highly secure default admin (Password is 'admin123' hashed with bcrypt)
-- IMPORTANT: Change this immediately upon deploying!
INSERT INTO `admin` (`username`, `password`) VALUES ('admin', '$2b$10$EPbF8Xj5wONP3t7B7d.hD.1Qn9e5VMBuB7lD9/BfA2l/.WnZp/t72') ON DUPLICATE KEY UPDATE username='admin';
