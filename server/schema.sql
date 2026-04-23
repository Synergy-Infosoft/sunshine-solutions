-- Sunshine Solutions – Multi-Site Hiring Schema
-- Run this script in PhpMyAdmin (drop old tables first if migrating)

-- Admin table (unchanged)
CREATE TABLE IF NOT EXISTS `admin` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Jobs table = Parent "Site Listing"
-- One row = One Company + Location combo
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `company` VARCHAR(255) NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `contact_number` VARCHAR(20) DEFAULT '+919828377776',
  `whatsapp_number` VARCHAR(20) DEFAULT '919828377776',
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Job Roles = Child positions under a parent job site
CREATE TABLE IF NOT EXISTS `job_roles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `job_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `type` ENUM('Helper', 'ITI', 'Skilled') DEFAULT 'Helper',
  `salary_min` INT NOT NULL DEFAULT 10000,
  `salary_max` INT NOT NULL DEFAULT 15000,
  `openings` INT NOT NULL DEFAULT 5,
  `shift` ENUM('Day', 'Night', 'Rotational') DEFAULT 'Day',
  `description` TEXT,
  `requirements` JSON,
  `benefits` JSON,
  `urgent_hiring` BOOLEAN DEFAULT FALSE,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`) ON DELETE CASCADE
);

-- Applications now reference a specific role
CREATE TABLE IF NOT EXISTS `applications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `role_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `experience` VARCHAR(100) DEFAULT 'Not specified',
  `location` VARCHAR(100) DEFAULT 'Not specified',
  `status` ENUM('New', 'Called', 'Selected', 'Rejected') DEFAULT 'New',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`role_id`) REFERENCES `job_roles`(`id`) ON DELETE CASCADE
);

-- Enquiries (unchanged)
CREATE TABLE IF NOT EXISTS `enquiries` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `message` TEXT NOT NULL,
  `type` ENUM('HIRING', 'JOB_SEEKER', 'GENERAL') DEFAULT 'GENERAL',
  `status` ENUM('new', 'contacted', 'resolved') DEFAULT 'new',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Performance indexes
CREATE INDEX idx_jobs_location ON jobs(location);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_roles_job_id ON job_roles(job_id);
CREATE INDEX idx_roles_type ON job_roles(type);
CREATE INDEX idx_roles_status ON job_roles(status);
CREATE INDEX idx_applications_role_id ON applications(role_id);
CREATE INDEX idx_applications_status ON applications(status);

-- Default admin (Password is 'admin123' hashed with bcrypt)
-- IMPORTANT: Change this immediately upon deploying!
INSERT INTO `admin` (`username`, `password`) VALUES ('admin', '$2b$10$3egU3Lv4r2HKtSqGHsVUm.SBghvM65W/yZkmSgcwK0oJ8huUE0cWG') ON DUPLICATE KEY UPDATE username='admin';
