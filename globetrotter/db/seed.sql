-- =============================================================================
-- GlobeTrotter — seed/dummy data (live schema verified from Postgres)
-- This script matches the current live database shape:
--   - users uses full_name, not display_name
--   - users has is_active, not email_verified
--   - there is no otp_codes table in the live DB, so no rows are inserted there
--   - all seeded users are active and ready for immediate login in the app
--
-- Dependency order is preserved exactly:
-- countries → cities → categories → users → user_preferences → trips →
-- trip_shares → trip_stops → trip_days → activities → itinerary_items →
-- expenses → saved_cities
-- =============================================================================

BEGIN;

-- ----- countries ------------------------------------------------------------
INSERT INTO countries (name, iso_code) VALUES
    ('France',        'FR'),
    ('Japan',         'JP'),
    ('United States', 'US'),
    ('Italy',         'IT'),
    ('Spain',         'ES');

-- ----- cities ---------------------------------------------------------------
INSERT INTO cities (country_id, name, cost_index, popularity) VALUES
    ((SELECT country_id FROM countries WHERE name = 'France'),        'Paris',         1.30, 95),
    ((SELECT country_id FROM countries WHERE name = 'France'),        'Lyon',          1.05, 55),
    ((SELECT country_id FROM countries WHERE name = 'France'),        'Nice',          1.20, 62),
    ((SELECT country_id FROM countries WHERE name = 'Japan'),         'Tokyo',         1.25, 98),
    ((SELECT country_id FROM countries WHERE name = 'Japan'),         'Kyoto',         1.15, 88),
    ((SELECT country_id FROM countries WHERE name = 'Japan'),         'Osaka',         1.10, 72),
    ((SELECT country_id FROM countries WHERE name = 'United States'), 'New York',      1.45, 99),
    ((SELECT country_id FROM countries WHERE name = 'United States'), 'San Francisco', 1.50, 90),
    ((SELECT country_id FROM countries WHERE name = 'United States'), 'Austin',        1.10, 60),
    ((SELECT country_id FROM countries WHERE name = 'Italy'),         'Rome',          1.20, 93),
    ((SELECT country_id FROM countries WHERE name = 'Italy'),         'Florence',      1.10, 80),
    ((SELECT country_id FROM countries WHERE name = 'Italy'),         'Venice',        1.25, 85),
    ((SELECT country_id FROM countries WHERE name = 'Spain'),         'Barcelona',     1.15, 87),
    ((SELECT country_id FROM countries WHERE name = 'Spain'),         'Madrid',        1.10, 75),
    ((SELECT country_id FROM countries WHERE name = 'Spain'),         'Seville',       0.95, 65);

-- ----- categories -----------------------------------------------------------
INSERT INTO categories (name, type) VALUES
    ('Sightseeing', 'activity'),
    ('Museum',      'activity'),
    ('Food',        'activity'),
    ('Outdoor',     'activity'),
    ('Nightlife',   'activity'),
    ('Cultural',    'activity'),
    ('Shopping',    'activity'),
    ('Lodging',     'expense'),
    ('Transit',     'expense'),
    ('Activities',  'expense'),
    ('Flights',     'expense'),
    ('Misc',        'expense');

-- ----- users ----------------------------------------------------------------
-- The live schema has no email_verified column; all seeded users are active via is_active=true.
INSERT INTO users (email, full_name, password_hash, profile_image_url, public_slug, is_active) VALUES
    ('yasha@example.com',  'Yasha Patel',    '!seed!', NULL, 'yasha-patel', true),
    ('mira@example.com',   'Mira Chen',      '!seed!', NULL, 'mira-chen',  true),
    ('leo@example.com',    'Leo Rossi',      '!seed!', NULL, 'leo-rossi',  true),
    ('sana@example.com',   'Sana Iqbal',     '!seed!', NULL, 'sana-iqbal', true),
    ('kenji@example.com',  'Kenji Watanabe', '!seed!', NULL, 'kenji-watanabe', true);

-- ----- user_preferences -----------------------------------------------------
INSERT INTO user_preferences (user_id, theme, default_currency, default_trip_visibility, notification_opt_in) VALUES
    ((SELECT user_id FROM users WHERE email = 'yasha@example.com'), 'system', 'USD', 'private', true),
    ((SELECT user_id FROM users WHERE email = 'mira@example.com'),  'dark',   'EUR', 'shared',  true),
    ((SELECT user_id FROM users WHERE email = 'leo@example.com'),   'light',  'EUR', 'public',  false),
    ((SELECT user_id FROM users WHERE email = 'sana@example.com'),  'system', 'USD', 'private', true),
    ((SELECT user_id FROM users WHERE email = 'kenji@example.com'), 'system', 'JPY', 'private', true);

-- ----- trips ----------------------------------------------------------------
INSERT INTO trips (owner_id, name, description, start_date, end_date, is_public, public_slug) VALUES
    ((SELECT user_id FROM users WHERE email = 'yasha@example.com'),
     'Japan Spring 2026', 'Cherry blossom season, Tokyo -> Kyoto -> Osaka',
     '2026-03-28', '2026-04-09', true, 'japan-spring-2026-yasha'),

    ((SELECT user_id FROM users WHERE email = 'leo@example.com'),
     'Italian Summer', 'A long food-and-art crawl through Rome, Florence, Venice',
     '2026-06-12', '2026-06-25', false, NULL),

    ((SELECT user_id FROM users WHERE email = 'mira@example.com'),
     'Iberian Loop', 'Barcelona -> Madrid -> Seville, tapas tour',
     '2026-09-04', '2026-09-14', true, 'iberian-loop-mira'),

    ((SELECT user_id FROM users WHERE email = 'sana@example.com'),
     'US West Swing', 'NYC -> San Francisco -> Austin',
     '2026-10-10', '2026-10-22', false, NULL);

-- ----- trip_shares ----------------------------------------------------------
INSERT INTO trip_shares (trip_id, user_id, role) VALUES
    ((SELECT trip_id FROM trips WHERE name = 'Japan Spring 2026' AND owner_id = (SELECT user_id FROM users WHERE email = 'yasha@example.com')),
     (SELECT user_id FROM users WHERE email = 'mira@example.com'),
     'editor'),
    ((SELECT trip_id FROM trips WHERE name = 'Italian Summer' AND owner_id = (SELECT user_id FROM users WHERE email = 'leo@example.com')),
     (SELECT user_id FROM users WHERE email = 'mira@example.com'),
     'viewer');

-- ----- trip_stops -----------------------------------------------------------
INSERT INTO trip_stops (trip_id, city_id, start_date, end_date, seq) VALUES
    ((SELECT trip_id FROM trips WHERE name = 'Japan Spring 2026'),
     (SELECT city_id FROM cities WHERE name = 'Tokyo'),
     '2026-03-28', '2026-04-01', 0),
    ((SELECT trip_id FROM trips WHERE name = 'Japan Spring 2026'),
     (SELECT city_id FROM cities WHERE name = 'Kyoto'),
     '2026-04-01', '2026-04-06', 1),
    ((SELECT trip_id FROM trips WHERE name = 'Japan Spring 2026'),
     (SELECT city_id FROM cities WHERE name = 'Osaka'),
     '2026-04-06', '2026-04-09', 2),

    ((SELECT trip_id FROM trips WHERE name = 'Italian Summer'),
     (SELECT city_id FROM cities WHERE name = 'Rome'),
     '2026-06-12', '2026-06-16', 0),
    ((SELECT trip_id FROM trips WHERE name = 'Italian Summer'),
     (SELECT city_id FROM cities WHERE name = 'Florence'),
     '2026-06-16', '2026-06-20', 1),
    ((SELECT trip_id FROM trips WHERE name = 'Italian Summer'),
     (SELECT city_id FROM cities WHERE name = 'Venice'),
     '2026-06-20', '2026-06-25', 2),

    ((SELECT trip_id FROM trips WHERE name = 'Iberian Loop'),
     (SELECT city_id FROM cities WHERE name = 'Barcelona'),
     '2026-09-04', '2026-09-08', 0),
    ((SELECT trip_id FROM trips WHERE name = 'Iberian Loop'),
     (SELECT city_id FROM cities WHERE name = 'Madrid'),
     '2026-09-08', '2026-09-11', 1),
    ((SELECT trip_id FROM trips WHERE name = 'Iberian Loop'),
     (SELECT city_id FROM cities WHERE name = 'Seville'),
     '2026-09-11', '2026-09-14', 2),

    ((SELECT trip_id FROM trips WHERE name = 'US West Swing'),
     (SELECT city_id FROM cities WHERE name = 'New York'),
     '2026-10-10', '2026-10-15', 0),
    ((SELECT trip_id FROM trips WHERE name = 'US West Swing'),
     (SELECT city_id FROM cities WHERE name = 'San Francisco'),
     '2026-10-15', '2026-10-19', 1),
    ((SELECT trip_id FROM trips WHERE name = 'US West Swing'),
     (SELECT city_id FROM cities WHERE name = 'Austin'),
     '2026-10-19', '2026-10-22', 2);

-- ----- trip_days ------------------------------------------------------------
INSERT INTO trip_days (trip_stop_id, trip_id, date, day_index)
SELECT ts.trip_stop_id,
       ts.trip_id,
       d::date,
       (d::date - ts.start_date)::int
FROM trip_stops ts
JOIN trips t ON t.trip_id = ts.trip_id
CROSS JOIN LATERAL generate_series(ts.start_date, ts.end_date - INTERVAL '1 day', INTERVAL '1 day') AS d
WHERE t.name IN ('Japan Spring 2026', 'Italian Summer', 'Iberian Loop', 'US West Swing');

-- ----- activities -----------------------------------------------------------
INSERT INTO activities (city_id, category_id, name, cost, duration_mins) VALUES
    ((SELECT city_id FROM cities WHERE name = 'Tokyo'),
     (SELECT category_id FROM categories WHERE name = 'Sightseeing' AND type = 'activity'),
     'Shibuya Crossing & Sky view', 0.00, 90),
    ((SELECT city_id FROM cities WHERE name = 'Tokyo'),
     (SELECT category_id FROM categories WHERE name = 'Museum' AND type = 'activity'),
     'teamLab Planets', 32.00, 120),
    ((SELECT city_id FROM cities WHERE name = 'Tokyo'),
     (SELECT category_id FROM categories WHERE name = 'Food' AND type = 'activity'),
     'Tsukiji outer-market walk', 40.00, 180),

    ((SELECT city_id FROM cities WHERE name = 'Kyoto'),
     (SELECT category_id FROM categories WHERE name = 'Cultural' AND type = 'activity'),
     'Fushimi Inari hike', 0.00, 180),
    ((SELECT city_id FROM cities WHERE name = 'Kyoto'),
     (SELECT category_id FROM categories WHERE name = 'Cultural' AND type = 'activity'),
     'Tea ceremony in Gion', 55.00, 60),
    ((SELECT city_id FROM cities WHERE name = 'Kyoto'),
     (SELECT category_id FROM categories WHERE name = 'Outdoor' AND type = 'activity'),
     'Arashiyama bamboo grove', 0.00, 90),

    ((SELECT city_id FROM cities WHERE name = 'Osaka'),
     (SELECT category_id FROM categories WHERE name = 'Food' AND type = 'activity'),
     'Dotonbori street-food crawl', 60.00, 150),

    ((SELECT city_id FROM cities WHERE name = 'Rome'),
     (SELECT category_id FROM categories WHERE name = 'Sightseeing' AND type = 'activity'),
     'Colosseum & Forum guided tour', 45.00, 180),
    ((SELECT city_id FROM cities WHERE name = 'Rome'),
     (SELECT category_id FROM categories WHERE name = 'Museum' AND type = 'activity'),
     'Vatican Museums + Sistine Chapel', 55.00, 240),

    ((SELECT city_id FROM cities WHERE name = 'Florence'),
     (SELECT category_id FROM categories WHERE name = 'Cultural' AND type = 'activity'),
     'Uffizi Gallery skip-the-line', 65.00, 120),
    ((SELECT city_id FROM cities WHERE name = 'Florence'),
     (SELECT category_id FROM categories WHERE name = 'Food' AND type = 'activity'),
     'Tuscan cooking class', 120.00, 240),

    ((SELECT city_id FROM cities WHERE name = 'Venice'),
     (SELECT category_id FROM categories WHERE name = 'Sightseeing' AND type = 'activity'),
     'Gondola ride', 80.00, 40),

    ((SELECT city_id FROM cities WHERE name = 'Barcelona'),
     (SELECT category_id FROM categories WHERE name = 'Sightseeing' AND type = 'activity'),
     'Sagrada Familia entry', 35.00, 90),
    ((SELECT city_id FROM cities WHERE name = 'Barcelona'),
     (SELECT category_id FROM categories WHERE name = 'Outdoor' AND type = 'activity'),
     'Park Güell morning walk', 10.00, 120),

    ((SELECT city_id FROM cities WHERE name = 'Madrid'),
     (SELECT category_id FROM categories WHERE name = 'Museum' AND type = 'activity'),
     'Prado Museum highlights', 18.00, 120),

    ((SELECT city_id FROM cities WHERE name = 'Seville'),
     (SELECT category_id FROM categories WHERE name = 'Cultural' AND type = 'activity'),
     'Flamenco show in Triana', 45.00, 90),

    ((SELECT city_id FROM cities WHERE name = 'New York'),
     (SELECT category_id FROM categories WHERE name = 'Sightseeing' AND type = 'activity'),
     'Top of the Rock', 40.00, 60),
    ((SELECT city_id FROM cities WHERE name = 'New York'),
     (SELECT category_id FROM categories WHERE name = 'Nightlife' AND type = 'activity'),
     'Brooklyn rooftop bar night', 0.00, 180),

    ((SELECT city_id FROM cities WHERE name = 'San Francisco'),
     (SELECT category_id FROM categories WHERE name = 'Outdoor' AND type = 'activity'),
     'Bike the Golden Gate', 45.00, 180),

    ((SELECT city_id FROM cities WHERE name = 'Austin'),
     (SELECT category_id FROM categories WHERE name = 'Food' AND type = 'activity'),
     'BBQ joint tour', 70.00, 240);

-- ----- itinerary_items ------------------------------------------------------
WITH ranked AS (
    SELECT td.trip_day_id,
           a.activity_id,
           ROW_NUMBER() OVER (PARTITION BY td.trip_day_id ORDER BY a.activity_id) AS rn
    FROM trip_days td
    JOIN trip_stops ts ON ts.trip_stop_id = td.trip_stop_id
    JOIN activities a ON a.city_id = ts.city_id
)
INSERT INTO itinerary_items (trip_day_id, activity_id, scheduled_time, quantity, override_cost, note)
SELECT trip_day_id,
       activity_id,
       (TIME '09:30' + ((rn - 1) * INTERVAL '2 hours')),
       1,
       NULL,
       NULL
FROM ranked
WHERE rn <= 3;

-- ----- expenses -------------------------------------------------------------
INSERT INTO expenses (trip_id, paid_by, category_id, description, amount, currency, expense_date) VALUES
    ((SELECT trip_id FROM trips WHERE name = 'Japan Spring 2026'),
     (SELECT user_id FROM users WHERE email = 'yasha@example.com'),
     (SELECT category_id FROM categories WHERE name = 'Flights' AND type = 'expense'),
     'Round-trip SFO -> HND', 185000.00, 'JPY', '2026-03-27'),

    ((SELECT trip_id FROM trips WHERE name = 'Japan Spring 2026'),
     (SELECT user_id FROM users WHERE email = 'yasha@example.com'),
     (SELECT category_id FROM categories WHERE name = 'Lodging' AND type = 'expense'),
     'Tokyo hotel (4 nights)', 64000.00, 'JPY', '2026-03-28'),

    ((SELECT trip_id FROM trips WHERE name = 'Japan Spring 2026'),
     (SELECT user_id FROM users WHERE email = 'yasha@example.com'),
     (SELECT category_id FROM categories WHERE name = 'Lodging' AND type = 'expense'),
     'Kyoto ryokan (5 nights)', 95000.00, 'JPY', '2026-04-01'),

    ((SELECT trip_id FROM trips WHERE name = 'Japan Spring 2026'),
     (SELECT user_id FROM users WHERE email = 'yasha@example.com'),
     (SELECT category_id FROM categories WHERE name = 'Misc' AND type = 'expense'),
     'Group dinner in Osaka', 18000.00, 'JPY', '2026-04-07'),

    ((SELECT trip_id FROM trips WHERE name = 'Italian Summer'),
     (SELECT user_id FROM users WHERE email = 'leo@example.com'),
     (SELECT category_id FROM categories WHERE name = 'Flights' AND type = 'expense'),
     'Round-trip JFK -> FCO', 720.00, 'EUR', '2026-06-11'),

    ((SELECT trip_id FROM trips WHERE name = 'Italian Summer'),
     (SELECT user_id FROM users WHERE email = 'leo@example.com'),
     (SELECT category_id FROM categories WHERE name = 'Lodging' AND type = 'expense'),
     'Rome Airbnb (4 nights)', 480.00, 'EUR', '2026-06-12'),

    ((SELECT trip_id FROM trips WHERE name = 'Italian Summer'),
     (SELECT user_id FROM users WHERE email = 'leo@example.com'),
     (SELECT category_id FROM categories WHERE name = 'Activities' AND type = 'expense'),
     'Colosseum + Vatican tickets', 100.00, 'EUR', '2026-06-13'),

    ((SELECT trip_id FROM trips WHERE name = 'Iberian Loop'),
     (SELECT user_id FROM users WHERE email = 'mira@example.com'),
     (SELECT category_id FROM categories WHERE name = 'Transit' AND type = 'expense'),
     'AVE Madrid -> Seville', 85.00, 'EUR', '2026-09-11'),

    ((SELECT trip_id FROM trips WHERE name = 'Iberian Loop'),
     (SELECT user_id FROM users WHERE email = 'mira@example.com'),
     (SELECT category_id FROM categories WHERE name = 'Misc' AND type = 'expense'),
     'Tapas crawl, Barcelona', 62.00, 'EUR', '2026-09-05'),

    ((SELECT trip_id FROM trips WHERE name = 'US West Swing'),
     (SELECT user_id FROM users WHERE email = 'sana@example.com'),
     (SELECT category_id FROM categories WHERE name = 'Flights' AND type = 'expense'),
     'JFK -> SFO', 310.00, 'USD', '2026-10-15'),

    ((SELECT trip_id FROM trips WHERE name = 'US West Swing'),
     (SELECT user_id FROM users WHERE email = 'sana@example.com'),
     (SELECT category_id FROM categories WHERE name = 'Lodging' AND type = 'expense'),
     'SF hotel (4 nights)', 920.00, 'USD', '2026-10-15'),

    ((SELECT trip_id FROM trips WHERE name = 'US West Swing'),
     (SELECT user_id FROM users WHERE email = 'sana@example.com'),
     (SELECT category_id FROM categories WHERE name = 'Misc' AND type = 'expense'),
     'Austin boot store', 180.00, 'USD', '2026-10-20');

-- ----- saved_cities ---------------------------------------------------------
INSERT INTO saved_cities (user_id, city_id) VALUES
    ((SELECT user_id FROM users WHERE email = 'yasha@example.com'),
     (SELECT city_id FROM cities WHERE name = 'Tokyo')),
    ((SELECT user_id FROM users WHERE email = 'yasha@example.com'),
     (SELECT city_id FROM cities WHERE name = 'Kyoto')),
    ((SELECT user_id FROM users WHERE email = 'mira@example.com'),
     (SELECT city_id FROM cities WHERE name = 'Barcelona')),
    ((SELECT user_id FROM users WHERE email = 'leo@example.com'),
     (SELECT city_id FROM cities WHERE name = 'Rome')),
    ((SELECT user_id FROM users WHERE email = 'kenji@example.com'),
     (SELECT city_id FROM cities WHERE name = 'New York'));

COMMIT;
