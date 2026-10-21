CREATE TABLE forms (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    slug TEXT UNIQUE,
    status TEXT NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'published')),
    created_at TEXT NOT NULL
        DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL
        DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE pages (
    id INTEGER PRIMARY KEY,
    form_id INTEGER NOT NULL,
    title TEXT,
    description TEXT,
    position INTEGER NOT NULL DEFAULT 0 CHECK (position >= 0),
    FOREIGN KEY (form_id) REFERENCES forms(id) ON DELETE CASCADE,
    UNIQUE (form_id, position)
);

CREATE TABLE fields (
    id INTEGER PRIMARY KEY,
    page_id INTEGER NOT NULL,
    type TEXT NOT NULL CHECK (
        type IN (
            'text',
            'textarea',
            'email',
            'number',
            'radio',
            'checkbox',
            'select'
        )
    ),
    label TEXT NOT NULL,
    description TEXT,
    required INTEGER NOT NULL DEFAULT 0 CHECK (required IN (0, 1)),
    position INTEGER NOT NULL DEFAULT 0 CHECK (position >= 0),
    config TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(config)),
    FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE,
    UNIQUE (page_id, position)
);

CREATE TABLE submissions (
    id INTEGER PRIMARY KEY,
    form_id INTEGER NOT NULL,
    created_at TEXT NOT NULL
        DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    FOREIGN KEY (form_id) REFERENCES forms(id) ON DELETE CASCADE
);

CREATE TABLE answers (
    id INTEGER PRIMARY KEY,
    submission_id INTEGER NOT NULL,
    field_id INTEGER NOT NULL,
    value TEXT NOT NULL CHECK (json_valid(value)),
    FOREIGN KEY (submission_id)
        REFERENCES submissions(id) ON DELETE CASCADE,
    FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE RESTRICT,
    UNIQUE (submission_id, field_id)
);

CREATE INDEX idx_pages_form_id ON pages(form_id);
CREATE INDEX idx_fields_page_id ON fields(page_id);
CREATE INDEX idx_submissions_form_id ON submissions(form_id);
CREATE INDEX idx_answers_submission_id ON answers(submission_id);
CREATE INDEX idx_answers_field_id ON answers(field_id);
