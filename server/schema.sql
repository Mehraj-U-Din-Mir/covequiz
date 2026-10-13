-- =============================================================================
-- COVEQUIZ / MATHQUEST CLASSROOM - SUPABASE / POSTGRESQL AUTHORITATIVE SCHEMA
-- Aligned with NEP 2020 & NCF-SE 2023 Framework
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Curriculum Skills & Competencies
CREATE TABLE IF NOT EXISTS curriculum_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(64) UNIQUE NOT NULL, -- e.g., 'NEP-L1-NUM-01'
    level SMALLINT NOT NULL CHECK (level BETWEEN 1 AND 8),
    domain VARCHAR(64) NOT NULL,
    developmental_stage VARCHAR(64) NOT NULL,
    standard_reference VARCHAR(128) NOT NULL,
    learning_outcome TEXT NOT NULL,
    observable_behavior TEXT NOT NULL,
    cognitive_demand VARCHAR(64) NOT NULL,
    calculation_skills TEXT[] DEFAULT '{}',
    reasoning_skills TEXT[] DEFAULT '{}',
    classroom_application TEXT,
    remedial_strategy TEXT,
    extension_activity TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_curriculum_level ON curriculum_skills(level);
CREATE INDEX IF NOT EXISTS idx_curriculum_domain ON curriculum_skills(domain);

-- 2. Published Games Registry (160 Games across Levels 1 to 8)
CREATE TABLE IF NOT EXISTS games (
    id VARCHAR(64) PRIMARY KEY, -- e.g., 'l1_g01'
    level SMALLINT NOT NULL CHECK (level BETWEEN 1 AND 8),
    title VARCHAR(128) NOT NULL,
    domain VARCHAR(64) NOT NULL,
    stage VARCHAR(64) NOT NULL,
    cognitive_level VARCHAR(64) NOT NULL,
    mechanic VARCHAR(64) NOT NULL,
    learning_objective TEXT NOT NULL,
    rules TEXT NOT NULL,
    tutorial_tip TEXT,
    nep_competency_code VARCHAR(64) REFERENCES curriculum_skills(code) ON DELETE SET NULL,
    rounds_per_session SMALLINT DEFAULT 5,
    tags TEXT[] DEFAULT '{}',
    prerequisites TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_games_level ON games(level);

-- 3. Game Versions (for immutable scoring & auditability)
CREATE TABLE IF NOT EXISTS game_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id VARCHAR(64) REFERENCES games(id) ON DELETE CASCADE,
    version_number VARCHAR(16) NOT NULL,
    engine_parameters JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Classroom Sessions (Facilitator / Teacher Led)
CREATE TABLE IF NOT EXISTS classroom_sessions (
    code VARCHAR(16) PRIMARY KEY, -- e.g., 'CQ-7291'
    teacher_id VARCHAR(64) NOT NULL,
    title VARCHAR(128) NOT NULL,
    level SMALLINT NOT NULL CHECK (level BETWEEN 1 AND 8),
    game_id VARCHAR(64) REFERENCES games(id) ON DELETE SET NULL,
    mode VARCHAR(32) NOT NULL DEFAULT 'competitive' CHECK (mode IN ('individual', 'cooperative', 'competitive')),
    status VARCHAR(32) NOT NULL DEFAULT 'lobby' CHECK (status IN ('lobby', 'active', 'paused', 'completed')),
    duration_minutes INT DEFAULT 10,
    current_round SMALLINT DEFAULT 1,
    max_rounds SMALLINT DEFAULT 5,
    allow_hints BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '12 hours')
);

CREATE INDEX IF NOT EXISTS idx_sessions_status ON classroom_sessions(status);

-- 5. Teams within Classroom Sessions
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_code VARCHAR(16) REFERENCES classroom_sessions(code) ON DELETE CASCADE,
    name VARCHAR(64) NOT NULL,
    color VARCHAR(16) NOT NULL,
    total_score INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Session Participants (No password / registration required for students)
CREATE TABLE IF NOT EXISTS session_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_code VARCHAR(16) REFERENCES classroom_sessions(code) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    player_id VARCHAR(64) NOT NULL,
    nickname VARCHAR(64) NOT NULL,
    avatar VARCHAR(32) NOT NULL,
    score INT DEFAULT 0,
    accuracy_percent NUMERIC(5, 2) DEFAULT 0.00,
    is_online BOOLEAN DEFAULT TRUE,
    joined_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_participants_session ON session_participants(session_code);

-- 7. Authoritative Answer Submissions & Anti-Cheat Log
CREATE TABLE IF NOT EXISTS answer_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_code VARCHAR(16) REFERENCES classroom_sessions(code) ON DELETE CASCADE,
    player_id VARCHAR(64) NOT NULL,
    game_id VARCHAR(64) REFERENCES games(id) ON DELETE CASCADE,
    round_number SMALLINT NOT NULL,
    submitted_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    points_awarded INT DEFAULT 0,
    hints_used_count SMALLINT DEFAULT 0,
    response_time_ms INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_answers_session ON answer_submissions(session_code);

-- 8. Anonymous Aggregate Skill Mastery
CREATE TABLE IF NOT EXISTS skill_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    level SMALLINT NOT NULL,
    domain VARCHAR(64) NOT NULL,
    skill_code VARCHAR(64) REFERENCES curriculum_skills(code) ON DELETE CASCADE,
    is_correct BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Classroom Session Summaries for Teachers (Exportable & Privacy-Safe)
CREATE TABLE IF NOT EXISTS session_summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_code VARCHAR(16) NOT NULL,
    title VARCHAR(128) NOT NULL,
    level SMALLINT NOT NULL,
    total_students INT DEFAULT 0,
    total_problems_solved INT DEFAULT 0,
    class_accuracy_percent NUMERIC(5, 2) DEFAULT 0.00,
    frequent_errors JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Student Badges & Achievements (Calculation Champion, Master Mind, Math Legend)
CREATE TABLE IF NOT EXISTS student_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id VARCHAR(64) NOT NULL,
    badge_id VARCHAR(64) NOT NULL,
    badge_name VARCHAR(128) NOT NULL,
    game_id VARCHAR(64) NOT NULL,
    accuracy_percent NUMERIC(5, 2) NOT NULL,
    event_hash VARCHAR(128) UNIQUE NOT NULL,
    earned_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_badges_student ON student_badges(student_id);

-- Row Level Security Configuration
ALTER TABLE classroom_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answer_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_summaries ENABLE ROW LEVEL SECURITY;

-- Read policy for classroom codes
CREATE POLICY "Public read for sessions by code" ON classroom_sessions
    FOR SELECT USING (true);

-- Maintenance: Automatic retention cleanup of expired sessions (> 24 hours)
CREATE OR REPLACE FUNCTION purge_expired_sessions() RETURNS void AS $$
BEGIN
    DELETE FROM classroom_sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;
