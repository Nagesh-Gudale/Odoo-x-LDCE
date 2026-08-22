-- =============================================================================
-- GlobeTrotter — seed/dummy data (hackathon dev only)
-- Pure INSERTs. Run manually AFTER schema.sql is applied:
--   docker exec -i globetrotter-db psql -U yasha -d globetrotter < db/seed.sql
--
-- Approach: every cross-table reference uses a subquery on a stable natural key
-- (email for users, name for cities/countries/categories, etc.) so we never
-- hardcode SERIAL values. Wrapped in a single transaction so a failed insert
-- rolls everything back.
-- =============================================================================

BEGIN;

-- ----- countries ------------------------------------------------------------
INSERT INTO countries (name, iso_code) VALUES
    ('France',         'FR'),
    ('Japan',          'JP'),
    ('United States',  'US'),
    ('Italy',          'IT'),
    ('Spain',          'ES');

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
-- activity categories
INSERT INTO categories (name, type) VALUES
    ('Sightseeing',     'activity'),
    ('Museum',          'activity'),
    ('Food',            'activity'),
    ('Outdoor',         'activity'),
    ('Nightlife',       'activity'),
    ('Cultural',        'activity'),
    ('Shopping',        'activity');
-- expense categories
INSERT INTO categories (name, type) VALUES
    ('Lodging',         'expense'),
    ('Transit',         'expense'),
    ('Food',            'expense'),       -- "Food" exists in both; UNIQUE(name,type) allows it
    ('Activities',      'expense'),
    ('Shopping',        'expense'),
    ('Flights',         'expense'),
    ('Misc',            'expense');

-- ----- users ----------------------------------------------------------------
-- password_hash is a placeholder; backend will overwrite before real use.
INSERT INTO users (email, display_name, password_hash, public_slug) VALUES
    ('yasha@example.com',   'Yasha Patel',     '!seed!', 'yasha-ptl'),
    ('mira@example.com',    'Mira Chen',       '!seed!', NULL),                -- intentionally NULL
    ('leo@example.com',     'Leo Rossi',       '!seed!', 'leo-rs'),
    ('sana@example.com',    'Sana Iqbal',      '!seed!', 'sana-iq'),
    ('kenji@example.com',   'Kenji Watanabe',  '!seed!', NULL);

-- ----- user_preferences -----------------------------------------------------
INSERT INTO user_preferences (user_id, theme, default_currency, default_trip_visibility, notification_opt_in) VALUES
    ((SELECT user_id FROM users WHERE email = 'yasha@example.com'),  'system', 'USD', 'private', true),
    ((SELECT user_id FROM users WHERE email = 'mira@example.com'),   'dark',   'EUR', 'shared',  true),
    ((SELECT user_id FROM users WHERE email = 'leo@example.com'),    'light',  'EUR', 'public',  false),
    ((SELECT user_id FROM users WHERE email = 'sana@example.com'),   'system', 'USD', 'private', true),
    ((SELECT user_id FROM users WHERE email = 'kenji@example.com'),  'system', 'JPY', 'private', true);

-- ----- trips ----------------------------------------------------------------
INSERT INTO trips (owner_id, name, description, start_date, end_date, is_public, public_slug) VALUES
    ((SELECT user_id FROM users WHERE email = 'yasha@example.com'),
     'Japan Spring 2026', 'Cherry blossom season, Tokyo -> Kyoto -> Osaka',
     '2026-03-28', '2026-04-09', true, 'japan-spring-2026-yasha'),

    ((SELECT user_id FROM users WHERE email = 'leo@example.com'),
     'Italian Summer',    'A long food-and-art crawl through Rome, Florence, Venice',
     '2026-06-12', '2026-06-25', false, NULL),                              -- private trip, no slug

    ((SELECT user_id FROM users WHERE email = 'mira@example.com'),
     'Iberian Loop',      'Barcelona -> Madrid -> Seville, tapas tour',
     '2026-09-04', '2026-09-14', true, 'iberia-loop-mira'),

    ((SELECT user_id FROM users WHERE email = 'sana@example.com'),
     'US West Swing',     'NYC -> San Francisco -> Austin',
     '2026-10-10', '2026-10-22', false, NULL);

-- ----- trip_shares ----------------------------------------------------------
-- Yasha shares the Japan trip with Mira as an editor; Leo shares Italian Summer
-- with Mira as a viewer.
INSERT INTO trip_shares (trip_id, user_id, role) VALUES
    ((SELECT trip_id FROM trips WHERE name = 'Japan Spring 2026' AND owner_id = (SELECT user_id FROM users WHERE email = 'yasha@example.com')),
     (SELECT user_id FROM users WHERE email = 'mira@example.com'),
     'editor'),
    ((SELECT trip_id FROM trips WHERE name = 'Italian Summer' AND owner_id = (SELECT user_id FROM users WHERE email = 'leo@example.com')),
     (SELECT user_id FROM users WHERE email = 'mira@example.com'),
     'viewer');

-- ----- trip_stops -----------------------------------------------------------
INSERT INTO trip_stops (trip_id, city_id, start_date, end_date, seq) VALUES
    -- Japan trip
    ((SELECT trip_id FROM trips WHERE name = 'Japan Spring 2026'),
     (SELECT city_id FROM cities WHERE name = 'Tokyo'),
     '2026-03-28', '2026-04-01', 0),
    ((SELECT trip_id FROM trips WHERE name = 'Japan Spring 2026'),
     (SELECT city_id FROM cities WHERE name = 'Kyoto'),
     '2026-04-01', '2026-04-06', 1),
    ((SELECT trip_id FROM trips WHERE name = 'Japan Spring 2026'),
     (SELECT city_id FROM cities WHERE name = 'Osaka'),
     '2026-04-06', '2026-04-09', 2),

    -- Italian Summer
    ((SELECT trip_id FROM trips WHERE name = 'Italian Summer'),
     (SELECT city_id FROM cities WHERE name = 'Rome'),
     '2026-06-12', '2026-06-16', 0),
    ((SELECT trip_id FROM trips WHERE name = 'Italian Summer'),
     (SELECT city_id FROM cities WHERE name = 'Florence'),
     '2026-06-16', '2026-06-20', 1),
    ((SELECT trip_id FROM trips WHERE name = 'Italian Summer'),
     (SELECT city_id FROM cities WHERE name = 'Venice'),
     '2026-06-20', '2026-06-25', 2),

    -- Iberian Loop
    ((SELECT trip_id FROM trips WHERE name = 'Iberian Loop'),
     (SELECT city_id FROM cities WHERE name = 'Barcelona'),
     '2026-09-04', '2026-09-08', 0),
    ((SELECT trip_id FROM trips WHERE name = 'Iberian Loop'),
     (SELECT city_id FROM cities WHERE name = 'Madrid'),
     '2026-09-08', '2026-09-11', 1),
    ((SELECT trip_id FROM trips WHERE name = 'Iberian Loop'),
     (SELECT city_id FROM cities WHERE name = 'Seville'),
     '2026-09-11', '2026-09-14', 2),

    -- US West Swing (2 stops only to vary shape)
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
-- 2-3 days per stop; dates are contiguous and fall inside the stop's range.
INSERT INTO trip_days (trip_stop_id, trip_id, date, day_index)
SELECT  ts.trip_stop_id, ts.trip_id, d::date, (d::date - ts.start_date)::int
FROM    trip_stops ts
JOIN    trips t ON t.trip_id = ts.trip_id
CROSS JOIN LATERAL generate_series(ts.start_date, ts.end_date - INTERVAL '1 day', INTERVAL '1 day') AS d
WHERE   t.name = 'Japan Spring 2026'        -- 3+5+3 = 11 days
    OR  t.name = 'Italian Summer'           -- 4+4+5 = 13 days
    OR  t.name = 'Iberian Loop'             -- 4+3+3 = 10 days
    OR  t.name = 'US West Swing';           -- 5+4+3 = 12 days

-- ----- activities -----------------------------------------------------------
-- Shared pool scoped per city. Activity.category_id points at the 'activity' set.
INSERT INTO activities (city_id, category_id, name, cost, duration_mins) VALUES
    -- Tokyo
    ((SELECT city_id FROM cities WHERE name = 'Tokyo'),
     (SELECT category_id FROM categories WHERE name = 'Sightseeing' AND type = 'activity'),
     'Shibuya Crossing & Sky view', 0.00, 90),
    ((SELECT city_id FROM cities WHERE name = 'Tokyo'),
     (SELECT category_id FROM categories WHERE name = 'Museum' AND type = 'activity'),
     'teamLab Planets',            32.00, 120),
    ((SELECT city_id FROM cities WHERE name = 'Tokyo'),
     (SELECT category_id FROM categories WHERE name = 'Food' AND type = 'activity'),
     'Tsukiji outer-market walk',  40.00, 180),

    -- Kyoto
    ((SELECT city_id FROM cities WHERE name = 'Kyoto'),
     (SELECT category_id FROM categories WHERE name = 'Cultural' AND type = 'activity'),
     'Fushimi Inari hike',          0.00, 180),
    ((SELECT city_id FROM cities WHERE name = 'Kyoto'),
     (SELECT category_id FROM categories WHERE name = 'Cultural' AND type = 'activity'),
     'Tea ceremony in Gion',        55.00, 60),
    ((SELECT city_id FROM cities WHERE name = 'Kyoto'),
     (SELECT category_id FROM categories WHERE name = 'Outdoor' AND type = 'activity'),
     'Arashiyama bamboo grove',     0.00, 90),

    -- Osaka
    ((SELECT city_id FROM cities WHERE name = 'Osaka'),
     (SELECT category_id FROM categories WHERE name = 'Food' AND type = 'activity'),
     'Dotonbori street-food crawl', 60.00, 150),

    -- Rome
    ((SELECT city_id FROM cities WHERE name = 'Rome'),
     (SELECT category_id FROM categories WHERE name = 'Sightseeing' AND type = 'activity'),
     'Colosseum & Forum guided tour', 45.00, 180),
    ((SELECT city_id FROM cities WHERE name = 'Rome'),
     (SELECT category_id FROM categories WHERE name = 'Museum' AND type = 'activity'),
     'Vatican Museums + Sistine Chapel', 55.00, 240),

    -- Florence
    ((SELECT city_id FROM cities WHERE name = 'Florence'),
     (SELECT category_id FROM categories WHERE name = 'Cultural' AND type = 'activity'),
     'Uffizi Gallery skip-the-line', 65.00, 120),
    ((SELECT city_id FROM cities WHERE name = 'Florence'),
     (SELECT category_id FROM categories WHERE name = 'Food' AND type = 'activity'),
     'Tuscan cooking class',       120.00, 240),

    -- Venice
    ((SELECT city_id FROM cities WHERE name = 'Venice'),
     (SELECT category_id FROM categories WHERE name = 'Sightseeing' AND type = 'activity'),
     'Gondola ride',                80.00, 40),

    -- Barcelona
    ((SELECT city_id FROM cities WHERE name = 'Barcelona'),
     (SELECT category_id FROM categories WHERE name = 'Sightseeing' AND type = 'activity'),
     'Sagrada Familia entry',       35.00, 90),
    ((SELECT city_id FROM cities WHERE name = 'Barcelona'),
     (SELECT category_id FROM categories WHERE name = 'Outdoor' AND type = 'activity'),
     'Park Güell morning walk',     10.00, 120),

    -- Madrid
    ((SELECT city_id FROM cities WHERE name = 'Madrid'),
     (SELECT category_id FROM categories WHERE name = 'Museum' AND type = 'activity'),
     'Prado Museum highlights',     18.00, 120),

    -- Seville
    ((SELECT city_id FROM cities WHERE name = 'Seville'),
     (SELECT category_id FROM categories WHERE name = 'Cultural' AND type = 'activity'),
     'Flamenco show in Triana',     45.00, 90),

    -- New York
    ((SELECT city_id FROM cities WHERE name = 'New York'),
     (SELECT category_id FROM categories WHERE name = 'Sightseeing' AND type = 'activity'),
     'Top of the Rock',             40.00, 60),
    ((SELECT city_id FROM cities WHERE name = 'New York'),
     (SELECT category_id FROM categories WHERE name = 'Nightlife' AND type = 'activity'),
     'Brooklyn rooftop bar night',   0.00, 180),

    -- San Francisco
    ((SELECT city_id FROM cities WHERE name = 'San Francisco'),
     (SELECT category_id FROM categories WHERE name = 'Outdoor' AND type = 'activity'),
     'Bike the Golden Gate',        45.00, 180),

    -- Austin
    ((SELECT city_id FROM cities WHERE name = 'Austin'),
     (SELECT category_id FROM categories WHERE name = 'Food' AND type = 'activity'),
     'BBQ joint tour',              70.00, 240);

-- ----- itinerary_items ------------------------------------------------------
-- 1-3 items per day, each pulling from a same-city activity.
-- We round-robin activities across the days of each stop so volumes stay varied.
DO $$
DECLARE
    r RECORD;
    day_row trip_days%ROWTYPE;
    item_count integer;
    activity_cursor CURSOR FOR
        SELECT a.activity_id
        FROM   activities a
        JOIN   cities c ON c.city_id = a.city_id
        JOIN   trip_stops ts ON ts.city_id = c.city_id
        WHERE  ts.trip_stop_id = r.trip_stop_id
        ORDER  BY a.activity_id;
    a_row activities%ROWTYPE;
    i integer;
BEGIN
    FOR r IN
        SELECT trip_stop_id, trip_id
        FROM   trip_stops
    LOOP
        FOR day_row IN
            SELECT * FROM trip_days
            WHERE  trip_stop_id = r.trip_stop_id
            ORDER  BY day_index
        LOOP
            -- 1-3 items per day, deterministic per stop so re-runs match.
            item_count := 1 + (day_row.day_index % 3);
            i := 0;
            FOR a_row IN activity_cursor LOOP
                EXIT WHEN i >= item_count;
                INSERT INTO itinerary_items
                    (trip_day_id, activity_id, scheduled_time, quantity, override_cost, note)
                VALUES
                    (day_row.trip_day_id, a_row.activity_id,
                     ('09:30'::time + (i * interval '2 hours')),
                     1,
                     NULL,
                     CASE WHEN i = 0 THEN NULL ELSE NULL END); -- intentionally no notes
                i := i + 1;
            END LOOP;
        END LOOP;
    END LOOP;
END $$;

-- ----- expenses -------------------------------------------------------------
-- A handful per trip covering different categories. trip_id + paid_by (owner).
INSERT INTO expenses (trip_id, paid_by, category_id, description, amount, currency, expense_date) VALUES
    -- Japan Spring 2026 (paid in JPY)
    ((SELECT trip_id FROM trips WHERE name = 'Japan Spring 2026'),
     (SELECT user_id FROM users WHERE email = 'yasha@example.com'),
     (SELECT category_id FROM categories WHERE name = 'Flights' AND type = 'expense'),
     'Round-trip SFO -> HND',         185000.00, 'JPY', '2026-03-27'),

    ((SELECT trip_id FROM trips WHERE name = 'Japan Spring 2026'),
     (SELECT user_id FROM users WHERE email = 'yasha@example.com'),
     (SELECT category_id FROM categories WHERE name = 'Lodging' AND type = 'expense'),
     'Tokyo hotel (4 nights)',         64000.00, 'JPY', '2026-03-28'),

    ((SELECT trip_id FROM trips WHERE name = 'Japan Spring 2026'),
     (SELECT user_id FROM users WHERE email = 'yasha@example.com'),
     (SELECT category_id FROM categories WHERE name = 'Lodging' AND type = 'expense'),
     'Kyoto ryokan (5 nights)',        95000.00, 'JPY', '2026-04-01'),

    ((SELECT trip_id FROM trips WHERE name = 'Japan Spring 2026'),
     (SELECT user_id FROM users WHERE email = 'yasha@example.com'),
     (SELECT category_id FROM categories WHERE name = 'Food' AND type = 'expense'),
     'Group dinner in Osaka',          18000.00, 'JPY', '2026-04-07'),

    -- Italian Summer (paid in EUR)
    ((SELECT trip_id FROM trips WHERE name = 'Italian Summer'),
     (SELECT user_id FROM users WHERE email = 'leo@example.com'),
     (SELECT category_id FROM categories WHERE name = 'Flights' AND type = 'expense'),
     'Round-trip JFK -> FCO',           720.00, 'EUR', '2026-06-11'),

    ((SELECT trip_id FROM trips WHERE name = 'Italian Summer'),
     (SELECT user_id FROM users WHERE email = 'leo@example.com'),
     (SELECT category_id FROM categories WHERE name = 'Lodging' AND type = 'expense'),
     'Rome Airbnb (4 nights)',          480.00, 'EUR', '2026-06-12'),

    ((SELECT trip_id FROM trips WHERE name = 'Italian Summer'),
     (SELECT user_id FROM users WHERE email = 'leo@example.com'),
     (SELECT category_id FROM categories WHERE name = 'Activities' AND type = 'expense'),
     'Colosseum + Vatican tickets',    100.00, 'EUR', '2026-06-13'),

    -- Iberian Loop (paid in EUR)
    ((SELECT trip_id FROM trips WHERE name = 'Iberian Loop'),
     (SELECT user_id FROM users WHERE email = 'mira@example.com'),
     (SELECT category_id FROM categories WHERE name = 'Transit' AND type = 'expense'),
     'AVE Madrid -> Seville',           85.00, 'EUR', '2026-09-11'),

    ((SELECT trip_id FROM trips WHERE name = 'Iberian Loop'),
     (SELECT user_id FROM users WHERE email = 'mira@example.com'),
     (SELECT category_id FROM categories WHERE name = 'Food' AND type = 'expense'),
     'Tapas crawl, Barcelona',          62.00, 'EUR', '2026-09-05'),

    -- US West Swing (paid in USD)
    ((SELECT trip_id FROM trips WHERE name = 'US West Swing'),
     (SELECT user_id FROM users WHERE email = 'sana@example.com'),
     (SELECT category_id FROM categories WHERE name = 'Flights' AND type = 'expense'),
     'JFK -> SFO',                      310.00, 'USD', '2026-10-15'),

    ((SELECT trip_id FROM trips WHERE name = 'US West Swing'),
     (SELECT user_id FROM users WHERE email = 'sana@example.com'),
     (SELECT category_id FROM categories WHERE name = 'Lodging' AND type = 'expense'),
     'SF hotel (4 nights)',             920.00, 'USD', '2026-10-15'),

    ((SELECT trip_id FROM trips WHERE name = 'US West Swing'),
     (SELECT user_id FROM users WHERE email = 'sana@example.com'),
     (SELECT category_id FROM categories WHERE name = 'Shopping' AND type = 'expense'),
     'Austin boot store',               180.00, 'USD', '2026-10-20');

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
