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

SET
    global event_scheduler = ON;

CREATE event update_overdue_status ON schedule every 1 DAY DO UPDATE borrow
SET
    status = 'overdue'
WHERE
    status = 'borrowed'
    AND due_date < CURDATE ();
