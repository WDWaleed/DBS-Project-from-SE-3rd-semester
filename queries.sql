CREATE TABLE Author (
    author_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    bio TEXT
);

CREATE TABLE Book (
    book_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author_id INT NOT NULL,
    genre VARCHAR(100),
    isbn VARCHAR(20) UNIQUE,
    publication_year INT unsigned,
    shelf_location VARCHAR(50),
    status ENUM('available', 'borrowed', 'lost') DEFAULT 'available',
    FOREIGN KEY (author_id) REFERENCES Author (author_id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE Member (
    member_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    membership_date DATE DEFAULT (CURRENT_DATE),
    status ENUM('active', 'inactive', 'banned') DEFAULT 'active'
);

CREATE TABLE Borrow (
    borrow_id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    book_id INT NOT NULL,
    borrow_date DATE DEFAULT (CURRENT_DATE),
    due_date DATE NOT NULL,
    return_date DATE,
    status ENUM('borrowed', 'returned', 'overdue') DEFAULT 'borrowed',
    FOREIGN KEY (member_id) REFERENCES Member (member_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES Book (book_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE Librarian (
    librarian_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL
);

INSERT INTO
    Author (name, bio)
VALUES
    (
        'J.K. Rowling',
        'British author, best known for the Harry Potter series.'
    ),
    (
        'George Orwell',
        'English novelist and essayist, known for 1984 and Animal Farm.'
    ),
    (
        'J.R.R. Tolkien',
        'English writer, poet, and academic, author of The Lord of the Rings.'
    ),
    (
        'Agatha Christie',
        'English writer known for detective novels.'
    ),
    (
        'Dan Brown',
        'American author best known for The Da Vinci Code.'
    );

INSERT INTO
    Book (
        title,
        author_id,
        genre,
        isbn,
        publication_year,
        shelf_location,
        status
    )
VALUES
    (
        'Harry Potter and the Philosopher''s Stone',
        1,
        'Fantasy',
        '9780747532699',
        1997,
        'A1',
        'available'
    ),
    (
        '1984',
        2,
        'Dystopian',
        '9780451524935',
        1949,
        'B2',
        'available'
    ),
    (
        'The Lord of the Rings',
        3,
        'Fantasy',
        '9780261102385',
        1954,
        'C3',
        'borrowed'
    ),
    (
        'Murder on the Orient Express',
        4,
        'Mystery',
        '9780007119318',
        1934,
        'D4',
        'available'
    ),
    (
        'The Da Vinci Code',
        5,
        'Thriller',
        '9780307474278',
        2003,
        'E5',
        'available'
    );

INSERT INTO
    Member (
        first_name,
        last_name,
        email,
        phone,
        address,
        membership_date,
        status
    )
VALUES
    (
        'Ali',
        'Khan',
        'ali.khan@example.com',
        '03001234567',
        'Lahore, Pakistan',
        '2024-02-01',
        'active'
    ),
    (
        'Sara',
        'Ahmed',
        'sara.ahmed@example.com',
        '03017654321',
        'Karachi, Pakistan',
        '2024-05-12',
        'active'
    ),
    (
        'Bilal',
        'Hussain',
        'bilal.hussain@example.com',
        '03019876543',
        'Islamabad, Pakistan',
        '2024-08-20',
        'active'
    );

INSERT INTO
    Borrow (
        member_id,
        book_id,
        borrow_date,
        due_date,
        return_date,
        status
    )
VALUES
    (
        1,
        3,
        '2025-10-15',
        '2025-10-29',
        NULL,
        'borrowed'
    ),
    (
        2,
        1,
        '2025-10-10',
        '2025-10-24',
        '2025-10-22',
        'returned'
    ),
    (
        3,
        2,
        '2025-09-20',
        '2025-10-04',
        '2025-10-10',
        'overdue'
    );

INSERT INTO
    Librarian (username, password, name, email)
VALUES
    (
        'admin1',
        'password123',
        'Waleed Ahmed',
        'waleed.admin@example.com'
    ),
    (
        'admin2',
        'secret123',
        'Hassan Raza',
        'hassan.raza@example.com'
    );

DELIMITER / /
CREATE TRIGGER set_due_date BEFORE INSERT ON borrow FOR EACH ROW
BEGIN
SET
    NEW.due_date = NEW.borrow_date + INTERVAL 14 DAY;

END;

/ / DELIMITER;

-- Trigger to automatically update book status when borrowed or returned
DELIMITER / /
CREATE TRIGGER update_book_status
AFTER INSERT ON borrow FOR EACH ROW
BEGIN
-- When a book is borrowed, set status to 'borrowed'
IF NEW.status = 'borrowed' THEN
UPDATE book
SET
    status = 'borrowed'
WHERE
    book_id = NEW.book_id;

END IF;

END;

/ /
CREATE TRIGGER update_book_status_on_return
AFTER
UPDATE ON borrow FOR EACH ROW
BEGIN
-- When a book is returned, set status back to 'available'
IF OLD.status = 'borrowed'
AND NEW.status = 'returned' THEN
UPDATE book
SET
    status = 'available'
WHERE
    book_id = NEW.book_id;

END IF;

END;

/ / DELIMITER;

SET
    global event_scheduler = ON;

CREATE event update_overdue_status ON schedule every 1 DAY DO UPDATE borrow
SET
    status = 'overdue'
WHERE
    status = 'borrowed'
    AND due_date < CURDATE ();

-- Simple Stored Procedure to borrow a book
DELIMITER / /
CREATE PROCEDURE borrow_book_simple (IN member_id_param INT, IN book_id_param INT)
BEGIN
INSERT INTO
    borrow (member_id, book_id, due_date)
VALUES
    (
        member_id_param,
        book_id_param,
        CURDATE () + INTERVAL 14 DAY
    );

END;

/ / DELIMITER;

-- Simple Stored Procedure to return a book
DELIMITER / /
CREATE PROCEDURE return_book_simple (IN borrow_id_param INT)
BEGIN
UPDATE borrow
SET
    status = 'returned',
    return_date = CURDATE ()
WHERE
    borrow_id = borrow_id_param;

END;

/ / DELIMITER;

-- Simple Stored Procedure to get books by genre
DELIMITER / /
CREATE PROCEDURE get_books_by_genre (IN genre_param VARCHAR(100))
BEGIN
SELECT
    book_id,
    title,
    author,
    isbn,
    publication_year,
    status
FROM
    book
WHERE
    genre = genre_param
ORDER BY
    title;

END;

/ / DELIMITER;

-- Simple Transaction Example with Commit/Rollback
DELIMITER / /
CREATE PROCEDURE safe_borrow_with_transaction (IN member_id_param INT, IN book_id_param INT)
BEGIN
DECLARE book_available INT;

DECLARE EXIT HANDLER FOR SQLEXCEPTION
BEGIN
-- Rollback transaction on any error
ROLLBACK;

-- Return error message
SELECT
    'Transaction failed - rolled back' AS result;

END;

-- Start transaction
START TRANSACTION;

-- Check if book is available
SELECT
    COUNT(*) INTO book_available
FROM
    book
WHERE
    book_id = book_id_param
    AND status = 'available';

IF book_available = 0 THEN
-- Book not available, rollback
SELECT
    'Book not available' AS result;

ROLLBACK;

ELSE
-- Book is available, proceed with borrowing
INSERT INTO
    borrow (member_id, book_id, due_date)
VALUES
    (
        member_id_param,
        book_id_param,
        CURDATE () + INTERVAL 14 DAY
    );

-- Update book status
UPDATE book
SET
    status = 'borrowed'
WHERE
    book_id = book_id_param;

-- If we get here, commit the transaction
COMMIT;

SELECT
    'Book borrowed successfully' AS result;

END IF;

END;

/ / DELIMITER;

-- Example of manual transaction (can be run directly)
-- START TRANSACTION;
--
-- INSERT INTO member (name, email, phone, address)
-- VALUES ('John Doe', 'john@example.com', '123-456-7890', '123 Main St');
--
-- INSERT INTO borrow (member_id, book_id, due_date)
-- VALUES (LAST_INSERT_ID(), 1, CURDATE() + INTERVAL 14 DAY);
--
-- COMMIT;  -- Or ROLLBACK; if something goes wrong
